const express = require('express');
const saveFaceebookCredentialsController = require('../controllers/facebook/saveFaceebookCredentialsController');

const router = express.Router();

router.post('/', saveFaceebookCredentialsController.saveFaceebookCredentials);

module.exports = router;