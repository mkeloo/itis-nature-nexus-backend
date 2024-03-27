require('dotenv').config();
const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function run() {
  let connection;

  try {
    // trying to connect to the UF Oracle CISE database
    connection = await oracledb.getConnection({
      user: process.env.ORACLE_DB_USER,
      password: process.env.ORACLE_DB_PASSWORD,
      connectString: process.env.ORACLE_DB_CONNECTION_STRING,
    });

    // success msg
    console.log('Successfully connected to the database.');

    // execute query to retrieve all table names in the schema
    const result = await connection.execute(
      `SELECT table_name FROM user_tables`
    );

    // console.log all the itis db table names
    console.log('All Tables in the ITIS-database:', result);
  } catch (err) {
    console.error('Error during database operation:', err);
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log('Closed the database connection.');
      } catch (err) {
        console.error('Error closing the database connection:', err);
      }
    }
  }
}

run();
