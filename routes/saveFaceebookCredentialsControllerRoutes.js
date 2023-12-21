const express = require('express');
const saveFaceebookCredentialsController = require('../controllers/facebook/saveFaceebookCredentialsController');
const { check } = require('express-validator');

const router = express.Router();

router.post('/',
    [
        check('name').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('accessToken').not().isEmpty(),
        check('userId').not().isEmpty(),
        check('image')
    ],
    saveFaceebookCredentialsController.saveFaceebookCredentials);

module.exports = router;