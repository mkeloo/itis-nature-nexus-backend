const express = require('express');
const router = express.Router();

// Importing query functions from their respective files
const getBirdClimateCorrelation = require('../queries/query1');
const getDiversityIndex = require('../queries/query2');
const getSpeciesGrowthRates = require('../queries/query3');
const getPopulationDynamics = require('../queries/query4');
const getRegionalTaxonomicDiversity = require('../queries/query5');

// QUERY 1: Endpoint for bird observation and climate variation correlation with dynamic parameters
router.get('/query1', async (req, res) => {
  try {
    // Extracting parameters from the query string and providing defaults if not specified
    const stateProvince = req.query.stateProvince || null; // Default to null if not provided
    const startYear = parseInt(req.query.startYear) || 2000; // Default start year if not provided
    const endYear = parseInt(req.query.endYear) || new Date().getFullYear(); // Default to current year if not provided

    // Calling the modified function with parameters
    const data = await getBirdClimateCorrelation(
      stateProvince,
      startYear,
      endYear
    );
    res.json(data);
  } catch (error) {
    console.error('Error in /query1 endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

// QUERY 2: Endpoint for biodiversity index trends with dynamic parameters
router.get('/query2', async (req, res) => {
  try {
    // Extracting parameters from the query string and providing defaults if not specified
    const startYear = parseInt(req.query.startYear) || 1900; // Default start year if not provided
    const endYear = parseInt(req.query.endYear) || new Date().getFullYear(); // Default to current year if not provided

    // Calling the modified function with parameters
    const data = await getDiversityIndex(startYear, endYear);
    res.json(data);
  } catch (error) {
    console.error('Error in /query2 endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

// QUERY 3: Endpoint for species growth rate trends with dynamic parameters
router.get('/query3', async (req, res) => {
  try {
    // Extracting parameters from the query string and providing defaults if not specified
    const startYear = parseInt(req.query.startYear) || 2000; // Default start year if not provided
    const endYear = parseInt(req.query.endYear) || new Date().getFullYear(); // Default to current year if not provided
    const growthRateThreshold =
      parseFloat(req.query.growthRateThreshold) || 0.5; // Default threshold if not provided

    // Calling the modified function with parameters
    const data = await getSpeciesGrowthRates(
      startYear,
      endYear,
      growthRateThreshold
    );
    res.json(data);
  } catch (error) {
    console.error('Error in /query3 endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

// QUERY 4: Endpoint for bird population dynamics trends with dynamic parameters
router.get('/query4', async (req, res) => {
  try {
    // Extracting parameters from the query string and providing defaults if not specified
    const startYear = parseInt(req.query.startYear) || 2000; // Default start year if not provided
    const endYear = parseInt(req.query.endYear) || new Date().getFullYear(); // Default to current year if not provided
    const stateProvince = req.query.stateProvince || 'Tirol'; // Default to 'Tirol' if not provided
    const orderBy = req.query.orderBy || 'year ASC'; // Default sorting by year ascending if not provided

    // Calling the modified function with parameters
    const data = await getPopulationDynamics(
      startYear,
      endYear,
      stateProvince,
      orderBy
    );
    res.json(data);
  } catch (error) {
    console.error('Error in /query4 endpoint:', error);
    res.status500.json({ error: error.message });
  }
});

// QUERY 5: Endpoint for regional taxonomic diversity and conservation priorities with dynamic parameters
router.get('/query5', async (req, res) => {
  try {
    // Extracting parameters from the query string
    const stateProvince = req.query.stateProvince; // Filtering by stateProvince if provided
    const family = req.query.family; // Filtering by family if provided
    const genus = req.query.genus; // Filtering by genus if provided
    const orderBy = req.query.orderBy || 'ThreatenedPercentage DESC'; // Default sorting

    // Calling the function with dynamic parameters
    const data = await getRegionalTaxonomicDiversity(
      stateProvince,
      family,
      genus,
      orderBy
    );
    res.json(data);
  } catch (error) {
    console.error('Error in /query5 endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
