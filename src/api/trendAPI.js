const express = require('express');
const router = express.Router();

const getBirdClimateCorrelation = require('../queries/query1');
const getDiversityIndex = require('../queries/query2');
const getSpeciesGrowthRates = require('../queries/query3');
const getPopulationDynamics = require('../queries/query4');
const getRegionalTaxonomicDiversity = require('../queries/query5');

// QUERY 1: Endpoint for bird observation and climate variation correlation with dynamic parameters
router.get('/query1', async (req, res) => {
  try {
    const stateProvince = req.query.stateProvince || null;
    const startYear = parseInt(req.query.startYear) || 2000;
    const endYear = parseInt(req.query.endYear) || new Date().getFullYear();

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
    const startYear = parseInt(req.query.startYear) || 2000;
    const endYear = parseInt(req.query.endYear) || new Date().getFullYear();

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
    const startYear = parseInt(req.query.startYear) || 2000;
    const endYear = parseInt(req.query.endYear) || new Date().getFullYear();
    const growthRateThreshold =
      parseFloat(req.query.growthRateThreshold) || 0.5;

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
    const startYear = parseInt(req.query.startYear) || 2015;
    const endYear = parseInt(req.query.endYear) || new Date().getFullYear();
    const stateProvince = req.query.stateProvince;
    const orderBy = req.query.orderBy || 'year ASC';

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
    const stateProvince = req.query.stateProvince;
    const family = req.query.family;
    const genus = req.query.genus;
    const orderBy = req.query.orderBy || 'ThreatenedPercentage DESC';

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
