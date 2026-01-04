const { pool } = require('../config/database');

class CasePlaybookModel {
  static async findByCaseId(caseId) {
    const result = await pool.query(`
      SELECT cp.*, p.name, p.steps, u.username as added_by_name
      FROM case_playbooks cp
      JOIN playbooks p ON cp.playbook_id = p.id
      LEFT JOIN users u ON cp.added_by = u.id
      WHERE cp.case_id = $1
      ORDER BY cp.created_at DESC
    `, [caseId]);
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(`
      SELECT cp.*, p.name, p.steps, u.username as added_by_name
      FROM case_playbooks cp
      JOIN playbooks p ON cp.playbook_id = p.id
      LEFT JOIN users u ON cp.added_by = u.id
      WHERE cp.id = $1
    `, [id]);
    return result.rows[0];
  }

  static async create(caseId, playbookId, addedBy) {
    const result = await pool.query(`
      INSERT INTO case_playbooks (case_id, playbook_id, added_by)
      VALUES ($1, $2, $3)
      ON CONFLICT (case_id, playbook_id) DO NOTHING
      RETURNING *
    `, [caseId, playbookId, addedBy]);
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM case_playbooks WHERE id = $1', [id]);
    return { success: true };
  }
}

module.exports = CasePlaybookModel;

