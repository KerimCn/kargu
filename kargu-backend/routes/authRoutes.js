const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

router.post('/login', AuthController.login);
router.get('/verify', authenticateToken, AuthController.verifyToken);

module.exports = router;