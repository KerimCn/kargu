const NotificationModel = require('../models/notificationModel');
const CaseModel = require('../models/caseModel');

class NotificationService {
  static async createNotificationForCaseUsers(caseId, type, title, message, excludeUserId = null) {
    try {
      const caseData = await CaseModel.findById(caseId);
      if (!caseData) {
        console.error('Case not found for notification:', caseId);
        return;
      }

      const usersToNotify = [];
      
      // Add case creator if exists and not excluded
      if (caseData.created_by && caseData.created_by !== excludeUserId) {
        usersToNotify.push(caseData.created_by);
      }
      
      // Add case assignee if exists and not excluded
      if (caseData.assigned_to && caseData.assigned_to !== excludeUserId) {
        // Don't add if already in the list (in case creator and assignee are the same)
        if (!usersToNotify.includes(caseData.assigned_to)) {
          usersToNotify.push(caseData.assigned_to);
        }
      }

      // Create notifications for all users
      // Include case title in the notification title
      const caseTitle = caseData.title || 'Case';
      const finalTitle = `${caseTitle}: ${title}`;
      
      for (const userId of usersToNotify) {
        await NotificationModel.create({
          user_id: userId,
          case_id: caseId,
          type,
          title: finalTitle,
          message
        });
      }

      return { success: true, notifiedUsers: usersToNotify.length };
    } catch (err) {
      console.error('Error creating notifications:', err);
      return { success: false, error: err.message };
    }
  }

  static async createNotificationForUser(userId, caseId, type, title, message) {
    try {
      const notification = await NotificationModel.create({
        user_id: userId,
        case_id: caseId,
        type,
        title,
        message
      });
      return notification;
    } catch (err) {
      console.error('Error creating notification:', err);
      return null;
    }
  }
}

module.exports = NotificationService;

