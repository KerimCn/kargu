const CaseModel = require('../models/caseModel');

class CaseController {
  static async getAllCases(req, res) {
    try {
      const cases = await CaseModel.findAll();
      res.json(cases);
    } catch (err) {
      console.error('Get cases error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async getCaseById(req, res) {
    try {
      const caseData = await CaseModel.findById(req.params.id);
      
      if (!caseData) {
        return res.status(404).json({ error: 'Case not found' });
      }

      res.json(caseData);
    } catch (err) {
      console.error('Get case error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async createCase(req, res) {
    try {
      const { title, description, severity, assigned_to } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const caseData = await CaseModel.create({
        title,
        description,
        severity: severity || 'medium',
        assigned_to,
        created_by: req.user.id
      });

      res.status(201).json(caseData);
    } catch (err) {
      console.error('Create case error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async updateCase(req, res) {
    try {
      const updates = {};

      if (req.body.status !== undefined) updates.status = req.body.status;
      if (req.body.severity !== undefined) updates.severity = req.body.severity;
      if (req.body.assigned_to !== undefined) updates.assigned_to = req.body.assigned_to;
      if (req.body.title !== undefined) updates.title = req.body.title;
      if (req.body.description !== undefined) updates.description = req.body.description;

      const caseData = await CaseModel.update(req.params.id, updates);

      if (!caseData) {
        return res.status(404).json({ error: 'Case not found' });
      }

      res.json(caseData);
    } catch (err) {
      console.error('Update case error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async deleteCase(req, res) {
    try {
      await CaseModel.delete(req.params.id);
      res.json({ message: 'Case deleted successfully' });
    } catch (err) {
      console.error('Delete case error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = CaseController;