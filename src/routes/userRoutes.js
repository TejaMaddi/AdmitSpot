const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/verify/:token', userController.verifyEmail);
router.post('/reset', userController.resetPassword);

module.exports = router;
