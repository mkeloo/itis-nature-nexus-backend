const oracledb = require('oracledb');
const dbConfig = require('../config/database');

// 5. Regional Taxonomic Diversity and Conservation Priorities
// File: getRegionalTaxonomicDiversity.js

async function getRegionalTaxonomicDiversity() {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `
            WITH RegionTaxonomy AS (
                SELECT
                    ol.StateProvince,
                    ti.Family,
                    ti.Genus,
                    COUNT(DISTINCT cs.ScientificName) AS NumberOfSpecies,
                    COUNT(DISTINCT CASE WHEN cs.IUCNRedListCategory IN ('VU', 'EN', 'CR') THEN cs.ScientificName END) AS ThreatenedSpecies
                FROM
                    ObservationLocations ol
                    JOIN TaxonomicInformation ti ON ol.ObservationID = ti.ObservationID
                    JOIN ConservationStatus cs ON ti.ScientificName = cs.ScientificName
                GROUP BY
                    ol.StateProvince, ti.Family, ti.Genus
            ),
            ConservationFocus AS (
                SELECT
                    StateProvince,
                    Family,
                    Genus,
                    NumberOfSpecies,
                    ThreatenedSpecies,
                    (CAST(ThreatenedSpecies AS FLOAT) / NumberOfSpecies) * 100 AS ThreatenedPercentage
                FROM
                    RegionTaxonomy
            )
            SELECT
                StateProvince,
                Family,
                Genus,
                NumberOfSpecies,
                ThreatenedSpecies,
                ROUND(ThreatenedPercentage, 2) AS ThreatenedPercentage
            FROM
                ConservationFocus
            ORDER BY
                ThreatenedPercentage DESC, ThreatenedSpecies DESC
            LIMIT 10;
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

module.exports = getRegionalTaxonomicDiversity;
