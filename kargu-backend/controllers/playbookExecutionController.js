const PlaybookExecutionModel = require('../models/playbookExecutionModel');
const CasePlaybookModel = require('../models/casePlaybookModel');
const CaseModel = require('../models/caseModel');
const PlaybookModel = require('../models/playbookModel');
const NotificationService = require('../services/notificationService');

class PlaybookExecutionController {
  static async getExecution(req, res) {
    try {
      const { casePlaybookId } = req.params;
      let execution = await PlaybookExecutionModel.findByCasePlaybookId(casePlaybookId);
      
      if (!execution) {
        // Create if doesn't exist
        execution = await PlaybookExecutionModel.create(casePlaybookId);
      }

      res.json(execution);
    } catch (err) {
      console.error('Get execution error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async updateExecution(req, res) {
    try {
      const { executionId } = req.params;
      const { current_step_index, step_states } = req.body;
      const userId = req.user.id;

      // Get execution and verify permissions
      const execution = await PlaybookExecutionModel.findById(executionId);
      if (!execution) {
        return res.status(404).json({ error: 'Execution not found' });
      }

      const casePlaybook = await CasePlaybookModel.findById(execution.case_playbook_id);
      if (!casePlaybook) {
        return res.status(404).json({ error: 'Case playbook not found' });
      }

      const caseData = await CaseModel.findById(casePlaybook.case_id);
      if (!caseData) {
        return res.status(404).json({ error: 'Case not found' });
      }

      const isCaseCreator = caseData.created_by === userId;
      const isCaseAssignee = caseData.assigned_to === userId;

      if (!isCaseCreator && !isCaseAssignee) {
        return res.status(403).json({ error: 'Only case creator or assignee can update execution' });
      }

      const updates = {};
      if (current_step_index !== undefined) updates.current_step_index = current_step_index;
      if (step_states !== undefined) updates.step_states = step_states;

      const updated = await PlaybookExecutionModel.update(executionId, updates);
      res.json(updated);
    } catch (err) {
      console.error('Update execution error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async completeExecution(req, res) {
    try {
      const { executionId } = req.params;
      const userId = req.user.id;

      const execution = await PlaybookExecutionModel.findById(executionId);
      if (!execution) {
        return res.status(404).json({ error: 'Execution not found' });
      }

      const casePlaybook = await CasePlaybookModel.findById(execution.case_playbook_id);
      const caseData = await CaseModel.findById(casePlaybook.case_id);

      const isCaseCreator = caseData.created_by === userId;
      const isCaseAssignee = caseData.assigned_to === userId;

      if (!isCaseCreator && !isCaseAssignee) {
        return res.status(403).json({ error: 'Only case creator or assignee can complete execution' });
      }

      const completed = await PlaybookExecutionModel.complete(executionId);
      
      // Get playbook name for notification
      const playbook = await PlaybookModel.findById(casePlaybook.playbook_id);
      
      // Create notification for case creator and assignee (excluding executor)
      await NotificationService.createNotificationForCaseUsers(
        caseData.id,
        'playbook_completed',
        'Playbook Tamamlandı',
        `"${playbook.name}" playbook'u tamamlandı.`,
        userId
      );
      
      res.json(completed);
    } catch (err) {
      console.error('Complete execution error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = PlaybookExecutionController;

