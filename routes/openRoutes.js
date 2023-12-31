const express = require('express');
const userController = require('../controllers/user/userController');
const { check } = require('express-validator');

const router = express.Router();

// No more route, as no auth done for this router
// Direct Redirection

    
// Login
router.post('/api/v1/login', userController.login);
// SignUp
router.post('/api/v1/signup',userController.signUp);

module.exports = router;