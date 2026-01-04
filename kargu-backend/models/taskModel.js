const { pool } = require('../config/database');

class TaskModel {
  static async findAllByCaseId(caseId) {
    const result = await pool.query(
      `SELECT t.*, 
        u1.username as assigned_to_username,
        u2.username as created_by_username
       FROM tasks t
       LEFT JOIN users u1 ON t.assigned_to = u1.id
       LEFT JOIN users u2 ON t.created_by = u2.id
       WHERE t.case_id = $1
       ORDER BY t.created_at DESC`,
      [caseId]
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT t.*, 
        u1.username as assigned_to_username,
        u2.username as created_by_username
       FROM tasks t
       LEFT JOIN users u1 ON t.assigned_to = u1.id
       LEFT JOIN users u2 ON t.created_by = u2.id
       WHERE t.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async create(taskData) {
    const { case_id, name, description, assigned_to, priority, due_date, created_by } = taskData;
    
    // Get assigned user's username
    let assigned_to_name = null;
    if (assigned_to) {
      const userResult = await pool.query('SELECT username FROM users WHERE id = $1', [assigned_to]);
      if (userResult.rows.length > 0) {
        assigned_to_name = userResult.rows[0].username;
      }
    }

    const result = await pool.query(
      `INSERT INTO tasks (case_id, name, description, assigned_to, assigned_to_name, priority, due_date, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [case_id, name, description || null, assigned_to, assigned_to_name, priority || 'medium', due_date || null, created_by]
    );
    return result.rows[0];
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.name !== undefined) {
      fields.push(`name = $${paramCount}`);
      values.push(updates.name);
      paramCount++;
    }

    if (updates.description !== undefined) {
      fields.push(`description = $${paramCount}`);
      values.push(updates.description);
      paramCount++;
    }

    if (updates.assigned_to !== undefined) {
      fields.push(`assigned_to = $${paramCount}`);
      values.push(updates.assigned_to);
      paramCount++;
      
      // Update assigned_to_name
      let assigned_to_name = null;
      if (updates.assigned_to) {
        const userResult = await pool.query('SELECT username FROM users WHERE id = $1', [updates.assigned_to]);
        if (userResult.rows.length > 0) {
          assigned_to_name = userResult.rows[0].username;
        }
      }
      fields.push(`assigned_to_name = $${paramCount}`);
      values.push(assigned_to_name);
      paramCount++;
    }

    if (updates.status !== undefined) {
      fields.push(`status = $${paramCount}`);
      values.push(updates.status);
      paramCount++;
      
      if (updates.status === 'completed' || updates.status === 'failed') {
        fields.push(`completed_at = CURRENT_TIMESTAMP`);
      }
    }

    if (updates.priority !== undefined) {
      fields.push(`priority = $${paramCount}`);
      values.push(updates.priority);
      paramCount++;
    }

    if (updates.due_date !== undefined) {
      fields.push(`due_date = $${paramCount}`);
      values.push(updates.due_date);
      paramCount++;
    }

    if (updates.result !== undefined) {
      fields.push(`result = $${paramCount}`);
      values.push(updates.result);
      paramCount++;
    }

    if (updates.comment !== undefined) {
      fields.push(`comment = $${paramCount}`);
      values.push(updates.comment);
      paramCount++;
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const result = await pool.query(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    return { success: true };
  }
}

module.exports = TaskModel;

