const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/commentController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, CommentController.getAllComments);
router.post('/', authenticateToken, CommentController.createComment);
router.put('/:id', authenticateToken, CommentController.updateComment);
router.delete('/:id', authenticateToken, CommentController.deleteComment);

module.exports = router;