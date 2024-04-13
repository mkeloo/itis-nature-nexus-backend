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
                scientificName,
                year,
                COUNT(*) AS observation_count
              FROM
                bird_observations
              GROUP BY
                scientificName, year
            ),
            growth_rates AS (
              SELECT
                a.scientificName,
                a.year,
                a.observation_count,
                (a.observation_count - LAG(a.observation_count) OVER (PARTITION BY a.scientificName ORDER BY a.year)) / LAG(a.observation_count) OVER (PARTITION BY a.scientificName ORDER BY a.year) AS growth_rate
              FROM
                yearly_observations a
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
