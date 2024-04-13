// app.js

require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Import the openConnection function from your database configuration
const { openConnection } = require('./config/database');

// Require the API routes
const trendAPI = require('./src/api/trendAPI');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the API routes
app.use('/api', trendAPI);

// Root route for basic testing
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Function to check database connection and start the server
async function startServer() {
  try {
    // Attempt to connect to the database
    const connection = await openConnection();
    console.log('Successfully connected to Oracle Database from app.js');
    // If successful, close the connection
    await connection.close();
    // Start listening for requests after a successful database connection
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1); // Exit the process with an error code
  }
}

// Start the server with database connection check
startServer();

module.exports = app;
