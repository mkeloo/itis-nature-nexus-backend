const oracledb = require('oracledb');
const { openConnection } = require('../../config/database');

async function getDynamicGrowthRates(
  startYear,
  endYear,
  growthRateThreshold,
  orderBy
) {
  let connection;
  try {
    connection = await openConnection();
    let sql = `
            WITH yearly_observations AS (
                SELECT
                    bd.scientificName,
                    ot.year,
                    COUNT(*) AS observation_count
                FROM
                    mkeloo.observation_temporal ot
                    JOIN mkeloo.bird_details bd ON ot.gbifID = bd.gbifID
                WHERE
                    ot.year BETWEEN :startYear AND :endYear
                GROUP BY
                    bd.scientificName, ot.year
            ),
            growth_rates AS (
                SELECT
                    scientificName,
                    year,
                    observation_count,
                    LAG(observation_count) OVER (PARTITION BY scientificName ORDER BY year) AS prev_year_count,
                    (observation_count - LAG(observation_count) OVER (PARTITION BY scientificName ORDER BY year)) / LAG(observation_count) OVER (PARTITION BY scientificName ORDER BY year) AS growth_rate
                FROM
                    yearly_observations
            ),
            significant_changes AS (
                SELECT
                    scientificName,
                    year,
                    observation_count,
                    prev_year_count,
                    growth_rate,
                    ROUND(growth_rate * 100, 2) AS growth_rate_percentage
                FROM
                    growth_rates
                WHERE
                    ABS(growth_rate) >= :growthRateThreshold
            )
            SELECT
                scientificName,
                year,
                observation_count,
                prev_year_count,
                growth_rate_percentage
            FROM
                significant_changes
            ORDER BY
                growth_rate_percentage ${
                  orderBy === 'asc' ? 'ASC' : 'DESC'
                }, scientificName, year
        `;
    const result = await connection.execute(
      sql,
      {
        startYear: startYear,
        endYear: endYear,
        growthRateThreshold: growthRateThreshold,
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );
    return result.rows;
  } catch (err) {
    console.error('Error in getDynamicGrowthRates:', err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(
          'Error closing connection in getDynamicGrowthRates:',
          err
        );
      }
    }
  }
}

module.exports = getDynamicGrowthRates;
