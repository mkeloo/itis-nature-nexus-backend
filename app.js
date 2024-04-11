const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./script'); // Import the connectToDatabase function
const taxonApiRouter = require('./src/api/taxonApi'); // Import the taxonApi router

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Use the taxonApi router for handling requests to '/api/taxon' endpoint
app.use('/', taxonApiRouter); // Mount the taxonApiRouter at the '/api' base path

// Connect to the database when the server starts
async function startServer() {
  await connectToDatabase(); // Call the connectToDatabase function from script.js

  // Start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// Call startServer to initiate both database connection and server startup
startServer();
