/**
 * Comment Model - Data validation and transformation
 */

/**
 * Validate comment data
 */
export const validateComment = (commentData) => {
  const errors = {};

  if (!commentData.comment || commentData.comment.trim().length === 0) {
    errors.comment = 'Comment cannot be empty';
  }

  if (commentData.comment && commentData.comment.length > 5000) {
    errors.comment = 'Comment must be less than 5000 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Transform comment data for API
 */
export const transformCommentForAPI = (commentData) => {
  return {
    case_id: commentData.case_id,
    comment: commentData.comment?.trim() || ''
  };
};

/**
 * Format comment for display
 */
export const formatComment = (comment) => {
  return {
    ...comment,
    createdAt: comment.created_at ? new Date(comment.created_at) : null,
    updatedAt: comment.updated_at ? new Date(comment.updated_at) : null
  };
};
