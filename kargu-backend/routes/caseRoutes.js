const express = require('express');
const router = express.Router();
const CaseController = require('../controllers/caseController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, CaseController.getAllCases);
router.get('/:id', authenticateToken, CaseController.getCaseById);
router.get('/:id/detail', authenticateToken, CaseController.getCaseDetail);
router.post('/', authenticateToken, CaseController.createCase);
router.patch('/:id', authenticateToken, CaseController.updateCase);
router.delete('/:id', authenticateToken, CaseController.deleteCase);

module.exports = router;