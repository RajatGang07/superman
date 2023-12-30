const express = require('express');
const { check } = require('express-validator');

const facebookGenerateCSVController = require('../../controllers/facebook/facebookGenerateCSV');

const router = express.Router();

router.post('/', facebookGenerateCSVController.fetchFacebookDataForAdvertisement);

module.exports = router;