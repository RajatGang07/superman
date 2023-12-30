const express = require('express');

const facebookGenerateCSVUsingConfigController = require('../../controllers/facebook/facebookGenerateCSVUsingConfig');

const router = express.Router();

router.post('/', facebookGenerateCSVUsingConfigController.fetchFacebookDataForAdvertisement);

router.post('/config', facebookGenerateCSVUsingConfigController.fetchFacebookDataForSingleConfig);

module.exports = router;