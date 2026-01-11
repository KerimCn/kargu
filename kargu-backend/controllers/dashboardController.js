const CaseModel = require('../models/caseModel');
const TaskModel = require('../models/taskModel');
const PlaybookModel = require('../models/playbookModel');
const PlaybookExecutionModel = require('../models/playbookExecutionModel');
const UserModel = require('../models/userModel');
const { pool } = require('../config/database');

class DashboardController {
  static async getStats(req, res) {
    try {
      // Temel case istatistikleri
      const caseStats = await CaseModel.getStats();
      
      // Task istatistikleri
      const totalTasks = await pool.query('SELECT COUNT(*) FROM tasks');
      const completedTasks = await pool.query("SELECT COUNT(*) FROM tasks WHERE status = 'completed'");
      const pendingTasks = await pool.query("SELECT COUNT(*) FROM tasks WHERE status = 'pending'");
      const inProgressTasks = await pool.query("SELECT COUNT(*) FROM tasks WHERE status = 'in_progress'");
      
      // Playbook istatistikleri
      const totalPlaybooks = await pool.query('SELECT COUNT(*) FROM playbooks');
      const activeExecutions = await pool.query(`
        SELECT COUNT(*) FROM playbook_executions 
        WHERE completed_at IS NULL
      `);
      
      // User istatistikleri
      const totalUsers = await pool.query('SELECT COUNT(*) FROM users');
      
      // Son 7 günlük trend (günlük çözülen vakalar)
      const resolvedTrend = await pool.query(`
        SELECT 
          DATE(resolved_at) as date,
          COUNT(*) as count
        FROM cases
        WHERE resolved_at >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY DATE(resolved_at)
        ORDER BY date ASC
      `);
      
      // Severity dağılımı
      const severityDistribution = await pool.query(`
        SELECT severity, COUNT(*) as count
        FROM cases
        WHERE status != 'resolved'
        GROUP BY severity
      `);
      
      // Status dağılımı
      const statusDistribution = await pool.query(`
        SELECT status, COUNT(*) as count
        FROM cases
        GROUP BY status
      `);
      
      // Son vakalar (en son 5)
      const recentCases = await pool.query(`
        SELECT c.*, 
          u1.username as assigned_to_name,
          u2.username as created_by_name
        FROM cases c
        LEFT JOIN users u1 ON c.assigned_to = u1.id
        LEFT JOIN users u2 ON c.created_by = u2.id
        ORDER BY c.created_at DESC
        LIMIT 5
      `);
      
      // Kritik vakalar
      const criticalCases = await pool.query(`
        SELECT c.*, 
          u1.username as assigned_to_name,
          u2.username as created_by_name
        FROM cases c
        LEFT JOIN users u1 ON c.assigned_to = u1.id
        LEFT JOIN users u2 ON c.created_by = u2.id
        WHERE c.severity = 'critical' AND c.status != 'resolved'
        ORDER BY c.created_at DESC
        LIMIT 5
      `);
      
      // Ortalama çözüm süresi (gün cinsinden)
      const avgResolutionTime = await pool.query(`
        SELECT AVG(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 86400) as avg_days
        FROM cases
        WHERE resolved_at IS NOT NULL
      `);

      res.json({
        // Case stats
        ...caseStats,
        
        // Task stats
        totalTasks: parseInt(totalTasks.rows[0].count),
        completedTasks: parseInt(completedTasks.rows[0].count),
        pendingTasks: parseInt(pendingTasks.rows[0].count),
        inProgressTasks: parseInt(inProgressTasks.rows[0].count),
        
        // Playbook stats
        totalPlaybooks: parseInt(totalPlaybooks.rows[0].count),
        activeExecutions: parseInt(activeExecutions.rows[0].count),
        
        // User stats
        totalUsers: parseInt(totalUsers.rows[0].count),
        
        // Trends
        resolvedTrend: resolvedTrend.rows.map(row => ({
          date: row.date,
          count: parseInt(row.count)
        })),
        
        // Distributions
        severityDistribution: severityDistribution.rows.map(row => ({
          severity: row.severity,
          count: parseInt(row.count)
        })),
        
        statusDistribution: statusDistribution.rows.map(row => ({
          status: row.status,
          count: parseInt(row.count)
        })),
        
        // Recent and critical cases
        recentCases: recentCases.rows,
        criticalCasesList: criticalCases.rows,
        
        // Analytics
        avgResolutionTime: avgResolutionTime.rows[0]?.avg_days 
          ? parseFloat(avgResolutionTime.rows[0].avg_days).toFixed(1)
          : 0
      });
    } catch (err) {
      console.error('Get stats error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = DashboardController;