const { pool } = require('../config/database');

class NotificationModel {
  static async create(notificationData) {
    const { user_id, case_id, type, title, message } = notificationData;
    const result = await pool.query(`
      INSERT INTO notifications (user_id, case_id, type, title, message)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [user_id, case_id, type, title, message]);
    return result.rows[0];
  }

  static async findByUserId(userId, limit = 50) {
    const result = await pool.query(`
      SELECT * FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `, [userId, limit]);
    return result.rows;
  }

  static async findUnreadCount(userId) {
    const result = await pool.query(`
      SELECT COUNT(*) as count
      FROM notifications
      WHERE user_id = $1 AND read = FALSE
    `, [userId]);
    return parseInt(result.rows[0].count);
  }

  static async markAsRead(notificationId, userId) {
    const result = await pool.query(`
      UPDATE notifications
      SET read = TRUE
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `, [notificationId, userId]);
    return result.rows[0];
  }

  static async markAllAsRead(userId) {
    await pool.query(`
      UPDATE notifications
      SET read = TRUE
      WHERE user_id = $1 AND read = FALSE
    `, [userId]);
    return { success: true };
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM notifications WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = NotificationModel;

