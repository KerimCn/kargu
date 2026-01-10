/**
 * Notification Controller - Business logic for notifications
 */
import { notificationAPI } from '../services/api';
import { formatNotification, groupNotificationsByDate } from '../models/notificationModel';

/**
 * Notification Controller Class
 */
export class NotificationController {
  /**
   * Get all notifications
   */
  static async getAllNotifications() {
    try {
      const notifications = await notificationAPI.getAll();
      return {
        success: true,
        data: notifications.map(formatNotification),
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error.message || 'Failed to fetch notifications'
      };
    }
  }

  /**
   * Get unread notification count
   */
  static async getUnreadCount() {
    try {
      const count = await notificationAPI.getUnreadCount();
      return {
        success: true,
        data: count,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: 0,
        error: error.message || 'Failed to fetch unread count'
      };
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(id) {
    try {
      await notificationAPI.markAsRead(id);
      return {
        success: true,
        data: null,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to mark notification as read'
      };
    }
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead() {
    try {
      await notificationAPI.markAllAsRead();
      return {
        success: true,
        data: null,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to mark all notifications as read'
      };
    }
  }

  /**
   * Group notifications by date
   */
  static groupByDate(notifications) {
    return groupNotificationsByDate(notifications);
  }

  /**
   * Filter unread notifications
   */
  static filterUnread(notifications) {
    return notifications.filter(n => !n.isRead);
  }
}
