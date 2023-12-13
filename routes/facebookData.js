const express = require('express');
const { check } = require('express-validator');

const facebookFieldsController = require('../controllers/facebookFields');

const router = express.Router();

router.post('/', facebookFieldsController.saveAdInsights);

// router.post('/campaigns', facebookAdAccountsController.fetchAdCampaignAcounts);


module.exports = router;