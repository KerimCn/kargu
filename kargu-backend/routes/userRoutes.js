const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, UserController.getAllUsers);
router.put('/me/profile', authenticateToken, UserController.updateProfile);
router.get('/:id', authenticateToken, UserController.getUserById);
router.post('/', authenticateToken, UserController.createUser);
router.put('/:id', authenticateToken, UserController.updateUser);
router.delete('/:id', authenticateToken, UserController.deleteUser);

module.exports = router;