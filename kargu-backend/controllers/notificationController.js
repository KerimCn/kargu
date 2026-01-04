const NotificationModel = require('../models/notificationModel');
const { authenticateToken } = require('../middleware/auth');

class NotificationController {
  static async getNotifications(req, res) {
    try {
      const userId = req.user.id;
      const notifications = await NotificationModel.findByUserId(userId);
      res.json(notifications);
    } catch (err) {
      console.error('Get notifications error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async getUnreadCount(req, res) {
    try {
      const userId = req.user.id;
      const count = await NotificationModel.findUnreadCount(userId);
      res.json({ count });
    } catch (err) {
      console.error('Get unread count error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const notification = await NotificationModel.findById(id);
      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }

      if (notification.user_id !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const updated = await NotificationModel.markAsRead(id, userId);
      res.json(updated);
    } catch (err) {
      console.error('Mark as read error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async markAllAsRead(req, res) {
    try {
      const userId = req.user.id;
      await NotificationModel.markAllAsRead(userId);
      res.json({ success: true });
    } catch (err) {
      console.error('Mark all as read error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = NotificationController;

