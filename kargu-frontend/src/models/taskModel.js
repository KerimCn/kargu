/**
 * Task Model - Data validation and transformation
 */

export const taskStatuses = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const taskPriorities = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

/**
 * Validate task data
 */
export const validateTask = (taskData) => {
  const errors = {};

  if (!taskData.name || taskData.name.trim().length === 0) {
    errors.name = 'Task name is required';
  }

  if (taskData.priority && !Object.values(taskPriorities).includes(taskData.priority)) {
    errors.priority = 'Invalid priority level';
  }

  if (taskData.status && !Object.values(taskStatuses).includes(taskData.status)) {
    errors.status = 'Invalid status';
  }

  if (taskData.due_date && new Date(taskData.due_date) < new Date()) {
    errors.due_date = 'Due date cannot be in the past';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Transform task data for API
 */
export const transformTaskForAPI = (taskData) => {
  return {
    case_id: taskData.case_id,
    name: taskData.name?.trim() || '',
    description: taskData.description?.trim() || '',
    assigned_to: taskData.assigned_to || null,
    priority: taskData.priority || taskPriorities.MEDIUM,
    status: taskData.status || taskStatuses.PENDING,
    due_date: taskData.due_date || null
  };
};

/**
 * Format task for display
 */
export const formatTask = (task) => {
  return {
    ...task,
    priorityLabel: task.priority?.toUpperCase() || 'MEDIUM',
    statusLabel: task.status?.replace('_', ' ').toUpperCase() || 'PENDING',
    dueDate: task.due_date ? new Date(task.due_date) : null,
    createdAt: task.created_at ? new Date(task.created_at) : null
  };
};
