/**
 * User Controller - Business logic for users
 */
import { userAPI } from '../services/api';
import { validateUser, transformUserForAPI, formatUser, isAdmin } from '../models/userModel';

/**
 * User Controller Class
 */
export class UserController {
  /**
   * Get all users
   */
  static async getAllUsers() {
    try {
      const users = await userAPI.getAll();
      return {
        success: true,
        data: users.map(formatUser),
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error.message || 'Failed to fetch users'
      };
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(id) {
    try {
      const user = await userAPI.getById(id);
      return {
        success: true,
        data: formatUser(user),
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to fetch user'
      };
    }
  }

  /**
   * Create user
   */
  static async createUser(userData) {
    // Validate
    const validation = validateUser(userData);
    if (!validation.isValid) {
      return {
        success: false,
        data: null,
        error: Object.values(validation.errors).join(', ')
      };
    }

    // Transform
    const transformedData = transformUserForAPI(userData);

    try {
      const newUser = await userAPI.create(transformedData);
      return {
        success: true,
        data: formatUser(newUser),
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to create user'
      };
    }
  }

  /**
   * Update user
   */
  static async updateUser(id, userData) {
    // Validate updates
    const validation = validateUser(userData);
    if (!validation.isValid) {
      return {
        success: false,
        data: null,
        error: Object.values(validation.errors).join(', ')
      };
    }

    // Transform
    const transformedData = transformUserForAPI(userData);

    try {
      const updatedUser = await userAPI.update(id, transformedData);
      return {
        success: true,
        data: formatUser(updatedUser),
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to update user'
      };
    }
  }

  /**
   * Delete user
   */
  static async deleteUser(id) {
    try {
      await userAPI.delete(id);
      return {
        success: true,
        data: null,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to delete user'
      };
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(userData) {
    const validation = validateUser(userData);
    if (!validation.isValid) {
      return {
        success: false,
        data: null,
        error: Object.values(validation.errors).join(', ')
      };
    }

    const transformedData = transformUserForAPI(userData);

    try {
      const updatedUser = await userAPI.updateProfile(transformedData);
      return {
        success: true,
        data: formatUser(updatedUser),
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to update profile'
      };
    }
  }

  /**
   * Search users
   */
  static searchUsers(users, searchTerm) {
    if (!searchTerm) return users;
    const term = searchTerm.toLowerCase();
    return users.filter(user =>
      user.username?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.full_name?.toLowerCase().includes(term) ||
      user.role?.toLowerCase().includes(term)
    );
  }

  /**
   * Check if user is admin
   */
  static checkIsAdmin(user) {
    return isAdmin(user);
  }
}
