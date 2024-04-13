const oracledb = require('oracledb');
const { openConnection } = require('../../config/database');

// 3. Year-over-Year Growth Rate in Species Observations
// File: getGrowthRates.js

async function getGrowthRates() {
  let connection;
  try {
    connection = await openConnection(); // Use the consistent connection method
    const sql = `
            WITH yearly_observations AS (
              SELECT
                bd.scientificName,  -- Selecting scientific name from bird_details
                ot.year,            -- Year from observation_temporal
                COUNT(*) AS observation_count  -- Count of observations per species per year
              FROM
                observation_temporal ot
                JOIN bird_details bd ON ot.gbifID = bd.gbifID  -- Joining tables on gbifID
              GROUP BY
                bd.scientificName, ot.year
            ),
            growth_rates AS (
              SELECT
                yo.scientificName,
                yo.year,
                yo.observation_count,
                (yo.observation_count - LAG(yo.observation_count) OVER (
                  PARTITION BY yo.scientificName ORDER BY yo.year
                )) / LAG(yo.observation_count) OVER (
                  PARTITION BY yo.scientificName ORDER BY yo.year
                ) AS growth_rate  -- Calculating growth rate using LAG to get previous year's count
              FROM
                yearly_observations yo
            )
            SELECT
              scientificName,
              year,
              observation_count,
              ROUND(growth_rate * 100, 2) AS growth_rate_percentage  -- Final selection, rounding growth rate
            FROM
              growth_rates
            WHERE
              growth_rate IS NOT NULL  -- Filtering out nulls to avoid incomplete data
            ORDER BY
              scientificName, year  -- Ordering results
        `;
    const result = await connection.execute(sql, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    return result.rows;
  } catch (err) {
    console.error('Error in getGrowthRates:', err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection in getGrowthRates:', err);
      }
    }
  }
}

module.exports = getGrowthRates;
