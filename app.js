const express = require('express');
const cors = require('cors');
const taxonApi = require('./api/taxonApi');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', taxonApi);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
