const oracledb = require('oracledb');
const { openConnection } = require('../../config/database');

async function getRegionalTaxonomicDiversity(
  stateProvince,
  family,
  genus,
  orderBy
) {
  let connection;
  try {
    connection = await openConnection();
    const sql = `
        WITH RegionTaxonomy AS (
            SELECT
                og.stateProvince,
                bd.family,
                bd.genus,
                COUNT(DISTINCT bd.scientificName) AS NumberOfSpecies,
                COUNT(DISTINCT CASE WHEN bd.iucnRedListCategory IN ('VU', 'EN', 'CR') THEN bd.scientificName END) AS ThreatenedSpecies
            FROM
                observation_geospatial og
                JOIN bird_details bd ON og.gbifID = bd.gbifID
            WHERE
                (:stateProvince IS NULL OR og.stateProvince = :stateProvince) AND
                (:family IS NULL OR bd.family = :family) AND
                (:genus IS NULL OR bd.genus = :genus)
            GROUP BY
                og.stateProvince, bd.family, bd.genus
        ),
        ConservationFocus AS (
            SELECT
                stateProvince,
                family,
                genus,
                NumberOfSpecies,
                ThreatenedSpecies,
                (CAST(ThreatenedSpecies AS FLOAT) / NumberOfSpecies) * 100 AS ThreatenedPercentage
            FROM
                RegionTaxonomy
        )
        SELECT
            stateProvince,
            family,
            genus,
            NumberOfSpecies,
            ThreatenedSpecies,
            ROUND(ThreatenedPercentage, 2) AS ThreatenedPercentage
        FROM
            ConservationFocus
        ORDER BY
            ${orderBy}  -- Ensure to validate orderBy to prevent SQL Injection
    `;
    const result = await connection.execute(
      sql,
      {
        stateProvince,
        family,
        genus,
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );
    return result.rows;
  } catch (err) {
    console.error('Error in getRegionalTaxonomicDiversity:', err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(
          'Error closing connection in getRegionalTaxonomicDiversity:',
          err
        );
      }
    }
  }
}

module.exports = getRegionalTaxonomicDiversity;
