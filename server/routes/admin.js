const express = require('express');
const {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getContentStats,
  getUserAnalytics,
  getLearningAnalytics,
  bulkUserOperations
} = require('../controllers/admin');

const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require admin access (we'll implement admin check later)
router.use(protect);

// Dashboard
router.get('/dashboard', getDashboardStats);
router.get('/analytics/users', getUserAnalytics);
router.get('/analytics/learning', getLearningAnalytics);
router.get('/content/stats', getContentStats);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/users/bulk', bulkUserOperations);

module.exports = router;