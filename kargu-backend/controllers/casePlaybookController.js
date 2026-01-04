const CasePlaybookModel = require('../models/casePlaybookModel');
const PlaybookExecutionModel = require('../models/playbookExecutionModel');
const CaseModel = require('../models/caseModel');

class CasePlaybookController {
  static async getCasePlaybooks(req, res) {
    try {
      const { caseId } = req.params;
      const playbooks = await CasePlaybookModel.findByCaseId(caseId);
      res.json(playbooks);
    } catch (err) {
      console.error('Get case playbooks error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async addPlaybookToCase(req, res) {
    try {
      const { caseId } = req.params;
      const { playbookId } = req.body;
      const userId = req.user.id;

      // Check if user is case creator or assignee
      const caseData = await CaseModel.findById(caseId);
      if (!caseData) {
        return res.status(404).json({ error: 'Case not found' });
      }

      const isCaseCreator = caseData.created_by === userId;
      const isCaseAssignee = caseData.assigned_to === userId;

      if (!isCaseCreator && !isCaseAssignee) {
        return res.status(403).json({ error: 'Only case creator or assignee can add playbooks' });
      }

      const casePlaybook = await CasePlaybookModel.create(caseId, playbookId, userId);
      
      if (!casePlaybook) {
        return res.status(400).json({ error: 'Playbook already added to this case' });
      }

      // Create initial execution state
      await PlaybookExecutionModel.create(casePlaybook.id);

      const result = await CasePlaybookModel.findById(casePlaybook.id);
      res.status(201).json(result);
    } catch (err) {
      console.error('Add playbook to case error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async removePlaybookFromCase(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Get case playbook to find case_id
      const casePlaybook = await CasePlaybookModel.findById(id);
      if (!casePlaybook) {
        return res.status(404).json({ error: 'Case playbook not found' });
      }

      // Check if user is case creator or assignee
      const caseData = await CaseModel.findById(casePlaybook.case_id);
      if (!caseData) {
        return res.status(404).json({ error: 'Case not found' });
      }

      const isCaseCreator = caseData.created_by === userId;
      const isCaseAssignee = caseData.assigned_to === userId;

      if (!isCaseCreator && !isCaseAssignee) {
        return res.status(403).json({ error: 'Only case creator or assignee can remove playbooks' });
      }

      await CasePlaybookModel.delete(id);
      res.json({ message: 'Playbook removed from case' });
    } catch (err) {
      console.error('Remove playbook from case error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = CasePlaybookController;

