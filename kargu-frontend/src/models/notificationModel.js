/**
 * Notification Model - Data validation and transformation
 */

export const notificationTypes = {
  CASE_CREATED: 'case_created',
  CASE_UPDATED: 'case_updated',
  CASE_RESOLVED: 'case_resolved',
  TASK_ASSIGNED: 'task_assigned',
  TASK_COMPLETED: 'task_completed',
  COMMENT_ADDED: 'comment_added'
};

/**
 * Format notification for display
 */
export const formatNotification = (notification) => {
  return {
    ...notification,
    createdAt: notification.created_at ? new Date(notification.created_at) : null,
    isRead: notification.is_read || false
  };
};

/**
 * Group notifications by date
 */
export const groupNotificationsByDate = (notifications) => {
  const groups = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  notifications.forEach(notification => {
    const date = new Date(notification.created_at);
    date.setHours(0, 0, 0, 0);

    let key;
    if (date.getTime() === today.getTime()) {
      key = 'Today';
    } else if (date.getTime() === today.getTime() - 86400000) {
      key = 'Yesterday';
    } else {
      key = date.toLocaleDateString();
    }

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(notification);
  });

  return groups;
};
