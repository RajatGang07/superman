const express = require('express');

const facebookConfigController = require('../controllers/facebook/facebookConfig');

const router = express.Router();

router.post('/', facebookConfigController.saveFacebookConfig);

router.post('/config', facebookConfigController.getFacebookConfig);

router.post('/delete', facebookConfigController.deleteFacebookConfig);

router.post('/update', facebookConfigController.updateFacebookConfig);

module.exports = router;