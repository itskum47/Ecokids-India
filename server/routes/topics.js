const express = require('express');
const {
  getTopics,
  getTopic,
  createTopic,
  updateTopic,
  deleteTopic,
  getTopicsByCategory,
  getPopularTopics,
  searchTopics,
  likeTopic,
  completeTopic
} = require('../controllers/topics');

const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validateTopic, validateObjectId, validatePagination } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', validatePagination, optionalAuth, getTopics);
router.get('/popular', getPopularTopics);
router.get('/category/:category', validatePagination, getTopicsByCategory);
router.get('/search', searchTopics);
router.get('/:id', validateObjectId, optionalAuth, getTopic);

// Protected routes
router.post('/:id/like', protect, validateObjectId, likeTopic);
router.post('/:id/complete', protect, validateObjectId, completeTopic);

// Admin routes
router.post('/', protect, authorize('admin', 'teacher'), validateTopic, createTopic);
router.put('/:id', protect, authorize('admin', 'teacher'), validateObjectId, validateTopic, updateTopic);
router.delete('/:id', protect, authorize('admin'), validateObjectId, deleteTopic);

module.exports = router;