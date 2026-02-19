const express = require('express');
const router = express.Router();
const { register, login, getAllUsers, deleteUser, updateUserRole } = require('../controllers/authController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);

// Admin Routes
router.get('/users', authenticateToken, authorizeRoles('admin'), getAllUsers);
router.delete('/users/:id', authenticateToken, authorizeRoles('admin'), deleteUser);
router.put('/users/:id/role', authenticateToken, authorizeRoles('admin'), updateUserRole);

module.exports = router;
