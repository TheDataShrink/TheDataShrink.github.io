#' Utility function to list all tables in the database
#' @param con database connection
#' @return character vector of table names
list_tables <- function(con) {
  box::use(duckdb = duckdb[dbListTables])
  return(dbListTables(con))
}