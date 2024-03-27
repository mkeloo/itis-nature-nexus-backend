const oracledb = require('oracledb');

async function getTaxonData() {
  let connection;
  let result;

  try {
    connection = await oracledb.getConnection({
      user: process.env.ORACLE_DB_USER,
      password: process.env.ORACLE_DB_PASSWORD,
      connectString: process.env.ORACLE_DB_CONNECTION_STRING,
    });

    result = await connection.execute(`SELECT * FROM Taxon`);
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error(error);
      }
    }
  }

  return result ? result.rows : null;
}

module.exports = getTaxonData;
