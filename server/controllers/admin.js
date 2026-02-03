const User = require('../models/User');
const Topic = require('../models/Topic');
const Quiz = require('../models/Quiz');
const Game = require('../models/Game');
const Experiment = require('../models/Experiment');
const Progress = require('../models/Progress');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const totalStudents = await User.countDocuments({ role: 'student' });
  const totalTeachers = await User.countDocuments({ role: 'teacher' });
  const totalTopics = await Topic.countDocuments();
  const totalQuizzes = await Quiz.countDocuments();
  const totalGames = await Game.countDocuments();
  const totalExperiments = await Experiment.countDocuments();
  
  // Get recent registrations (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const newUsersThisMonth = await User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo }
  });

  // Get active users (logged in within last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const activeUsers = await User.countDocuments({
    lastLoginAt: { $gte: sevenDaysAgo }
  });

  const stats = {
    totalUsers,
    totalStudents,
    totalTeachers,
    totalTopics,
    totalQuizzes,
    totalGames,
    totalExperiments,
    newUsersThisMonth,
    activeUsers
  };

  res.status(200).json({
    success: true,
    data: stats
  });
});

// @desc    Get all users with pagination
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  const total = await User.countDocuments();
  
  const users = await User.find()
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(startIndex);

  const pagination = {
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalUsers: total,
    hasNext: page < Math.ceil(total / limit),
    hasPrev: page > 1
  };

  res.status(200).json({
    success: true,
    data: users,
    pagination
  });
});

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Get user's progress
  const progress = await Progress.findOne({ user: req.params.id });

  res.status(200).json({
    success: true,
    data: {
      user,
      progress
    }
  });
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  ).select('-password');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  await user.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get content statistics
// @route   GET /api/admin/content/stats
// @access  Private/Admin
exports.getContentStats = asyncHandler(async (req, res, next) => {
  const topicsByCategory = await Topic.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    }
  ]);

  const quizStats = await Quiz.aggregate([
    {
      $group: {
        _id: '$difficulty',
        count: { $sum: 1 }
      }
    }
  ]);

  const experimentStats = await Experiment.aggregate([
    {
      $group: {
        _id: '$difficulty',
        count: { $sum: 1 }
      }
    }
  ]);

  const gameStats = await Game.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      topicsByCategory,
      quizStats,
      experimentStats,
      gameStats
    }
  });
});

// @desc    Get user activity analytics
// @route   GET /api/admin/analytics/users
// @access  Private/Admin
exports.getUserAnalytics = asyncHandler(async (req, res, next) => {
  // User registrations by month
  const registrationsByMonth = await User.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);

  // Users by state/region
  const usersByRegion = await User.aggregate([
    {
      $group: {
        _id: '$state',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  // Users by grade
  const usersByGrade = await User.aggregate([
    {
      $group: {
        _id: '$grade',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      registrationsByMonth,
      usersByRegion,
      usersByGrade
    }
  });
});

// @desc    Get learning analytics
// @route   GET /api/admin/analytics/learning
// @access  Private/Admin
exports.getLearningAnalytics = asyncHandler(async (req, res, next) => {
  // Most popular topics
  const popularTopics = await Progress.aggregate([
    { $unwind: '$completedTopics' },
    {
      $group: {
        _id: '$completedTopics.topic',
        completionCount: { $sum: 1 },
        avgTimeSpent: { $avg: '$completedTopics.timeSpent' }
      }
    },
    {
      $lookup: {
        from: 'topics',
        localField: '_id',
        foreignField: '_id',
        as: 'topic'
      }
    },
    { $unwind: '$topic' },
    {
      $sort: { completionCount: -1 }
    },
    { $limit: 10 }
  ]);

  // Quiz performance statistics
  const quizPerformance = await Progress.aggregate([
    { $unwind: '$quizAttempts' },
    {
      $group: {
        _id: '$quizAttempts.quiz',
        avgScore: { $avg: '$quizAttempts.percentage' },
        totalAttempts: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'quizzes',
        localField: '_id',
        foreignField: '_id',
        as: 'quiz'
      }
    },
    { $unwind: '$quiz' },
    {
      $sort: { totalAttempts: -1 }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      popularTopics,
      quizPerformance
    }
  });
});

// @desc    Bulk operations for users
// @route   POST /api/admin/users/bulk
// @access  Private/Admin
exports.bulkUserOperations = asyncHandler(async (req, res, next) => {
  const { operation, userIds, data } = req.body;

  let result;

  switch (operation) {
    case 'activate':
      result = await User.updateMany(
        { _id: { $in: userIds } },
        { isActive: true }
      );
      break;
    
    case 'deactivate':
      result = await User.updateMany(
        { _id: { $in: userIds } },
        { isActive: false }
      );
      break;
    
    case 'delete':
      result = await User.deleteMany({ _id: { $in: userIds } });
      break;
    
    case 'updateRole':
      result = await User.updateMany(
        { _id: { $in: userIds } },
        { role: data.role }
      );
      break;
    
    default:
      return next(new ErrorResponse('Invalid bulk operation', 400));
  }

  res.status(200).json({
    success: true,
    data: result
  });
});