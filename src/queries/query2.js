const oracledb = require('oracledb');
const dbConfig = require('../config/database');

// 2. Diversity Index Calculation Across Years
// File: getDiversityIndex.js

async function getDiversityIndex() {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `
            WITH yearly_data AS (
              SELECT
                EXTRACT(YEAR FROM eventDate) AS year,
                scientificName,
                COUNT(*) AS observation_count
              FROM
                bird_observations
              GROUP BY
                EXTRACT(YEAR FROM eventDate), scientificName
            ),
            diversity_index AS (
              SELECT
                year,
                COUNT(scientificName) AS species_count,
                SUM(observation_count) AS total_observations,
                SUM(observation_count * LN(observation_count)) AS sum_ln_observations
              FROM
                yearly_data
              GROUP BY
                year
            ),
            biodiversity_scores AS (
              SELECT
                year,
                species_count,
                EXP((sum_ln_observations / total_observations) - LN(total_observations / species_count)) AS biodiversity_index
              FROM
                diversity_index
            )
            SELECT
              year,
              ROUND(biodiversity_index, 2) AS biodiversity_score
            FROM
              biodiversity_scores
            ORDER BY
              year;
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

module.exports = getDiversityIndex;
