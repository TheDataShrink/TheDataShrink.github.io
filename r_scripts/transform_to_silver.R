#' Transform bronze to silver layer
#' @param con Database connection
#' @param process_control_uid Control record ID
#' @param bronze_table Bronze layer table name
#' @return Number of rows processed
transform_to_silver <- function(con, process_control_uid, bronze_table) {
  tryCatch({
    update_control_status(con, process_control_uid, 
                          "PROCESSING", "SILVER_TRANSFORMATION")
    
    # Execute silver layer transformation
    query <- sprintf("
      INSERT INTO SILVER_DATA (
        -- Add your column mappings here
      )
      SELECT 
        -- Add your transformation logic here
      FROM %s
    ", bronze_table)
    
    row_count <- dbExecute(con, query)
    
    update_control_status(con, process_control_uid, 
                          "SUCCESS", "SILVER_COMPLETE", 
                          row_count = row_count)
    
    return(row_count)
    
  }, error = function(e) {
    update_control_status(con, process_control_uid, 
                          "FAILED", "SILVER_ERROR", 
                          error_message = e$message)
    log_error("Silver layer transformation failed: {e$message}")
    stop(e)
  })
}