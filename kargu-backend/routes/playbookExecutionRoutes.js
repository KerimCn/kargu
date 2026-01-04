const express = require('express');
const router = express.Router();
const PlaybookExecutionController = require('../controllers/playbookExecutionController');
const { authenticateToken } = require('../middleware/auth');

router.get('/:casePlaybookId', authenticateToken, PlaybookExecutionController.getExecution);
router.patch('/:executionId', authenticateToken, PlaybookExecutionController.updateExecution);
router.post('/:executionId/complete', authenticateToken, PlaybookExecutionController.completeExecution);

module.exports = router;

