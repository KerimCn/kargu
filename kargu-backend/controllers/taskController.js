const TaskModel = require('../models/taskModel');
const CaseModel = require('../models/caseModel');
const UserModel = require('../models/userModel');
const NotificationService = require('../services/notificationService');

class TaskController {
  static async getAllTasks(req, res) {
    try {
      const { case_id } = req.query;

      if (!case_id) {
        return res.status(400).json({ error: 'case_id parameter is required' });
      }

      const tasks = await TaskModel.findAllByCaseId(case_id);
      res.json(tasks);
    } catch (err) {
      console.error('Get tasks error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async getTaskById(req, res) {
    try {
      const task = await TaskModel.findById(req.params.id);
      
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json(task);
    } catch (err) {
      console.error('Get task error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async createTask(req, res) {
    try {
      const { case_id, name, description, assigned_to, priority, due_date } = req.body;
      const created_by = req.user.id;

      if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Task name is required' });
      }

      if (!case_id) {
        return res.status(400).json({ error: 'case_id is required' });
      }

      // Verify case exists
      const caseExists = await CaseModel.findById(case_id);
      if (!caseExists) {
        return res.status(404).json({ error: 'Case not found' });
      }

      // Check if case is resolved - cannot add tasks to resolved cases
      if (caseExists.status === 'resolved') {
        return res.status(403).json({ error: 'Kapanmış case\'lere task eklenemez.' });
      }

      // Check if user is assigned to the case
      if (caseExists.assigned_to !== created_by) {
        return res.status(403).json({ error: 'Only the assigned user can create tasks for this case' });
      }

      // Verify assigned user exists if provided
      if (assigned_to) {
        const userExists = await UserModel.findById(assigned_to);
        if (!userExists) {
          return res.status(404).json({ error: 'Assigned user not found' });
        }
      }

      const task = await TaskModel.create({
        case_id,
        name: name.trim(),
        description: description ? description.trim() : null,
        assigned_to,
        priority: priority || 'medium',
        due_date,
        created_by
      });

      // Create notification for case creator and assignee (excluding task creator)
      await NotificationService.createNotificationForCaseUsers(
        case_id,
        'task_created',
        'Yeni Task',
        `"${name.trim()}" adlı yeni task oluşturuldu.`,
        created_by
      );

      res.status(201).json(task);
    } catch (err) {
      console.error('Create task error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async updateTask(req, res) {
    try {
      const taskId = req.params.id;
      const updates = {};
      const userId = req.user.id;

      // Get the task to check permissions
      const existingTask = await TaskModel.findById(taskId);
      if (!existingTask) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // Check if user is assigned to the task or is the case owner
      const caseData = await CaseModel.findById(existingTask.case_id);
      const isTaskAssignee = existingTask.assigned_to === userId;
      const isCaseOwner = caseData.assigned_to === userId;

      if (!isTaskAssignee && !isCaseOwner) {
        return res.status(403).json({ error: 'You do not have permission to update this task' });
      }

      // Only case owner can edit task details (name, description, priority, due_date, assigned_to)
      if (isCaseOwner) {
        if (req.body.name !== undefined) updates.name = req.body.name;
        if (req.body.description !== undefined) updates.description = req.body.description;
        if (req.body.priority !== undefined) updates.priority = req.body.priority;
        if (req.body.due_date !== undefined) updates.due_date = req.body.due_date;
        if (req.body.assigned_to !== undefined) updates.assigned_to = req.body.assigned_to;
      }

      // Task assignee or case owner can update status, result, and comment (to close the task)
      if (isTaskAssignee || isCaseOwner) {
        if (req.body.status !== undefined) updates.status = req.body.status;
        if (req.body.result !== undefined) updates.result = req.body.result;
        if (req.body.comment !== undefined) updates.comment = req.body.comment;
      }

      const updatedTask = await TaskModel.update(taskId, updates);

      if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json(updatedTask);
    } catch (err) {
      console.error('Update task error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async deleteTask(req, res) {
    try {
      const taskId = req.params.id;
      const userId = req.user.id;

      const existingTask = await TaskModel.findById(taskId);
      if (!existingTask) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // Only case owner can delete tasks
      const caseData = await CaseModel.findById(existingTask.case_id);
      if (caseData.assigned_to !== userId) {
        return res.status(403).json({ error: 'Only the case owner can delete tasks' });
      }

      await TaskModel.delete(taskId);
      res.json({ message: 'Task deleted successfully' });
    } catch (err) {
      console.error('Delete task error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = TaskController;

