const express = require('express');
const { check } = require('express-validator');

const facebookAdAccountsController = require('../controllers/facebook/facebookAdAccounts');

const router = express.Router();

router.post('/', facebookAdAccountsController.fetchAdAcounts);

router.post('/campaigns', facebookAdAccountsController.fetchAdCampaignAcounts);


module.exports = router;