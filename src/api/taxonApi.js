const express = require('express');
const getTaxonData = require('./queries/query1');

const app = express();
const port = process.env.PORT || 3000;

app.get('/api/taxon', async (req, res) => {
  try {
    console.log(
      'attempting to connect to the database and fetch taxon data...'
    );
    const data = await getTaxonData();
    console.log('connection was successful. Data fetched:', data);
    res.json(data);
  } catch (error) {
    console.error('Failed to fetch taxon data:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
