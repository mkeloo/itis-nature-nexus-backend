const oracledb = require('oracledb');
const { openConnection } = require('../../config/database');

async function getDiversityIndex(startYear, endYear) {
  let connection;
  try {
    connection = await openConnection();
    const sql = `
            WITH yearly_data AS (
                SELECT
                    ot.year,
                    bd.scientificName,
                    COUNT(*) AS observation_count
                FROM
                    observation_temporal ot
                    JOIN bird_details bd ON ot.gbifID = bd.gbifID
                WHERE
                    ot.year BETWEEN :startYear AND :endYear
                GROUP BY
                    ot.year, bd.scientificName
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
                year
        `;
    const result = await connection.execute(
      sql,
      { startYear, endYear },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );
    return result.rows;
  } catch (err) {
    console.error('Error in getDiversityIndex:', err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection in getDiversityIndex:', err);
      }
    }
  }
}

module.exports = getDiversityIndex;
