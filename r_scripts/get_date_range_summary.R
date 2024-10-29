#' Get summary statistics for a specific date range
#' @param con database connection
#' @param start_date start date for the summary
#' @param end_date end date for the summary
#' @return list of summary dataframes
get_date_range_summary <- function(con, start_date, end_date) {
  tryCatch({
    # Daily catch summary
    daily_summary <- dbGetQuery(con, "
      SELECT *
      FROM SILVER_DAILY_CATCH
      WHERE catch_day BETWEEN ? AND ?
      ORDER BY catch_day
    ", params = list(start_date, end_date))
    
    # Monthly vessel summary
    monthly_summary <- dbGetQuery(con, "
      SELECT *
      FROM SILVER_MONTHLY_VESSEL_STATS
      WHERE catch_month BETWEEN ? AND ?
      ORDER BY catch_month
    ", params = list(start_date, end_date))
    
    # Species summary for the period
    species_summary <- dbGetQuery(con, "
      SELECT 
        s.*,
        ROUND(s.total_weight / 
          (SELECT SUM(total_weight) FROM SILVER_SPECIES_SUMMARY) * 100, 2
        ) as percentage_of_total_catch
      FROM SILVER_SPECIES_SUMMARY s
    ")
    
    return(list(
      daily_summary = daily_summary,
      monthly_summary = monthly_summary,
      species_summary = species_summary
    ))
    
  }, error = function(e) {
    logger::log_error("Failed to get date range summary: {e$message}")
    return(NULL)
  })
}