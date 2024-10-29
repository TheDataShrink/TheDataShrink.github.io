#' Transform silver to gold layer
#' @param con Database connection
#' @param process_control_uid Control record ID
#' @return Number of rows processed
transform_to_gold <- function(con, process_control_uid) {
  tryCatch({
    update_control_status(con, process_control_uid, 
                          "PROCESSING", "GOLD_TRANSFORMATION")
    
    # Execute gold layer transformation
    query <- "
      INSERT INTO GOLD_DATA (
        -- Add your column mappings here
      )
      SELECT 
        -- Add your aggregation logic here
      FROM SILVER_DATA
      WHERE PROCESS_CONTROL_UID = ?"
    
    row_count <- dbExecute(con, query, params = list(process_control_uid))
    
    update_control_status(con, process_control_uid, 
                          "SUCCESS", "GOLD_COMPLETE", 
                          row_count = row_count)
    
    return(row_count)
    
  }, error = function(e) {
    update_control_status(con, process_control_uid, 
                          "FAILED", "GOLD_ERROR", 
                          error_message = e$message)
    log_error("Gold layer transformation failed: {e$message}")
    stop(e)
  })
}