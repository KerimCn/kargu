const PlaybookModel = require('../models/playbookModel');

class PlaybookController {
  static async getAllPlaybooks(req, res) {
    try {
      // Check if user is admin (role 3 or 4)
      if (req.user.role !== '3' && req.user.role !== '4') {
        return res.status(403).json({ error: 'Only admins can access playbooks' });
      }

      const playbooks = await PlaybookModel.findAll();
      res.json(playbooks);
    } catch (err) {
      console.error('Get playbooks error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async getPlaybookById(req, res) {
    try {
      // Check if user is admin
      if (req.user.role !== '3' && req.user.role !== '4') {
        return res.status(403).json({ error: 'Only admins can access playbooks' });
      }

      const playbook = await PlaybookModel.findById(req.params.id);
      
      if (!playbook) {
        return res.status(404).json({ error: 'Playbook not found' });
      }

      res.json(playbook);
    } catch (err) {
      console.error('Get playbook error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async createPlaybook(req, res) {
    try {
      // Check if user is admin
      if (req.user.role !== '3' && req.user.role !== '4') {
        return res.status(403).json({ error: 'Only admins can create playbooks' });
      }

      const { name, steps } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Playbook name is required' });
      }

      const playbook = await PlaybookModel.create({
        name,
        steps: steps || []
      });

      res.status(201).json(playbook);
    } catch (err) {
      console.error('Create playbook error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async updatePlaybook(req, res) {
    try {
      // Check if user is admin
      if (req.user.role !== '3' && req.user.role !== '4') {
        return res.status(403).json({ error: 'Only admins can update playbooks' });
      }

      const updates = {};
      
      if (req.body.name !== undefined) updates.name = req.body.name;
      if (req.body.steps !== undefined) updates.steps = req.body.steps;

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      const playbook = await PlaybookModel.update(req.params.id, updates);

      if (!playbook) {
        return res.status(404).json({ error: 'Playbook not found' });
      }

      res.json(playbook);
    } catch (err) {
      console.error('Update playbook error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async deletePlaybook(req, res) {
    try {
      // Check if user is admin
      if (req.user.role !== '3' && req.user.role !== '4') {
        return res.status(403).json({ error: 'Only admins can delete playbooks' });
      }

      await PlaybookModel.delete(req.params.id);
      res.json({ message: 'Playbook deleted successfully' });
    } catch (err) {
      console.error('Delete playbook error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = PlaybookController;

