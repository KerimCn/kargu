/**
 * Playbook Controller - Business logic for playbooks
 */
import { playbookAPI, casePlaybookAPI, playbookExecutionAPI } from '../services/api';
import { validatePlaybook, transformPlaybookForAPI, formatPlaybook } from '../models/playbookModel';

/**
 * Playbook Controller Class
 */
export class PlaybookController {
  /**
   * Get all playbooks
   */
  static async getAllPlaybooks() {
    try {
      const playbooks = await playbookAPI.getAll();
      return {
        success: true,
        data: playbooks.map(formatPlaybook),
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error.message || 'Failed to fetch playbooks'
      };
    }
  }

  /**
   * Get playbook by ID
   */
  static async getPlaybookById(id) {
    try {
      const playbook = await playbookAPI.getById(id);
      return {
        success: true,
        data: formatPlaybook(playbook),
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to fetch playbook'
      };
    }
  }

  /**
   * Create playbook
   */
  static async createPlaybook(playbookData) {
    // Validate
    const validation = validatePlaybook(playbookData);
    if (!validation.isValid) {
      return {
        success: false,
        data: null,
        error: Object.values(validation.errors).join(', ')
      };
    }

    // Transform
    const transformedData = transformPlaybookForAPI(playbookData);

    try {
      const newPlaybook = await playbookAPI.create(transformedData);
      return {
        success: true,
        data: formatPlaybook(newPlaybook),
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to create playbook'
      };
    }
  }

  /**
   * Update playbook
   */
  static async updatePlaybook(id, playbookData) {
    // Validate
    const validation = validatePlaybook(playbookData);
    if (!validation.isValid) {
      return {
        success: false,
        data: null,
        error: Object.values(validation.errors).join(', ')
      };
    }

    // Transform
    const transformedData = transformPlaybookForAPI(playbookData);

    try {
      const updatedPlaybook = await playbookAPI.update(id, transformedData);
      return {
        success: true,
        data: formatPlaybook(updatedPlaybook),
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to update playbook'
      };
    }
  }

  /**
   * Delete playbook
   */
  static async deletePlaybook(id) {
    try {
      await playbookAPI.delete(id);
      return {
        success: true,
        data: null,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to delete playbook'
      };
    }
  }

  /**
   * Get playbooks for a case
   */
  static async getCasePlaybooks(caseId) {
    try {
      const casePlaybooks = await casePlaybookAPI.getByCaseId(caseId);
      return {
        success: true,
        data: casePlaybooks,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error.message || 'Failed to fetch case playbooks'
      };
    }
  }

  /**
   * Add playbook to case
   */
  static async addPlaybookToCase(caseId, playbookId) {
    try {
      const result = await casePlaybookAPI.addToCase(caseId, playbookId);
      return {
        success: true,
        data: result,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to add playbook to case'
      };
    }
  }

  /**
   * Remove playbook from case
   */
  static async removePlaybookFromCase(id) {
    try {
      await casePlaybookAPI.removeFromCase(id);
      return {
        success: true,
        data: null,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to remove playbook from case'
      };
    }
  }

  /**
   * Get playbook execution
   */
  static async getPlaybookExecution(casePlaybookId) {
    try {
      const execution = await playbookExecutionAPI.getByCasePlaybookId(casePlaybookId);
      return {
        success: true,
        data: execution,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to fetch playbook execution'
      };
    }
  }

  /**
   * Update playbook execution
   */
  static async updatePlaybookExecution(executionId, updates) {
    try {
      const execution = await playbookExecutionAPI.update(executionId, updates);
      return {
        success: true,
        data: execution,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to update playbook execution'
      };
    }
  }

  /**
   * Complete playbook execution
   */
  static async completePlaybookExecution(executionId) {
    try {
      const execution = await playbookExecutionAPI.complete(executionId);
      return {
        success: true,
        data: execution,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to complete playbook execution'
      };
    }
  }
}
