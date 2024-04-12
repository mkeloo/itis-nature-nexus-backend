const oracledb = require('oracledb');
const dbConfig = require('../config/database');

// 1. Bird Observations and Climate Variations Correlation
// File: getBirdClimateCorrelation.js

async function getBirdClimateCorrelation() {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `
            WITH bird_observations_summary AS (
                SELECT
                    stateProvince,
                    EXTRACT(YEAR FROM eventDate) AS observation_year,
                    COUNT(DISTINCT scientificName) AS species_count,
                    COUNT(*) AS observation_count
                FROM
                    bird_observations
                GROUP BY
                    stateProvince, EXTRACT(YEAR FROM eventDate)
            ),
            climate_summary AS (
                SELECT
                    stateProvince,
                    year,
                    annual_precipitation,
                    annual_avg_temperature
                FROM
                    climate_data
            ),
            combined_analysis AS (
                SELECT
                    b.stateProvince,
                    b.observation_year AS year,
                    b.species_count,
                    b.observation_count,
                    c.annual_precipitation AS precipitation,
                    c.annual_avg_temperature AS avg_temperature
                FROM
                    bird_observations_summary b
                    JOIN climate_summary c ON b.stateProvince = c.stateProvince AND b.observation_year = c.year
            )
            SELECT
                *,
                CASE
                    WHEN precipitation > (SELECT AVG(annual_precipitation) FROM climate_summary) THEN 'High Precipitation'
                    WHEN avg_temperature > (SELECT AVG(annual_avg_temperature) FROM climate_summary) THEN 'High Temperature'
                    ELSE 'Average Conditions'
                END AS climate_condition
            FROM
                combined_analysis
            ORDER BY
                year, stateProvince;
        `;
    const result = await connection.execute(sql, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    return result.rows;
  } catch (err) {
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

module.exports = getBirdClimateCorrelation;
