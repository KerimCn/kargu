const { pool } = require('../config/database');

class PlaybookModel {
  static async findAll() {
    const result = await pool.query(
      'SELECT * FROM playbooks ORDER BY created_at DESC'
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM playbooks WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async create(playbookData) {
    const { name, steps } = playbookData;
    const result = await pool.query(
      'INSERT INTO playbooks (name, steps) VALUES ($1, $2::jsonb) RETURNING *',
      [name, JSON.stringify(steps || [])]
    );
    return result.rows[0];
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        if (key === 'steps') {
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
      `UPDATE playbooks SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM playbooks WHERE id = $1', [id]);
    return { success: true };
  }
}

module.exports = PlaybookModel;

