const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, NotificationController.getNotifications);
router.get('/unread-count', authenticateToken, NotificationController.getUnreadCount);
router.patch('/:id/read', authenticateToken, NotificationController.markAsRead);
router.patch('/read-all', authenticateToken, NotificationController.markAllAsRead);

module.exports = router;

