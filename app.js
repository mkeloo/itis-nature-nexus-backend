require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Import CORS module
const app = express();
const port = process.env.PORT || 3000;

const { openConnection } = require('./config/database');

const trendAPI = require('./src/api/trendAPI');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', trendAPI);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

async function startServer() {
  try {
    const connection = await openConnection();
    console.log('Successfully connected to Oracle Database from app.js');
    await connection.close();
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
}

startServer();

module.exports = app;
