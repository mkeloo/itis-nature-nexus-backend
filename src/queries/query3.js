const oracledb = require('oracledb');
const dbConfig = require('../config/database');

// 3. Year-over-Year Growth Rate in Species Observations
// File: getGrowthRates.js

async function getGrowthRates() {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `
          WITH yearly_observations AS (
              SELECT
                  bd.scientificName,
                  ot.year,
                  COUNT(*) AS observation_count
              FROM
                  observation_temporal ot
                  JOIN bird_details bd ON ot.gbifID = bd.gbifID
              GROUP BY
                  bd.scientificName, ot.year
          ),
          growth_rates AS (
              SELECT
                  scientificName,
                  year,
                  observation_count,
                  (observation_count - LAG(observation_count) OVER (PARTITION BY scientificName ORDER BY year)) / LAG(observation_count) OVER (PARTITION BY scientificName ORDER BY year) AS growth_rate
              FROM
                  yearly_observations
          )
          SELECT
              scientificName,
              year,
              observation_count,
              ROUND(growth_rate * 100, 2) AS growth_rate_percentage
          FROM
              growth_rates
          WHERE
              growth_rate IS NOT NULL
          ORDER BY
              scientificName, year;
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

module.exports = getGrowthRates;
