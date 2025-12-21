const CaseModel = require('../models/caseModel');

class DashboardController {
  static async getStats(req, res) {
    try {
      const stats = await CaseModel.getStats();
      res.json(stats);
    } catch (err) {
      console.error('Get stats error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = DashboardController;