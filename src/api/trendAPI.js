const express = require('express');
const router = express.Router();

// Importing query functions from their respective files
const getBirdObservationTrends = require('../queries/getBirdObservationTrends');
const getDiversityIndex = require('../queries/getDiversityIndex');
const getSpeciesGrowthRates = require('../queries/getSpeciesGrowthRates');
const getPopulationDynamics = require('../queries/getPopulationDynamics');
const getRegionalTaxonomicDiversity = require('../queries/getRegionalTaxonomicDiversity');

// Endpoint for bird observation and climate variation correlation trends
router.get('/bird-observation-trends', async (req, res) => {
  try {
    const data = await getBirdObservationTrends();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for biodiversity index trends
router.get('/diversity-index', async (req, res) => {
  try {
    const data = await getDiversityIndex();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for species growth rate trends
router.get('/species-growth-rates', async (req, res) => {
  try {
    const data = await getSpeciesGrowthRates();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for bird population dynamics trends
router.get('/population-dynamics', async (req, res) => {
  try {
    const data = await getPopulationDynamics();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for regional taxonomic diversity and conservation priorities
router.get('/regional-taxonomic-diversity', async (req, res) => {
  try {
    const data = await getRegionalTaxonomicDiversity();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
