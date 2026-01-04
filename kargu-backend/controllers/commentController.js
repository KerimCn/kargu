const commentModal = require('../models/commentModal');
const CaseModel = require('../models/caseModel');
const UserModel = require('../models/userModel');

class CommentController {
  static async getAllComments(req, res) {
    try {
      const { case_id } = req.query;

      if (!case_id) {
        return res.status(400).json({ error: 'case_id parameter is required' });
      }

      const comments = await commentModal.getAllComments(case_id);
      res.json(comments);
    } catch (err) {
      console.error('Get Comments error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async createComment(req, res) {
    try {
      const { case_id, comment } = req.body;
      const user_id = req.user.id;
      const username = req.user.username;

      if (!comment || comment.trim() === '') {
        return res.status(400).json({ error: 'Yorum boş bırakılamaz.' });
      }

      if (!case_id) {
        return res.status(400).json({ error: 'case_id gereklidir.' });
      }

      // Verify case exists
      const caseExists = await CaseModel.findById(case_id);
      if (!caseExists) {
        return res.status(404).json({ error: 'Case bulunamadı.' });
      }

      // Verify user exists
      const userExists = await UserModel.findById(user_id);
      if (!userExists) {
        return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
      }

      const createComment = await commentModal.create({
        username,
        user_id,
        case_id,
        comment: comment.trim(),
        visible: true
      });

      res.status(201).json(createComment);
    } catch (err) {
      console.error('Yorum eklenmedi.', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async updateComment(req, res) {
    try {
      const { comment } = req.body;
      const commentId = req.params.id;
      const userId = req.user.id;

      if (!comment || comment.trim() === '') {
        return res.status(400).json({ error: 'Yorum boş bırakılamaz.' });
      }

      // Get the comment to check ownership
      const existingComment = await commentModal.findById(commentId);
      if (!existingComment) {
        return res.status(404).json({ error: 'Yorum bulunamadı' });
      }

      // Check if user owns the comment or is admin
      if (existingComment.user_id !== userId && req.user.role !== '4' && req.user.role !== '3') {
        return res.status(403).json({ error: 'Bu yorumu düzenleme yetkiniz yok.' });
      }

      const updateComment = await commentModal.update(commentId, comment.trim());

      if (!updateComment) {
        return res.status(404).json({ error: 'Yorum bulunamadı' });
      }

      res.json(updateComment);
    } catch (err) {
      console.error('Update comment error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async deleteComment(req, res) {
    try {
      const commentId = req.params.id;
      const userId = req.user.id;

      // Get the comment to check ownership
      const existingComment = await commentModal.findById(commentId);
      if (!existingComment) {
        return res.status(404).json({ error: 'Yorum bulunamadı' });
      }

      // Check if user owns the comment or is admin
      if (existingComment.user_id !== userId && req.user.role !== '4' && req.user.role !== '3') {
        return res.status(403).json({ error: 'Bu yorumu silme yetkiniz yok.' });
      }

      await commentModal.softDelete(commentId);
      res.json({ message: 'Yorum silindi' });
    } catch (err) {
      console.error('Yorum Silinemedi:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = CommentController;