const express = require('express');
const { check } = require('express-validator');

const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', userController.getUsers);

module.exports = router;