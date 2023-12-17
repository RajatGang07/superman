const express = require('express');
const { check } = require('express-validator');

const facebookController = require('../controllers/facebookController');

const router = express.Router();

router.post('/', facebookController.fetchFacebookLogInUsers);

module.exports = router;