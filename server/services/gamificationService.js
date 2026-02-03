const { Badge, Level, CertificateTemplate, Leaderboard } = require('../models/Gamification');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Game = require('../models/Game');
const Experiment = require('../models/Experiment');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;

class GamificationService {
  // Badge Management
  async awardBadge(userId, badgeId, context = {}) {
    try {
      const user = await User.findById(userId);
      const badge = await Badge.findById(badgeId);

      if (!user || !badge) {
        throw new Error('User or badge not found');
      }

      // Check if user already has this badge
      const existingBadge = user.badges.find(b => b.badge.toString() === badgeId);
      if (existingBadge) {
        return { success: false, message: 'Badge already awarded' };
      }

      // Award badge
      user.badges.push({
        badge: badgeId,
        awardedAt: new Date(),
        context
      });

      // Award points if badge has points
      if (badge.points > 0) {
        user.ecoPoints += badge.points;
        user.pointsHistory.push({
          points: badge.points,
          source: 'badge',
          sourceId: badgeId,
          description: `Badge awarded: ${badge.name}`,
          earnedAt: new Date()
        });
      }

      await user.save();

      return {
        success: true,
        badge,
        pointsAwarded: badge.points
      };
    } catch (error) {
      throw new Error(`Failed to award badge: ${error.message}`);
    }
  }

  async checkBadgeEligibility(userId) {
    try {
      const user = await User.findById(userId).populate('badges.badge');
      const badges = await Badge.find({ isActive: true });
      const newBadges = [];

      for (const badge of badges) {
        // Skip if user already has this badge
        if (user.badges.find(b => b.badge._id.toString() === badge._id.toString())) {
          continue;
        }

        const isEligible = await this.checkSingleBadgeEligibility(user, badge);
        if (isEligible) {
          const result = await this.awardBadge(userId, badge._id);
          if (result.success) {
            newBadges.push(result.badge);
          }
        }
      }

      return newBadges;
    } catch (error) {
      throw new Error(`Failed to check badge eligibility: ${error.message}`);
    }
  }

  async checkSingleBadgeEligibility(user, badge) {
    const { criteria } = badge;
    const now = new Date();

    switch (criteria.type) {
      case 'points':
        return user.ecoPoints >= criteria.value;

      case 'quizzes':
        const quizCount = await this.getUserActivityCount(user._id, 'quiz', criteria.timeframe);
        return quizCount >= criteria.value;

      case 'games':
        const gameCount = await this.getUserActivityCount(user._id, 'game', criteria.timeframe);
        return gameCount >= criteria.value;

      case 'experiments':
        const expCount = await this.getUserActivityCount(user._id, 'experiment', criteria.timeframe);
        return expCount >= criteria.value;

      case 'streak':
        return user.streaks.current >= criteria.value;

      default:
        return false;
    }
  }

  async getUserActivityCount(userId, type, timeframe) {
    const timeFilter = this.getTimeFilter(timeframe);
    
    switch (type) {
      case 'quiz':
        return await Quiz.countDocuments({
          'attempts.user': userId,
          'attempts.completedAt': timeFilter,
          'attempts.score.percentage': { $gte: 60 } // Only count passed quizzes
        });

      case 'game':
        return await Game.countDocuments({
          'attempts.user': userId,
          'attempts.completedAt': timeFilter
        });

      case 'experiment':
        return await Experiment.countDocuments({
          'submissions.user': userId,
          'submissions.submittedAt': timeFilter,
          'submissions.status': 'approved'
        });

      default:
        return 0;
    }
  }

  getTimeFilter(timeframe) {
    const now = new Date();
    switch (timeframe) {
      case 'daily':
        return { $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()) };
      case 'weekly':
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        return { $gte: weekStart };
      case 'monthly':
        return { $gte: new Date(now.getFullYear(), now.getMonth(), 1) };
      default:
        return {}; // all-time
    }
  }

  // Level Management
  async checkLevelUp(userId) {
    try {
      const user = await User.findById(userId);
      const levels = await Level.find().sort({ level: 1 });
      
      const currentLevel = levels.find(l => 
        user.ecoPoints >= l.minPoints && user.ecoPoints <= l.maxPoints
      );

      if (currentLevel && currentLevel.level > user.level) {
        user.level = currentLevel.level;
        user.levelHistory.push({
          level: currentLevel.level,
          achievedAt: new Date(),
          pointsAtAchievement: user.ecoPoints
        });

        // Award level-up points
        const levelUpPoints = currentLevel.level * 10;
        user.ecoPoints += levelUpPoints;
        user.pointsHistory.push({
          points: levelUpPoints,
          source: 'level_up',
          description: `Level up to ${currentLevel.name}`,
          earnedAt: new Date()
        });

        await user.save();

        return {
          levelUp: true,
          newLevel: currentLevel,
          bonusPoints: levelUpPoints
        };
      }

      return { levelUp: false };
    } catch (error) {
      throw new Error(`Failed to check level up: ${error.message}`);
    }
  }

  // Leaderboard Management
  async updateLeaderboards() {
    try {
      const leaderboardTypes = [
        { type: 'global', timeframe: 'weekly', category: 'points' },
        { type: 'global', timeframe: 'monthly', category: 'points' },
        { type: 'global', timeframe: 'all-time', category: 'points' },
        { type: 'school', timeframe: 'weekly', category: 'points' },
        { type: 'region', timeframe: 'weekly', category: 'points' }
      ];

      for (const config of leaderboardTypes) {
        await this.updateSingleLeaderboard(config);
      }
    } catch (error) {
      throw new Error(`Failed to update leaderboards: ${error.message}`);
    }
  }

  async updateSingleLeaderboard({ type, timeframe, category, scope = {} }) {
    try {
      const timeFilter = this.getTimeFilter(timeframe);
      let userFilter = {};

      // Apply scope filters
      if (type === 'school' && scope.schoolId) {
        userFilter.school = scope.schoolId;
      } else if (type === 'region' && scope.region) {
        userFilter.region = scope.region;
      }

      // Get user rankings based on category
      let users;
      if (category === 'points') {
        users = await User.find(userFilter)
          .select('firstName lastName avatar ecoPoints school region')
          .sort({ ecoPoints: -1 })
          .limit(100);
      }

      // Prepare rankings
      const rankings = users.map((user, index) => ({
        user: user._id,
        rank: index + 1,
        score: user.ecoPoints,
        change: 0 // Calculate change from previous ranking
      }));

      // Update or create leaderboard
      await Leaderboard.findOneAndUpdate(
        { type, timeframe, category, ...scope },
        {
          rankings,
          lastUpdated: new Date()
        },
        { upsert: true, new: true }
      );
    } catch (error) {
      throw new Error(`Failed to update leaderboard: ${error.message}`);
    }
  }

  // Certificate Generation
  async generateCertificate(userId, templateId, data = {}) {
    try {
      const user = await User.findById(userId);
      const template = await CertificateTemplate.findById(templateId);

      if (!user || !template) {
        throw new Error('User or template not found');
      }

      // Check if user meets requirements
      const meetsRequirements = await this.checkCertificateRequirements(user, template.requirements);
      if (!meetsRequirements) {
        throw new Error('User does not meet certificate requirements');
      }

      // Generate certificate HTML
      const certificateHtml = await this.renderCertificateTemplate(template, user, data);
      
      // Generate PDF using puppeteer
      const pdfBuffer = await this.generateCertificatePdf(certificateHtml);
      
      // Save certificate to user
      const certificate = {
        template: templateId,
        issuedAt: new Date(),
        data: {
          ...data,
          certificateId: `ECOKIDS-${Date.now()}-${user._id.toString().slice(-6).toUpperCase()}`
        },
        pdfUrl: null // Will be set after upload to cloud storage
      };

      user.certificates.push(certificate);
      await user.save();

      return {
        certificate,
        pdfBuffer,
        filename: `certificate-${certificate.data.certificateId}.pdf`
      };
    } catch (error) {
      throw new Error(`Failed to generate certificate: ${error.message}`);
    }
  }

  async checkCertificateRequirements(user, requirements) {
    if (requirements.minScore && user.averageQuizScore < requirements.minScore) {
      return false;
    }

    if (requirements.level && user.level < requirements.level) {
      return false;
    }

    if (requirements.badges && requirements.badges.length > 0) {
      const userBadgeNames = user.badges.map(b => b.badge.name);
      const hasAllBadges = requirements.badges.every(badge => userBadgeNames.includes(badge));
      if (!hasAllBadges) return false;
    }

    return true;
  }

  async renderCertificateTemplate(template, user, data) {
    let html = template.template;
    
    // Replace template variables
    const variables = {
      '{{userName}}': `${user.firstName} ${user.lastName}`,
      '{{userLevel}}': user.level,
      '{{ecoPoints}}': user.ecoPoints,
      '{{issueDate}}': new Date().toLocaleDateString('en-IN'),
      '{{certificateId}}': data.certificateId || 'TEMP-ID',
      ...data
    };

    Object.entries(variables).forEach(([key, value]) => {
      html = html.replace(new RegExp(key, 'g'), value);
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${template.style}</style>
      </head>
      <body>
        ${html}
      </body>
      </html>
    `;
  }

  async generateCertificatePdf(html) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        landscape: true,
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        }
      });

      return pdfBuffer;
    } finally {
      await browser.close();
    }
  }

  // Streak Management
  async updateUserStreak(userId) {
    try {
      const user = await User.findById(userId);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const lastActivity = user.streaks.lastActivity;
      
      if (!lastActivity) {
        // First activity
        user.streaks.current = 1;
        user.streaks.longest = Math.max(user.streaks.longest, 1);
        user.streaks.lastActivity = today;
      } else {
        const lastActivityDate = new Date(lastActivity);
        lastActivityDate.setHours(0, 0, 0, 0);

        if (lastActivityDate.getTime() === yesterday.getTime()) {
          // Consecutive day
          user.streaks.current += 1;
          user.streaks.longest = Math.max(user.streaks.longest, user.streaks.current);
          user.streaks.lastActivity = today;
        } else if (lastActivityDate.getTime() === today.getTime()) {
          // Same day, no change
          return user.streaks;
        } else {
          // Streak broken
          user.streaks.current = 1;
          user.streaks.lastActivity = today;
        }
      }

      await user.save();
      return user.streaks;
    } catch (error) {
      throw new Error(`Failed to update streak: ${error.message}`);
    }
  }

  // Points Management
  async awardPoints(userId, points, source, description, sourceId = null) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      user.ecoPoints += points;
      user.pointsHistory.push({
        points,
        source,
        sourceId,
        description,
        earnedAt: new Date()
      });

      await user.save();

      // Check for level up and new badges
      const levelResult = await this.checkLevelUp(userId);
      const newBadges = await this.checkBadgeEligibility(userId);

      return {
        pointsAwarded: points,
        totalPoints: user.ecoPoints,
        levelUp: levelResult.levelUp,
        newLevel: levelResult.newLevel,
        newBadges
      };
    } catch (error) {
      throw new Error(`Failed to award points: ${error.message}`);
    }
  }
}

module.exports = new GamificationService();