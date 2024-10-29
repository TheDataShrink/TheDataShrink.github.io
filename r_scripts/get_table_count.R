#' Utility function to get row count for a table
#' @param con database connection
#' @param table_name name of the table
#' @return number of rows in the table
get_table_count <- function(con, table_name) {
  tryCatch({
    query <- sprintf("SELECT COUNT(*) as count FROM %s", table_name)
    result <- DBI::dbGetQuery(con, query)
    return(result$count[1])
  }, error = function(e) {
    logger::log_error("Failed to get count for table {table_name}: {e$message}")
    return(NULL)
  })
}