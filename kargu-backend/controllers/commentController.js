const bcrypt = require('bcryptjs');
const commentModal = require('../models/commentModal');

class CommentController {
  static async getAllComments(req, res) {
    try {
      const comments = await commentModal.getAllComments();
      res.json(comments);
    } catch (err) {
      console.error('Get Comments error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async createComment(req, res) {
    try {
      const { username, user_id, case_id, comment } = req.body;

      if (!comment) {
        return res.status(400).json({ error: 'Yorum boş bırakılamaz.' });
      }
       if (!username || !user_id || !case_id) {
        return res.status(400).json({ error: 'Sistem tarafından gönderilmesi gereken parametreler ulaşmadı.' });
      }


      const createComment = await commentModal.create({
        username,
        user_id,
        case_id,
        comment,
        visible:true
      });

      res.status(201).json(createComment);
    } catch (err) {
      console.error('Yorum eklenmedi.', err);
           
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async updateComment(req, res) {
    try {
      const {id,comment} = req.body;

      if (!comment) {
        return res.status(400).json({ error: 'Yorum boş bırakılamaz.' });
      }
       if (!id) {
        return res.status(400).json({ error: 'ID Gelmedi.' });
      }

      const updateComment = await commentModal.update(id, comment);

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
      await commentModal.softDelete(req.params.id);
      res.json({ message: 'Yorumun Silindi' });
    } catch (err) {
      console.error('Yorum Silinemedi:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = CommentController;