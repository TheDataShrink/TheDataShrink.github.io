#' Process data file to bronze layer
#' @param con Database connection
#' @param process_control_uid Control record ID
#' @param file_path Path to input file
#' @return Number of rows processed
process_to_bronze <- function(con, process_control_uid, file_path) {
  tryCatch({
    # Update status to processing
    update_control_status(con, process_control_uid, 
                          "PROCESSING", "BRONZE_INGESTION")
    
    # Read data based on file extension
    data <- if(endsWith(file_path, ".rds")) {
      readRDS(file_path)
    } else if(endsWith(file_path, ".csv")) {
      read_csv(file_path)
    } else {
      stop("Unsupported file format")
    }
    
    # Insert into bronze layer
    table_name <- paste0("BRONZE_", format(Sys.Date(), "%Y%m%d"))
    dbWriteTable(con, table_name, data, append = TRUE)
    
    row_count <- nrow(data)
    
    # Update status to success
    update_control_status(con, process_control_uid, 
                          "SUCCESS", "BRONZE_COMPLETE", 
                          row_count = row_count)
    
    return(row_count)
    
  }, error = function(e) {
    update_control_status(con, process_control_uid, 
                          "FAILED", "BRONZE_ERROR", 
                          error_message = e$message)
    log_error("Bronze layer processing failed: {e$message}")
    stop(e)
  })
}
