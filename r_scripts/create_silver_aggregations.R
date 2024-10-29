#' Create or update silver layer aggregation tables
#' @param con database connection
#' @param process_control_id ID of the current processing run
#' @return boolean indicating success
create_silver_aggregations <- function(con) {
  box::use(DBI = DBI[dbExecute])
  
  tryCatch({
    # Daily catch summary
    daily_catch_query <- "
      CREATE TABLE IF NOT EXISTS SILVER_DAILY_CATCH AS
      SELECT 
        DATE_TRUNC('day', catch_date) as catch_day,
        species,
        fishing_area,
        COUNT(*) as number_of_catches,
        SUM(catch_weight_kg) as total_catch_weight,
        AVG(catch_weight_kg) as avg_catch_weight,
        COUNT(DISTINCT vessel_id) as unique_vessels
      FROM BRONZE_CATCH_DATA
      GROUP BY 
        DATE_TRUNC('day', catch_date),
        species,
        fishing_area;
    "
    
    # Monthly vessel summary
    monthly_vessel_query <- "
      CREATE TABLE IF NOT EXISTS SILVER_MONTHLY_VESSEL_STATS AS
      SELECT 
        DATE_TRUNC('month', catch_date) as catch_month,
        vessel_id,
        fishing_area,
        COUNT(*) as fishing_days,
        COUNT(DISTINCT species) as species_caught,
        SUM(catch_weight_kg) as total_catch_weight,
        AVG(catch_weight_kg) as avg_catch_per_day
      FROM BRONZE_CATCH_DATA
      GROUP BY 
        DATE_TRUNC('month', catch_date),
        vessel_id,
        fishing_area;
    "
    
    # Species distribution summary
    species_summary_query <- "
      CREATE TABLE IF NOT EXISTS SILVER_SPECIES_SUMMARY AS
      SELECT 
        species,
        fishing_area,
        COUNT(*) as total_catches,
        SUM(catch_weight_kg) as total_weight,
        AVG(catch_weight_kg) as avg_catch_weight,
        MIN(catch_weight_kg) as min_catch_weight,
        MAX(catch_weight_kg) as max_catch_weight,
        COUNT(DISTINCT DATE_TRUNC('day', catch_date)) as active_days,
        COUNT(DISTINCT vessel_id) as unique_vessels
      FROM BRONZE_CATCH_DATA
      GROUP BY 
        species,
        fishing_area;
    "
    
    # Execute the creation queries
    dbExecute(con, daily_catch_query)
    dbExecute(con, monthly_vessel_query)
    dbExecute(con, species_summary_query)
    
    # Update functions for each aggregation
    update_daily_catch <- function() {
      query <- "
        INSERT INTO SILVER_DAILY_CATCH
        SELECT 
          DATE_TRUNC('day', catch_date) as catch_day,
          species,
          fishing_area,
          COUNT(*) as number_of_catches,
          SUM(catch_weight_kg) as total_catch_weight,
          AVG(catch_weight_kg) as avg_catch_weight,
          COUNT(DISTINCT vessel_id) as unique_vessels
        FROM BRONZE_CATCH_DATA
        WHERE catch_date > (SELECT COALESCE(MAX(catch_day), '1900-01-01') FROM SILVER_DAILY_CATCH)
        GROUP BY 
          DATE_TRUNC('day', catch_date),
          species,
          fishing_area;
      "
      dbExecute(con, query)
    }
    
    update_monthly_vessel <- function() {
      query <- "
        INSERT INTO SILVER_MONTHLY_VESSEL_STATS
        SELECT 
          DATE_TRUNC('month', catch_date) as catch_month,
          vessel_id,
          fishing_area,
          COUNT(*) as fishing_days,
          COUNT(DISTINCT species) as species_caught,
          SUM(catch_weight_kg) as total_catch_weight,
          AVG(catch_weight_kg) as avg_catch_per_day
        FROM BRONZE_CATCH_DATA
        WHERE catch_date > (SELECT COALESCE(MAX(catch_month), '1900-01-01') FROM SILVER_MONTHLY_VESSEL_STATS)
        GROUP BY 
          DATE_TRUNC('month', catch_date),
          vessel_id,
          fishing_area;
      "
      dbExecute(con, query)
    }
    
    update_species_summary <- function() {
      query <- "
        DELETE FROM SILVER_SPECIES_SUMMARY;
        INSERT INTO SILVER_SPECIES_SUMMARY
        SELECT 
          species,
          fishing_area,
          COUNT(*) as total_catches,
          SUM(catch_weight_kg) as total_weight,
          AVG(catch_weight_kg) as avg_catch_weight,
          MIN(catch_weight_kg) as min_catch_weight,
          MAX(catch_weight_kg) as max_catch_weight,
          COUNT(DISTINCT DATE_TRUNC('day', catch_date)) as active_days,
          COUNT(DISTINCT vessel_id) as unique_vessels
        FROM BRONZE_CATCH_DATA
        GROUP BY 
          species,
          fishing_area;
      "
      dbExecute(con, query)
    }
    
    # Update all aggregations
    update_daily_catch()
    update_monthly_vessel()
    update_species_summary()
    
    logger::log_info("Successfully created and updated silver layer aggregations")
    return(TRUE)
    
  }, error = function(e) {
    logger::log_error("Failed to create silver aggregations: {e$message}")
    return(FALSE)
  })
}
