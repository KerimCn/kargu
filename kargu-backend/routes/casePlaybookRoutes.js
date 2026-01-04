const express = require('express');
const router = express.Router();
const CasePlaybookController = require('../controllers/casePlaybookController');
const { authenticateToken } = require('../middleware/auth');

router.get('/case/:caseId', authenticateToken, CasePlaybookController.getCasePlaybooks);
router.post('/case/:caseId', authenticateToken, CasePlaybookController.addPlaybookToCase);
router.delete('/:id', authenticateToken, CasePlaybookController.removePlaybookFromCase);

module.exports = router;

