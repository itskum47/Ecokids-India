import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  FaTrophy, 
  FaMedal, 
  FaCrown, 
  FaFire,
  FaUsers,
  FaSchool,
  FaGlobe,
  FaMapMarkerAlt,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaFilter
} from 'react-icons/fa';
import { apiRequest } from '../utils/api';

const Leaderboard = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('global');
  const [selectedTimeframe, setSelectedTimeframe] = useState('weekly');
  const [selectedCategory, setSelectedCategory] = useState('points');

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedType, selectedTimeframe, selectedCategory]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(`/gamification/leaderboards?type=${selectedType}&timeframe=${selectedTimeframe}&category=${selectedCategory}`);
      setLeaderboardData(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 2: return 'text-gray-600 bg-gray-50 border-gray-200';
      case 3: return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-700 bg-white border-gray-200';
    }
  };

  const getChangeIcon = (change) => {
    if (change > 0) return <FaArrowUp className="text-green-500" />;
    if (change < 0) return <FaArrowDown className="text-red-500" />;
    return <FaMinus className="text-gray-400" />;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'global': return <FaGlobe className="text-blue-500" />;
      case 'school': return <FaSchool className="text-green-500" />;
      case 'region': return <FaMapMarkerAlt className="text-purple-500" />;
      default: return <FaUsers className="text-gray-500" />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'points': return <FaTrophy className="text-yellow-500" />;
      case 'quizzes': return <FaMedal className="text-blue-500" />;
      case 'games': return <FaFire className="text-red-500" />;
      case 'experiments': return <FaChartLine className="text-green-500" />;
      default: return <FaTrophy className="text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { leaderboard, userPosition } = leaderboardData || {};

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">🏆 Leaderboard</h1>
            <p className="text-xl text-blue-100">
              See how you rank against other eco-warriors across India!
            </p>
          </div>
        </div>

        {/* User Position Card */}
        {isAuthenticated && userPosition && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl">{getRankIcon(userPosition.rank)}</div>
                <div>
                  <h3 className="text-xl font-bold">Your Rank</h3>
                  <p className="text-green-100">
                    You're ranked #{userPosition.rank} in this leaderboard
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{userPosition.score}</div>
                <div className="text-sm text-green-100">
                  {selectedCategory === 'points' ? 'EcoPoints' : selectedCategory}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {getChangeIcon(userPosition.change)}
                  <span className="text-sm">
                    {userPosition.change > 0 ? `+${userPosition.change}` : userPosition.change}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FaFilter className="text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Filter Leaderboard</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scope
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="global">🌍 Global</option>
                <option value="school">🏫 School</option>
                <option value="region">📍 Region</option>
              </select>
            </div>

            {/* Timeframe Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Period
              </label>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="daily">📅 Today</option>
                <option value="weekly">📊 This Week</option>
                <option value="monthly">📈 This Month</option>
                <option value="all-time">🏆 All Time</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="points">🏆 EcoPoints</option>
                <option value="quizzes">📝 Quizzes</option>
                <option value="games">🎮 Games</option>
                <option value="experiments">🧪 Experiments</option>
              </select>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getTypeIcon(leaderboard?.type)}
                {getCategoryIcon(leaderboard?.category)}
                <h2 className="text-xl font-bold text-gray-800">
                  {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Leaderboard
                </h2>
              </div>
              <div className="text-sm text-gray-600">
                Last updated: {leaderboard?.lastUpdated ? 
                  new Date(leaderboard.lastUpdated).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {leaderboard?.rankings?.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No rankings available
                </h3>
                <p className="text-gray-500">
                  Be the first to appear on this leaderboard!
                </p>
              </div>
            ) : (
              leaderboard?.rankings?.map((ranking, index) => (
                <motion.div
                  key={ranking.user._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors
                    ${isAuthenticated && ranking.user._id === user?.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}
                  `}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className={`
                      w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold
                      ${getRankColor(ranking.rank)}
                    `}>
                      {ranking.rank <= 3 ? (
                        <span className="text-lg">{getRankIcon(ranking.rank)}</span>
                      ) : (
                        <span className="text-sm">{ranking.rank}</span>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {ranking.user.firstName?.[0]}{ranking.user.lastName?.[0]}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {ranking.user.firstName} {ranking.user.lastName}
                          {isAuthenticated && ranking.user._id === user?.id && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              You
                            </span>
                          )}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {ranking.user.school && (
                            <span>📚 {ranking.user.school}</span>
                          )}
                          {ranking.user.region && (
                            <span>📍 {ranking.user.region}</span>
                          )}
                          <span>⭐ Level {ranking.user.level}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Score and Change */}
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-800">
                      {ranking.score.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedCategory === 'points' ? 'EcoPoints' : selectedCategory}
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      {getChangeIcon(ranking.change)}
                      <span className="text-xs text-gray-500">
                        {ranking.change > 0 ? `+${ranking.change}` : ranking.change}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Call to Action */}
        {!isAuthenticated && (
          <div className="mt-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-8 text-white text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold mb-4">Join the Competition!</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Create your account to compete with students across India and climb the leaderboard!
            </p>
            <div className="flex gap-4 justify-center">
              <a 
                href="/register" 
                className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Sign Up Free
              </a>
              <a 
                href="/login" 
                className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
              >
                Login
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;