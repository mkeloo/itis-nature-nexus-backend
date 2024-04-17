const oracledb = require('oracledb');
const { openConnection } = require('../../config/database');

async function getBirdClimateCorrelation(stateProvince, startYear, endYear) {
  let connection;
  try {
    connection = await openConnection();
    const sql = `
        WITH bird_observations_summary AS (
            SELECT
                o.stateProvince,
                EXTRACT(YEAR FROM o.eventDate) AS observation_year,
                COUNT(DISTINCT b.scientificName) AS species_count,
                COUNT(*) AS observation_count
            FROM
                mkeloo.observation_temporal o
                JOIN mkeloo.bird_details b ON o.gbifID = b.gbifID
            WHERE
                (:stateProvince IS NULL OR o.stateProvince = :stateProvince) AND
                EXTRACT(YEAR FROM o.eventDate) BETWEEN :startYear AND :endYear
            GROUP BY
                o.stateProvince, EXTRACT(YEAR FROM o.eventDate)
        ),
        climate_summary AS (
            SELECT
                p.year,
                p.annual_precipitation_median AS precipitation,
                t.annual_temperature_median AS avg_temperature
            FROM
              mkeloo.climate_precipitation p
                JOIN mkeloo.climate_temperature t ON p.year = t.year
            WHERE
                p.year BETWEEN :startYear AND :endYear
        ),
        combined_analysis AS (
            SELECT
                b.stateProvince,
                b.observation_year AS year,
                b.species_count,
                b.observation_count,
                c.precipitation,
                c.avg_temperature
            FROM
                bird_observations_summary b
                JOIN climate_summary c ON b.observation_year = c.year
        )
        SELECT
            ca.stateProvince,
            ca.year,
            ca.species_count,
            ca.observation_count,
            ca.precipitation,
            ca.avg_temperature,
            CASE
                WHEN ca.precipitation > (SELECT AVG(precipitation) FROM climate_summary) THEN 'High Precipitation'
                WHEN ca.avg_temperature > (SELECT AVG(avg_temperature) FROM climate_summary) THEN 'High Temperature'
                ELSE 'Average Conditions'
            END AS climate_condition
        FROM
            combined_analysis ca
        ORDER BY
            ca.year, ca.stateProvince
    `;
    const result = await connection.execute(
      sql,
      {
        stateProvince,
        startYear,
        endYear,
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );
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