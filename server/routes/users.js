const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserProgress,
  getUserAchievements,
  getLeaderboard,
  updateUserRole
} = require('../controllers/users');

const { protect, authorize } = require('../middleware/auth');
const { validateObjectId, validatePagination } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// User routes
router.get('/progress', getUserProgress);
router.get('/achievements', getUserAchievements);
router.get('/leaderboard', getLeaderboard);

// Admin only routes
router.get('/', authorize('admin'), validatePagination, getUsers);
router.get('/:id', authorize('admin'), validateObjectId, getUser);
router.put('/:id', authorize('admin'), validateObjectId, updateUser);
router.put('/:id/role', authorize('admin'), validateObjectId, updateUserRole);
router.delete('/:id', authorize('admin'), validateObjectId, deleteUser);

module.exports = router;