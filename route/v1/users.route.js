const express = require('express');
const userController = require('../../controller/users.controller');
const router = express.Router();

router.post('/signup', userController.signUp);
router.put('/login', userController.login);

module.exports = router;