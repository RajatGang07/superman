const express = require('express');
const { check } = require('express-validator');

const facebookController = require('../controllers/facebook/facebookController');

const router = express.Router();

router.post('/', facebookController.fetchFacebookLogInUsers);

module.exports = router;