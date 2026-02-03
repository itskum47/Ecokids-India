const { Badge, Level, CertificateTemplate, Leaderboard } = require('../models/Gamification');
const User = require('../models/User');
const gamificationService = require('../services/gamificationService');
const { validationResult } = require('express-validator');

// Get user's gamification data
exports.getUserGamificationData = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId)
      .populate('badges.badge')
      .populate('certificates.template')
      .select('ecoPoints level streaks badges certificates pointsHistory levelHistory');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's current level info
    const currentLevel = await Level.findOne({ level: user.level });
    const nextLevel = await Level.findOne({ level: user.level + 1 });

    // Get recent activities
    const recentPoints = user.pointsHistory
      .sort((a, b) => b.earnedAt - a.earnedAt)
      .slice(0, 10);

    // Get user's rank
    const globalRank = await User.countDocuments({ ecoPoints: { $gt: user.ecoPoints } }) + 1;

    res.json({
      success: true,
      data: {
        points: user.ecoPoints,
        level: user.level,
        currentLevel,
        nextLevel,
        streaks: user.streaks,
        badges: user.badges,
        certificates: user.certificates,
        recentPoints,
        globalRank,
        progress: nextLevel ? {
          current: user.ecoPoints - currentLevel.minPoints,
          total: nextLevel.minPoints - currentLevel.minPoints,
          percentage: ((user.ecoPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
        } : null
      }
    });
  } catch (error) {
    console.error('Get user gamification data error:', error);
    res.status(500).json({ message: 'Failed to fetch gamification data' });
  }
};

// Get leaderboards
exports.getLeaderboards = async (req, res) => {
  try {
    const { type = 'global', timeframe = 'weekly', category = 'points' } = req.query;
    
    const leaderboard = await Leaderboard.findOne({
      type,
      timeframe,
      category,
      isActive: true
    }).populate('rankings.user', 'firstName lastName avatar school region level');

    if (!leaderboard) {
      return res.status(404).json({ message: 'Leaderboard not found' });
    }

    // Add user's position if authenticated
    let userPosition = null;
    if (req.user) {
      const userRanking = leaderboard.rankings.find(
        r => r.user._id.toString() === req.user.id
      );
      if (userRanking) {
        userPosition = {
          rank: userRanking.rank,
          score: userRanking.score,
          change: userRanking.change
        };
      }
    }

    res.json({
      success: true,
      data: {
        leaderboard: {
          type: leaderboard.type,
          timeframe: leaderboard.timeframe,
          category: leaderboard.category,
          lastUpdated: leaderboard.lastUpdated,
          rankings: leaderboard.rankings.slice(0, 50) // Top 50
        },
        userPosition
      }
    });
  } catch (error) {
    console.error('Get leaderboards error:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboards' });
  }
};

// Get all badges
exports.getBadges = async (req, res) => {
  try {
    const { category } = req.query;
    
    const filter = { isActive: true };
    if (category) filter.category = category;

    const badges = await Badge.find(filter).sort({ rarity: 1, points: 1 });
    
    // If user is authenticated, mark which badges they have
    let userBadges = [];
    if (req.user) {
      const user = await User.findById(req.user.id).select('badges');
      userBadges = user.badges.map(b => b.badge.toString());
    }

    const badgesWithStatus = badges.map(badge => ({
      ...badge.toObject(),
      earned: userBadges.includes(badge._id.toString())
    }));

    res.json({
      success: true,
      data: badgesWithStatus
    });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({ message: 'Failed to fetch badges' });
  }
};

// Get levels
exports.getLevels = async (req, res) => {
  try {
    const levels = await Level.find().sort({ level: 1 });
    
    // Add user progress if authenticated
    let userLevel = null;
    if (req.user) {
      const user = await User.findById(req.user.id).select('level ecoPoints');
      userLevel = user.level;
    }

    const levelsWithProgress = levels.map(level => ({
      ...level.toObject(),
      unlocked: userLevel ? level.level <= userLevel : false,
      current: userLevel === level.level
    }));

    res.json({
      success: true,
      data: levelsWithProgress
    });
  } catch (error) {
    console.error('Get levels error:', error);
    res.status(500).json({ message: 'Failed to fetch levels' });
  }
};

// Generate certificate
exports.generateCertificate = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { templateId, data } = req.body;
    const userId = req.user.id;

    const result = await gamificationService.generateCertificate(userId, templateId, data);

    // In a real application, you would upload the PDF to cloud storage
    // For now, we'll just return success
    
    res.json({
      success: true,
      message: 'Certificate generated successfully',
      data: {
        certificateId: result.certificate.data.certificateId,
        issuedAt: result.certificate.issuedAt
      }
    });
  } catch (error) {
    console.error('Generate certificate error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Get user certificates
exports.getUserCertificates = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId)
      .populate('certificates.template', 'name type')
      .select('certificates');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      data: user.certificates.sort((a, b) => b.issuedAt - a.issuedAt)
    });
  } catch (error) {
    console.error('Get user certificates error:', error);
    res.status(500).json({ message: 'Failed to fetch certificates' });
  }
};

// Award points manually (admin only)
exports.awardPoints = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, points, description } = req.body;

    const result = await gamificationService.awardPoints(
      userId,
      points,
      'manual',
      description || 'Manual points award'
    );

    res.json({
      success: true,
      message: 'Points awarded successfully',
      data: result
    });
  } catch (error) {
    console.error('Award points error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Check for new achievements
exports.checkAchievements = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Update streak
    await gamificationService.updateUserStreak(userId);
    
    // Check for new badges
    const newBadges = await gamificationService.checkBadgeEligibility(userId);
    
    // Check for level up
    const levelResult = await gamificationService.checkLevelUp(userId);

    res.json({
      success: true,
      data: {
        newBadges,
        levelUp: levelResult.levelUp,
        newLevel: levelResult.newLevel,
        bonusPoints: levelResult.bonusPoints
      }
    });
  } catch (error) {
    console.error('Check achievements error:', error);
    res.status(500).json({ message: 'Failed to check achievements' });
  }
};

// Get achievement statistics
exports.getAchievementStats = async (req, res) => {
  try {
    const stats = await Promise.all([
      Badge.countDocuments({ isActive: true }),
      Level.countDocuments(),
      User.aggregate([
        { $group: { _id: null, avgLevel: { $avg: '$level' }, maxPoints: { $max: '$ecoPoints' } } }
      ]),
      User.countDocuments({ 'badges.0': { $exists: true } }),
      User.countDocuments({ 'certificates.0': { $exists: true } })
    ]);

    const [
      totalBadges,
      totalLevels,
      userStats,
      usersWithBadges,
      usersWithCertificates
    ] = stats;

    res.json({
      success: true,
      data: {
        totalBadges,
        totalLevels,
        averageLevel: Math.round(userStats[0]?.avgLevel || 0),
        highestPoints: userStats[0]?.maxPoints || 0,
        usersWithBadges,
        usersWithCertificates
      }
    });
  } catch (error) {
    console.error('Get achievement stats error:', error);
    res.status(500).json({ message: 'Failed to fetch achievement statistics' });
  }
};

// Admin: Create badge
exports.createBadge = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const badge = new Badge(req.body);
    await badge.save();

    res.status(201).json({
      success: true,
      message: 'Badge created successfully',
      data: badge
    });
  } catch (error) {
    console.error('Create badge error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Badge name already exists' });
    }
    res.status(500).json({ message: 'Failed to create badge' });
  }
};

// Admin: Update badge
exports.updateBadge = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const badge = await Badge.findByIdAndUpdate(id, req.body, { new: true });

    if (!badge) {
      return res.status(404).json({ message: 'Badge not found' });
    }

    res.json({
      success: true,
      message: 'Badge updated successfully',
      data: badge
    });
  } catch (error) {
    console.error('Update badge error:', error);
    res.status(500).json({ message: 'Failed to update badge' });
  }
};

// Admin: Delete badge
exports.deleteBadge = async (req, res) => {
  try {
    const { id } = req.params;
    const badge = await Badge.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!badge) {
      return res.status(404).json({ message: 'Badge not found' });
    }

    res.json({
      success: true,
      message: 'Badge deactivated successfully'
    });
  } catch (error) {
    console.error('Delete badge error:', error);
    res.status(500).json({ message: 'Failed to delete badge' });
  }
};