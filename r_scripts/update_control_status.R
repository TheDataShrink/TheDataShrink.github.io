#' Update control record status
#' @param con DuckDB connection
#' @param process_control_id Control record ID
#' @param status New status
#' @param step Current processing step
#' @param error_message Error message if applicable
#' @param row_count Number of rows processed
#' @return boolean indicating success
update_control_status <- function(con, process_control_id, status,
                                  step = NULL, error_message = NULL,
                                  row_count = NULL) {
  tryCatch({
    query <- "
      UPDATE PROCESS_CONTROL
      SET STATUS = ?,
          STEP = ?,
          ERROR_MESSAGE = ?,
          ROW_COUNT = ?,
          PROCESSED_TIMESTAMP = CASE
            WHEN ? IN ('SUCCESS', 'FAILED') THEN ?
            ELSE PROCESSED_TIMESTAMP
          END
      WHERE PROCESS_CONTROL_ID = ?"
    
    current_timestamp <- as.character(now())
    dbExecute(con, query,
              params = list(status, step, error_message,
                            row_count, status, current_timestamp,
                            process_control_id))
    
    log_info("Updated control record {process_control_id} to status: {status}")
    return(TRUE)
  }, error = function(e) {
    log_error("Failed to update control record: {e$message}")
    return(FALSE)
  })
}