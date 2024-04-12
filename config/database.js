require('dotenv').config();
const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const dbConfig = {
  user: process.env.ORACLE_DB_USER,
  password: process.env.ORACLE_DB_PASSWORD,
  connectString: process.env.ORACLE_DB_CONNECTION_STRING,
};

async function openConnection() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    console.log('Successfully connected to Oracle Database');
    return connection;
  } catch (err) {
    console.error('Failed to connect to the database:', err);
    throw err;
  }
}

module.exports = { openConnection };
