#' Main processing function
#' @param file_path Path to input file
#' @param source_country Country of data origin
#' @param data_date Date associated with the data
process_data_file <- function(file_path, source_country = NULL, 
                              data_date = NULL) {
  con <- initialize_db_connection()
  on.exit(dbDisconnect(con))
  
  tryCatch({
    # Start transaction
    dbBegin(con)
    
    # Create control record
    file_name <- basename(file_path)
    process_control_uid <- create_control_record(con, file_name, file_path, 
                                                 source_country, data_date)
    
    # Process through layers
    bronze_rows <- process_to_bronze(con, process_control_uid, file_path)
    silver_rows <- transform_to_silver(con, process_control_uid, 
                                       paste0("BRONZE_", format(Sys.Date(), "%Y%m%d")))
    gold_rows <- transform_to_gold(con, process_control_uid)
    
    # Commit transaction
    dbCommit(con)
    
    log_info("Successfully processed file: {file_name}")
    log_info("Rows processed - Bronze: {bronze_rows}, Silver: {silver_rows}, Gold: {gold_rows}")
    
  }, error = function(e) {
    dbRollback(con)
    log_error("Processing failed: {e$message}")
    stop(e)
  })
}