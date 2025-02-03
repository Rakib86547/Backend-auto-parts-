const express = require('express');
const userController = require('../../controller/users.controller');
const imageUpload = require('../../middleware/imageUpload');
const router = express.Router();

router.post('/signup',imageUpload.single('image'), userController.signUp);
router.put('/login', userController.login);
router.post('/request-password-reset', userController.requestPasswordReset);
router.post('/reset-password', userController.passwordReset);

module.exports = router;