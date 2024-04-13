const oracledb = require('oracledb');
const { openConnection } = require('../../config/database');

// 4. Investigating Bird Population Dynamics
// File: getPopulationDynamics.js

async function getPopulationDynamics() {
  let connection;
  try {
    connection = await openConnection(); // Consistent connection handling
    const sql = `
        WITH annual_data AS (
            SELECT DISTINCT
                og.stateProvince,
                ot.year,
                bd.scientificName,
                bd.iucnRedListCategory,
                COUNT(*) AS observation_count
            FROM
                observation_temporal ot
                JOIN observation_geospatial og ON ot.gbifID = og.gbifID
                JOIN bird_details bd ON ot.gbifID = bd.gbifID
            GROUP BY
                og.stateProvince,
                ot.year,
                bd.scientificName,
                bd.iucnRedListCategory
        ),
        biodiversity_index AS (
            SELECT DISTINCT
                stateProvince,
                year,
                COUNT(DISTINCT scientificName) AS species_count,
                SUM(observation_count) AS total_observations,
                EXP(SUM(observation_count * LN(observation_count)) / SUM(observation_count) - LN(SUM(observation_count) / COUNT(DISTINCT scientificName))) AS biodiversity_index
            FROM
                annual_data
            GROUP BY
                stateProvince,
                year
        ),
        growth_rates AS (
            SELECT DISTINCT
                stateProvince,
                scientificName,
                year,
                observation_count,
                LAG(observation_count, 1) OVER (PARTITION BY stateProvince, scientificName ORDER BY year) AS prev_year_count,
                (observation_count - LAG(observation_count, 1) OVER (PARTITION BY stateProvince, scientificName ORDER BY year)) / LAG(observation_count, 1) OVER (PARTITION BY stateProvince, scientificName ORDER BY year) AS growth_rate
            FROM
                annual_data
        ),
        conservation_trends AS (
            SELECT DISTINCT
                stateProvince,
                year,
                iucnRedListCategory,
                COUNT(*) AS category_count,
                RANK() OVER (PARTITION BY stateProvince, year ORDER BY COUNT(*) DESC) AS rank
            FROM
                annual_data
            GROUP BY
                stateProvince,
                year,
                iucnRedListCategory
        )
        SELECT DISTINCT
            a.stateProvince,
            a.year,
            b.species_count,
            b.total_observations,
            b.biodiversity_index,
            c.scientificName,
            c.observation_count,
            c.prev_year_count,
            c.growth_rate,
            d.iucnRedListCategory,
            d.category_count
        FROM
            annual_data a
            JOIN biodiversity_index b ON a.stateProvince = b.stateProvince AND a.year = b.year
            JOIN growth_rates c ON a.stateProvince = c.stateProvince AND a.year = c.year
            JOIN conservation_trends d ON a.stateProvince = d.stateProvince AND a.year = d.year AND d.rank = 1
        ORDER BY
            a.stateProvince, a.year
        FETCH FIRST 10 ROWS ONLY
    `;
    const result = await connection.execute(sql, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    return result.rows;
  } catch (err) {
    console.error('Error in getPopulationDynamics:', err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(
          'Error closing connection in getPopulationDynamics:',
          err
        );
      }
    }
  }
}

module.exports = getPopulationDynamics;
