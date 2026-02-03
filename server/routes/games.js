const express = require('express');
const {
  getGames,
  getGame,
  getGameBySlug,
  getPopularGames,
  getGameCategories,
  createGame,
  updateGame,
  deleteGame,
  startGame,
  updateGameProgress,
  submitGameScore
} = require('../controllers/games');

const { protect } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', getGames);
router.get('/popular', getPopularGames);
router.get('/categories', getGameCategories);
router.get('/slug/:slug', getGameBySlug);
router.get('/:id', validateObjectId, getGame);

// Protected routes
router.post('/:id/start', protect, validateObjectId, startGame);
router.put('/:id/progress', protect, validateObjectId, updateGameProgress);
// Student routes
router.post('/:id/score', protect, submitGameScore);

// Admin/Teacher routes
router.post('/', protect, createGame);
router.put('/:id', protect, updateGame);
router.delete('/:id', protect, deleteGame);

module.exports = router;