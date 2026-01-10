/**
 * Comment Controller - Business logic for comments
 */
import { commentAPI } from '../services/api';
import { validateComment, transformCommentForAPI, formatComment } from '../models/commentModel';

/**
 * Comment Controller Class
 */
export class CommentController {
  /**
   * Get all comments for a case
   */
  static async getCommentsByCaseId(caseId) {
    try {
      const comments = await commentAPI.getAll(caseId);
      return {
        success: true,
        data: comments.map(formatComment),
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error.message || 'Failed to fetch comments'
      };
    }
  }

  /**
   * Create comment
   */
  static async createComment(caseId, commentText) {
    const commentData = { case_id: caseId, comment: commentText };
    
    // Validate
    const validation = validateComment(commentData);
    if (!validation.isValid) {
      return {
        success: false,
        data: null,
        error: Object.values(validation.errors).join(', ')
      };
    }

    // Transform
    const transformedData = transformCommentForAPI(commentData);

    try {
      const newComment = await commentAPI.create(caseId, transformedData.comment);
      return {
        success: true,
        data: formatComment(newComment),
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to create comment'
      };
    }
  }

  /**
   * Update comment
   */
  static async updateComment(id, commentText) {
    const commentData = { comment: commentText };
    
    // Validate
    const validation = validateComment(commentData);
    if (!validation.isValid) {
      return {
        success: false,
        data: null,
        error: Object.values(validation.errors).join(', ')
      };
    }

    try {
      const updatedComment = await commentAPI.update(id, commentText);
      return {
        success: true,
        data: formatComment(updatedComment),
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to update comment'
      };
    }
  }

  /**
   * Delete comment
   */
  static async deleteComment(id) {
    try {
      await commentAPI.delete(id);
      return {
        success: true,
        data: null,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to delete comment'
      };
    }
  }
}
