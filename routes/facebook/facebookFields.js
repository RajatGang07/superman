const express = require('express');

const facebookFieldsController = require('../../controllers/facebook/facebookFields');

const router = express.Router();

router.post('/', facebookFieldsController.saveAdInsights);

router.post('/fields', facebookFieldsController.fetchInsights);

router.post('/all/fields', facebookFieldsController.fetchAllFacebookFields);


// router.post('/campaigns', facebookAdAccountsController.fetchAdCampaignAcounts);


module.exports = router;