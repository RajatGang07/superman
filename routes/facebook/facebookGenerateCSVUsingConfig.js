const express = require('express');

const facebookGenerateCSVUsingConfigController = require('../../controllers/facebook/facebookGenerateCSVUsingConfig');

const router = express.Router();

router.post('/', facebookGenerateCSVUsingConfigController.fetchFacebookDataForAdvertsement);

module.exports = router;