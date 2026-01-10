/**
 * Playbook Model - Data validation and transformation
 */

/**
 * Validate playbook data
 */
export const validatePlaybook = (playbookData) => {
  const errors = {};

  if (!playbookData.name || playbookData.name.trim().length === 0) {
    errors.name = 'Playbook name is required';
  }

  if (playbookData.steps && !Array.isArray(playbookData.steps)) {
    errors.steps = 'Steps must be an array';
  }

  if (playbookData.steps && playbookData.steps.length === 0) {
    errors.steps = 'Playbook must have at least one step';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate playbook step
 */
export const validatePlaybookStep = (step) => {
  const errors = {};

  if (!step.title || step.title.trim().length === 0) {
    errors.title = 'Step title is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Transform playbook data for API
 */
export const transformPlaybookForAPI = (playbookData) => {
  return {
    name: playbookData.name?.trim() || '',
    steps: (playbookData.steps || []).map(step => ({
      title: step.title?.trim() || '',
      description: step.description?.trim() || '',
      checklist: step.checklist || []
    }))
  };
};

/**
 * Format playbook for display
 */
export const formatPlaybook = (playbook) => {
  return {
    ...playbook,
    stepCount: playbook.steps?.length || 0,
    createdAt: playbook.created_at ? new Date(playbook.created_at) : null
  };
};
