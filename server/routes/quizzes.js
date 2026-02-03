const express = require('express');
const {
  getQuizzes,
  getQuiz,
  startQuizAttempt,
  submitAnswer,
  completeQuizAttempt,
  getMyQuizAttempts,
  getFeaturedQuizzes,
  getPopularQuizzes,
  getQuizzesByTopic,
  createQuiz,
  updateQuiz,
  deleteQuiz
} = require('../controllers/quizController');

const { protect, authorize } = require('../middleware/auth');
const { body } = require('express-validator');

const router = express.Router();

// Validation rules
const quizValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('topic')
    .notEmpty()
    .withMessage('Topic is required')
    .isMongoId()
    .withMessage('Invalid topic ID'),
  body('category')
    .isIn([
      'air-pollution',
      'water-conservation',
      'biodiversity',
      'climate-change',
      'waste-management',
      'renewable-energy',
      'soil-health',
      'forest-conservation'
    ])
    .withMessage('Please select a valid category'),
  body('difficulty')
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Please select a valid difficulty level')
];

const answerSubmissionValidation = [
  body('attemptId')
    .notEmpty()
    .withMessage('Attempt ID is required')
    .isMongoId()
    .withMessage('Invalid attempt ID'),
  body('questionId')
    .notEmpty()
    .withMessage('Question ID is required')
    .isMongoId()
    .withMessage('Invalid question ID'),
  body('answer')
    .notEmpty()
    .withMessage('Answer is required')
];

// Public routes
router.get('/featured', getFeaturedQuizzes);
router.get('/popular', getPopularQuizzes);
router.get('/topic/:topicId', getQuizzesByTopic);
router.get('/', getQuizzes);
router.get('/:slug', getQuiz);

// Protected routes
router.use(protect);

// Student routes
router.get('/user/my-attempts', getMyQuizAttempts);
router.post('/:id/start', startQuizAttempt);
router.post('/:id/submit-answer', answerSubmissionValidation, submitAnswer);
router.post('/:id/complete', 
  [
    body('attemptId').isMongoId().withMessage('Invalid attempt ID'),
    body('totalTimeSpent').isInt({ min: 0 }).withMessage('Invalid time spent')
  ],
  completeQuizAttempt
);

// Content creation routes (Teachers/Admins)
router.post('/',
  authorize('teacher', 'admin'),
  quizValidation,
  createQuiz
);

router.put('/:id',
  authorize('teacher', 'admin'),
  updateQuiz
);

router.delete('/:id',
  authorize('teacher', 'admin'),
  deleteQuiz
);

module.exports = router;