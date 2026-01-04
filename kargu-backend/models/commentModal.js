const { pool } = require('../config/database');

class CommentModal {

  static async getAllComments(id) {
    const result = await pool.query(
      'SELECT id, username, user_id, case_id, comment, visible, created_at, updated_at FROM comment WHERE case_id = $1 ORDER BY created_at DESC',[id]
    );
    return result.rows;
  }
  
  static async create(commentData) {
    const { username, user_id, case_id, comment, visible } = commentData;
    const result = await pool.query(
      'INSERT INTO comment (username, user_id, case_id, comment, visible) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, user_id, case_id, comment, visible, created_at',
      [username, user_id, case_id, comment, visible || 'comment']
    );
    return result.rows[0];
  }

  static async softDelete(id) {
    await pool.query('UPDATE comment SET visible = FALSE WHERE id = $1', [id]);
    return { success: true };
  }



  static async update(id, comment) {
   
    const result = await pool.query(
      `UPDATE comment SET comment =$1, updated_at = NOW () WHERE id = $2 RETURNING id, comment, updated_at`,
      [comment, id]
    );

    return result.rows[0];
  }
}

module.exports = CommentModal;