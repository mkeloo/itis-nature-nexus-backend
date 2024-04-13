const express = require('express');
const router = express.Router();

// Importing query functions from their respective files
const getBirdClimateCorrelation = require('../queries/query1');
const getDiversityIndex = require('../queries/query2');
const getSpeciesGrowthRates = require('../queries/query3');
const getPopulationDynamics = require('../queries/query4');
const getRegionalTaxonomicDiversity = require('../queries/query5');

// QUERY 1: Endpoint for bird observation and climate variation correlation
router.get('/query1', async (req, res) => {
  try {
    const data = await getBirdClimateCorrelation();
    // console.log(data);
    res.json(data);
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// QUERY 2: Endpoint for biodiversity index trends
router.get('/query2', async (req, res) => {
  try {
    const data = await getDiversityIndex();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// QUERY 3: Endpoint for species growth rate trends
router.get('/query3', async (req, res) => {
  try {
    const data = await getSpeciesGrowthRates();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// QUERY 4: Endpoint for bird population dynamics trends
router.get('/query4', async (req, res) => {
  try {
    const data = await getPopulationDynamics();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// QUERY 5: Endpoint for regional taxonomic diversity and conservation priorities
router.get('/query5', async (req, res) => {
  try {
    const data = await getRegionalTaxonomicDiversity();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
