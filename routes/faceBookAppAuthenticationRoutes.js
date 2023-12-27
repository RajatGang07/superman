const express = require('express');

const facebookController = require('../controllers/facebook/facebookController');

const router = express.Router();

router.post('/', facebookController.fetchFacebookLogInUsers);
router.post('/auth', facebookController.deleteFacebookLogInUsers);

module.exports = router;