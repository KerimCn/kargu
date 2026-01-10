/**
 * Task Controller - Business logic for tasks
 */
import { taskAPI } from '../services/api';
import { validateTask, transformTaskForAPI, formatTask } from '../models/taskModel';

/**
 * Task Controller Class
 */
export class TaskController {
  /**
   * Get all tasks for a case
   */
  static async getTasksByCaseId(caseId) {
    try {
      const tasks = await taskAPI.getAll(caseId);
      return {
        success: true,
        data: tasks.map(formatTask),
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error.message || 'Failed to fetch tasks'
      };
    }
  }

  /**
   * Get task by ID
   */
  static async getTaskById(id) {
    try {
      const task = await taskAPI.getById(id);
      return {
        success: true,
        data: formatTask(task),
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to fetch task'
      };
    }
  }

  /**
   * Create task
   */
  static async createTask(taskData) {
    // Validate
    const validation = validateTask(taskData);
    if (!validation.isValid) {
      return {
        success: false,
        data: null,
        error: Object.values(validation.errors).join(', ')
      };
    }

    // Transform
    const transformedData = transformTaskForAPI(taskData);

    try {
      const newTask = await taskAPI.create(transformedData);
      return {
        success: true,
        data: formatTask(newTask),
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to create task'
      };
    }
  }

  /**
   * Update task
   */
  static async updateTask(id, updates) {
    // Validate updates
    const validation = validateTask(updates);
    if (!validation.isValid) {
      return {
        success: false,
        data: null,
        error: Object.values(validation.errors).join(', ')
      };
    }

    try {
      const updatedTask = await taskAPI.update(id, updates);
      return {
        success: true,
        data: formatTask(updatedTask),
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to update task'
      };
    }
  }

  /**
   * Delete task
   */
  static async deleteTask(id) {
    try {
      await taskAPI.delete(id);
      return {
        success: true,
        data: null,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to delete task'
      };
    }
  }

  /**
   * Filter tasks by status
   */
  static filterTasksByStatus(tasks, status) {
    if (status === 'all') return tasks;
    return tasks.filter(t => t.status === status);
  }

  /**
   * Filter tasks by priority
   */
  static filterTasksByPriority(tasks, priority) {
    return tasks.filter(t => t.priority === priority);
  }

  /**
   * Get tasks by assignee
   */
  static getTasksByAssignee(tasks, userId) {
    return tasks.filter(t => t.assigned_to === userId);
  }
}
