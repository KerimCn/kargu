const express = require('express');
const router = express.Router();
const PlaybookController = require('../controllers/playbookController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, PlaybookController.getAllPlaybooks);
router.get('/:id', authenticateToken, PlaybookController.getPlaybookById);
router.post('/', authenticateToken, PlaybookController.createPlaybook);
router.patch('/:id', authenticateToken, PlaybookController.updatePlaybook);
router.delete('/:id', authenticateToken, PlaybookController.deletePlaybook);

module.exports = router;

