#' Create new control record
#' @param con DuckDB connection
#' @param file_name Name of the file being processed
#' @param file_path Full path to the file
#' @param source_system Source system identifier
#' @param data_date Date associated with the data
#' @return Process control ID
create_control_record <- function(con, file_name, file_path, 
                                  source_system = NULL, data_date = NULL) {
  box::use(duckdb = duckdb[dbConnect])
  box::use(DBI = DBI[dbExecute, dbGetQuery])
  box::use(logger = logger[log_info, log_error])
  tryCatch({
    query <- "
      INSERT INTO PROCESS_CONTROL (
        FILE_NAME,
        FILE_PATH,
        RECEIVED_TIMESTAMP,
        STATUS,
        SOURCE_SYSTEM,
        DATA_DATE
      )
      VALUES (?, ?, ?, 'RECEIVED', ?, ?);"
    
    current_timestamp <- as.character(now())
    
    # Execute insert
    DBI$dbExecute(con, query,
              params = list(file_name, file_path,
                            current_timestamp,
                            source_system, data_date))
    
    # Get the last inserted ID
    result <- DBI$dbGetQuery(con, "SELECT last_insert_rowid() as id")
    control_id <- result$id[1]
    
    logger$log_info("Created control record {control_id} for file: {file_name}")
    return(control_id)
  }, error = function(e) {
    logger$log_error("Failed to create control record: {e$message}")
    return(NULL)
  })
}
