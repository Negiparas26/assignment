const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, taskController.createTask);
router.get('/', authenticateToken, taskController.getTasks);
router.put('/:id', authenticateToken, taskController.updateTask); // Add RBAC if needed
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'manager'), taskController.deleteTask);

module.exports = router;
