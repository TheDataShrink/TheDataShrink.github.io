#' Get processing status for date range
#' @param con DuckDB connection
#' @param start_date Start date for filtering
#' @param end_date End date for filtering
#' @return Data frame with processing status
get_processing_status <- function(con, start_date = NULL, end_date = NULL) {
  tryCatch({
    query <- "
      SELECT 
        PROCESS_CONTROL_ID,
        FILE_NAME,
        STATUS,
        STEP,
        RECEIVED_TIMESTAMP,
        PROCESSED_TIMESTAMP,
        ROW_COUNT,
        ERROR_MESSAGE,
        SOURCE_SYSTEM,
        DATA_DATE
      FROM PROCESS_CONTROL
      WHERE 1=1"
    
    if (!is.null(start_date)) {
      query <- paste0(query,
                      " AND RECEIVED_TIMESTAMP >= '", start_date, "'")
    }
    
    if (!is.null(end_date)) {
      query <- paste0(query,
                      " AND RECEIVED_TIMESTAMP <= '", end_date, "'")
    }
    
    query <- paste0(query, " ORDER BY RECEIVED_TIMESTAMP DESC")
    
    return(dbGetQuery(con, query))
  }, error = function(e) {
    log_error("Failed to get processing status: {e$message}")
    return(NULL)
  })
}