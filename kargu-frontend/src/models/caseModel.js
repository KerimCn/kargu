/**
 * Case Model - Data validation and transformation
 */

export const caseStatuses = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
};

export const caseSeverities = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

/**
 * Validate case data
 */
export const validateCase = (caseData) => {
  const errors = {};

  if (!caseData.title || caseData.title.trim().length === 0) {
    errors.title = 'Title is required';
  }

  if (caseData.title && caseData.title.length > 255) {
    errors.title = 'Title must be less than 255 characters';
  }

  if (caseData.severity && !Object.values(caseSeverities).includes(caseData.severity)) {
    errors.severity = 'Invalid severity level';
  }

  if (caseData.status && !Object.values(caseStatuses).includes(caseData.status)) {
    errors.status = 'Invalid status';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Transform case data for API
 */
export const transformCaseForAPI = (caseData) => {
  return {
    title: caseData.title?.trim() || '',
    description: caseData.description?.trim() || '',
    severity: caseData.severity || caseSeverities.MEDIUM,
    assigned_to: caseData.assigned_to || null,
    status: caseData.status || caseStatuses.OPEN
  };
};

/**
 * Format case for display
 */
export const formatCase = (caseData) => {
  return {
    ...caseData,
    severityLabel: caseData.severity?.toUpperCase() || 'MEDIUM',
    statusLabel: caseData.status?.replace('_', ' ').toUpperCase() || 'OPEN',
    createdAt: caseData.created_at ? new Date(caseData.created_at) : null,
    updatedAt: caseData.updated_at ? new Date(caseData.updated_at) : null
  };
};
