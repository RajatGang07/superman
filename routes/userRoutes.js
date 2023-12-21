const express = require('express');
const { check } = require('express-validator');

const userController = require('../controllers/user/userController');

const router = express.Router();

router.get('/', userController.getUsers);

module.exports = router;