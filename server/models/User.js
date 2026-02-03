const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  },
  profile: {
    avatar: {
      type: String,
      default: null
    },
    dateOfBirth: {
      type: Date
    },
    grade: {
      type: String,
      enum: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    },
    school: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    language: {
      type: String,
      enum: ['english', 'hindi', 'bengali', 'tamil', 'telugu', 'marathi'],
      default: 'english'
    },
    bio: {
      type: String,
      maxlength: [200, 'Bio cannot be more than 200 characters']
    }
  },
  gamification: {
    ecoPoints: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    },
    badges: [{
      badgeId: String,
      name: String,
      earnedAt: {
        type: Date,
        default: Date.now
      }
    }],
    streak: {
      current: {
        type: Number,
        default: 0
      },
      longest: {
        type: Number,
        default: 0
      },
      lastActivity: Date
    }
  },
  progress: {
    topicsCompleted: [{
      topicId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Topic'
      },
      completedAt: {
        type: Date,
        default: Date.now
      },
      score: Number
    }],
    gamesPlayed: [{
      gameId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Game'
      },
      highScore: Number,
      timesPlayed: {
        type: Number,
        default: 1
      },
      lastPlayed: {
        type: Date,
        default: Date.now
      }
    }],
    experimentsCompleted: [{
      experimentId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Experiment'
      },
      completedAt: {
        type: Date,
        default: Date.now
      },
      photos: [String],
      notes: String
    }],
    quizzesTaken: [{
      quizId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Quiz'
      },
      score: Number,
      totalQuestions: Number,
      takenAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  settings: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      achievements: {
        type: Boolean,
        default: true
      },
      reminders: {
        type: Boolean,
        default: true
      }
    },
    privacy: {
      showProfile: {
        type: Boolean,
        default: true
      },
      showProgress: {
        type: Boolean,
        default: true
      }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for user's age
UserSchema.virtual('age').get(function() {
  if (!this.profile.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.profile.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Virtual for current level info
UserSchema.virtual('levelInfo').get(function() {
  const points = this.gamification.ecoPoints;
  const level = Math.floor(points / 100) + 1;
  const pointsForCurrentLevel = (level - 1) * 100;
  const pointsForNextLevel = level * 100;
  const progressToNextLevel = ((points - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel)) * 100;
  
  return {
    currentLevel: level,
    pointsForCurrentLevel,
    pointsForNextLevel,
    progressToNextLevel: Math.round(progressToNextLevel)
  };
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Add EcoPoints and update level
UserSchema.methods.addEcoPoints = function(points) {
  this.gamification.ecoPoints += points;
  this.gamification.level = Math.floor(this.gamification.ecoPoints / 100) + 1;
  return this.save();
};

// Award badge
UserSchema.methods.awardBadge = function(badgeId, badgeName) {
  const existingBadge = this.gamification.badges.find(badge => badge.badgeId === badgeId);
  if (!existingBadge) {
    this.gamification.badges.push({
      badgeId,
      name: badgeName,
      earnedAt: new Date()
    });
    return this.save();
  }
  return Promise.resolve(this);
};

// Update streak
UserSchema.methods.updateStreak = function() {
  const today = new Date();
  const lastActivity = this.gamification.streak.lastActivity;
  
  if (!lastActivity) {
    // First activity
    this.gamification.streak.current = 1;
    this.gamification.streak.longest = 1;
  } else {
    const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      // Consecutive day
      this.gamification.streak.current += 1;
      if (this.gamification.streak.current > this.gamification.streak.longest) {
        this.gamification.streak.longest = this.gamification.streak.current;
      }
    } else if (daysDiff > 1) {
      // Streak broken
      this.gamification.streak.current = 1;
    }
    // If daysDiff === 0, same day, no change needed
  }
  
  this.gamification.streak.lastActivity = today;
  return this.save();
};

module.exports = mongoose.model('User', UserSchema);