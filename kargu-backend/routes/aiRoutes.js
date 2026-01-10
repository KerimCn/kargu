const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { authenticateToken } = require('../middleware/auth');

router.get('/cases/:caseId/summary', authenticateToken, aiController.getAISummary);
router.post('/cases/:caseId/summary', authenticateToken, aiController.generateAISummary);

module.exports = router;
