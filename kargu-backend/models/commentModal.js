const { pool } = require('../config/database');

class CommentModal {

  static async getAllComments(caseId) {
    const result = await pool.query(
      'SELECT id, username, user_id, case_id, comment, visible, created_at, updated_at FROM comments WHERE case_id = $1 AND visible = TRUE ORDER BY created_at DESC',
      [caseId]
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT id, username, user_id, case_id, comment, visible, created_at, updated_at FROM comments WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }
  
  static async create(commentData) {
    const { username, user_id, case_id, comment, visible } = commentData;
    const result = await pool.query(
      'INSERT INTO comments (username, user_id, case_id, comment, visible) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, user_id, case_id, comment, visible, created_at',
      [username, user_id, case_id, comment, visible !== undefined ? visible : true]
    );
    return result.rows[0];
  }

  static async softDelete(id) {
    await pool.query('UPDATE comments SET visible = FALSE WHERE id = $1', [id]);
    return { success: true };
  }

  static async update(id, comment) {
    const result = await pool.query(
      'UPDATE comments SET comment = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, username, user_id, case_id, comment, visible, updated_at',
      [comment, id]
    );
    return result.rows[0];
  }
}

module.exports = CommentModal;