const { pool } = require('../config/database');

class PlaybookExecutionModel {
  static async findByCasePlaybookId(casePlaybookId) {
    const result = await pool.query(`
      SELECT * FROM playbook_executions
      WHERE case_playbook_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `, [casePlaybookId]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM playbook_executions WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async create(casePlaybookId) {
    const result = await pool.query(`
      INSERT INTO playbook_executions (case_playbook_id, current_step_index, step_states)
      VALUES ($1, 0, '[]'::jsonb)
      RETURNING *
    `, [casePlaybookId]);
    return result.rows[0];
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        if (key === 'step_states') {
          fields.push(`${key} = $${paramCount}::jsonb`);
          values.push(JSON.stringify(updates[key]));
        } else {
          fields.push(`${key} = $${paramCount}`);
          values.push(updates[key]);
        }
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const result = await pool.query(
      `UPDATE playbook_executions SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0];
  }

  static async complete(id) {
    const result = await pool.query(`
      UPDATE playbook_executions 
      SET completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [id]);
    return result.rows[0];
  }
}

module.exports = PlaybookExecutionModel;

