/**
 * Case Controller - Business logic for cases
 */
import { caseAPI } from '../services/api';
import { validateCase, transformCaseForAPI, formatCase } from '../models/caseModel';

/**
 * Case Controller Class
 */
export class CaseController {
  /**
   * Get all cases
   */
  static async getAllCases() {
    try {
      const cases = await caseAPI.getAll();
      return {
        success: true,
        data: cases.map(formatCase),
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error.message || 'Failed to fetch cases'
      };
    }
  }

  /**
   * Get case by ID
   */
  static async getCaseById(id) {
    try {
      const caseData = await caseAPI.getById(id);
      return {
        success: true,
        data: formatCase(caseData),
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to fetch case'
      };
    }
  }

  /**
   * Get case detail
   */
  static async getCaseDetail(id) {
    try {
      const detailData = await caseAPI.getDetail(id);
      return {
        success: true,
        data: detailData,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to fetch case detail'
      };
    }
  }

  /**
   * Create case
   */
  static async createCase(caseData, file) {
    // Validate
    const validation = validateCase(caseData);
    if (!validation.isValid) {
      return {
        success: false,
        data: null,
        error: Object.values(validation.errors).join(', ')
      };
    }

    // Transform
    const transformedData = transformCaseForAPI(caseData);

    try {
      const newCase = await caseAPI.create(transformedData, file);
      return {
        success: true,
        data: formatCase(newCase),
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to create case'
      };
    }
  }

  /**
   * Update case
   */
  static async updateCase(id, updates) {
    // Validate updates if they include title or severity
    if (updates.title || updates.severity || updates.status) {
      const validation = validateCase(updates);
      if (!validation.isValid) {
        return {
          success: false,
          data: null,
          error: Object.values(validation.errors).join(', ')
        };
      }
    }

    try {
      const updatedCase = await caseAPI.update(id, updates);
      return {
        success: true,
        data: formatCase(updatedCase),
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to update case'
      };
    }
  }

  /**
   * Delete case
   */
  static async deleteCase(id) {
    try {
      await caseAPI.delete(id);
      return {
        success: true,
        data: null,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to delete case'
      };
    }
  }

  /**
   * Filter cases by status
   */
  static filterCasesByStatus(cases, status) {
    if (status === 'all') return cases;
    return cases.filter(c => c.status === status);
  }

  /**
   * Filter cases by severity
   */
  static filterCasesBySeverity(cases, severity) {
    return cases.filter(c => c.severity === severity);
  }

  /**
   * Search cases
   */
  static searchCases(cases, searchTerm) {
    if (!searchTerm) return cases;
    const term = searchTerm.toLowerCase();
    return cases.filter(c =>
      c.title?.toLowerCase().includes(term) ||
      c.description?.toLowerCase().includes(term) ||
      c.id?.toString().includes(term)
    );
  }
}
