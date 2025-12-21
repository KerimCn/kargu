const { pool } = require('../config/database');

class CaseModel {
  static async findAll() {
    const result = await pool.query(`
      SELECT c.*, 
        u1.username as assigned_to_name,
        u2.username as created_by_name
      FROM cases c
      LEFT JOIN users u1 ON c.assigned_to = u1.id
      LEFT JOIN users u2 ON c.created_by = u2.id
      ORDER BY c.created_at DESC
    `);
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(`
      SELECT c.*, 
        u1.username as assigned_to_name,
        u2.username as created_by_name
      FROM cases c
      LEFT JOIN users u1 ON c.assigned_to = u1.id
      LEFT JOIN users u2 ON c.created_by = u2.id
      WHERE c.id = $1
    `, [id]);
    return result.rows[0];
  }

  static async create(caseData) {
    const { title, description, severity, assigned_to, created_by } = caseData;
    const result = await pool.query(
      'INSERT INTO cases (title, description, severity, assigned_to, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, severity, assigned_to, created_by]
    );
    return result.rows[0];
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.status !== undefined) {
      fields.push(`status = $${paramCount}`);
      values.push(updates.status);
      paramCount++;
      
      if (updates.status === 'resolved') {
        fields.push('resolved_at = CURRENT_TIMESTAMP');
      }
    }

    if (updates.severity !== undefined) {
      fields.push(`severity = $${paramCount}`);
      values.push(updates.severity);
      paramCount++;
    }

    if (updates.assigned_to !== undefined) {
      fields.push(`assigned_to = $${paramCount}`);
      values.push(updates.assigned_to);
      paramCount++;
    }

    if (updates.title !== undefined) {
      fields.push(`title = $${paramCount}`);
      values.push(updates.title);
      paramCount++;
    }

    if (updates.description !== undefined) {
      fields.push(`description = $${paramCount}`);
      values.push(updates.description);
      paramCount++;
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const result = await pool.query(
      `UPDATE cases SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM cases WHERE id = $1', [id]);
    return { success: true };
  }

  static async getStats() {
    const totalCases = await pool.query('SELECT COUNT(*) FROM cases');
    const openCases = await pool.query("SELECT COUNT(*) FROM cases WHERE status = 'open'");
    const criticalCases = await pool.query("SELECT COUNT(*) FROM cases WHERE severity = 'critical' AND status != 'resolved'");
    const resolvedToday = await pool.query("SELECT COUNT(*) FROM cases WHERE resolved_at >= CURRENT_DATE");

    return {
      totalCases: parseInt(totalCases.rows[0].count),
      openCases: parseInt(openCases.rows[0].count),
      criticalCases: parseInt(criticalCases.rows[0].count),
      resolvedToday: parseInt(resolvedToday.rows[0].count)
    };
  }
}

module.exports = CaseModel;