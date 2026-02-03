import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  FaSearch, 
  FaFilter, 
  FaClock, 
  FaQuestionCircle, 
  FaTrophy,
  FaStar,
  FaFire,
  FaGraduationCap,
  FaPlay,
  FaCheck,
  FaTimes,
  FaUsers,
  FaChartLine
} from 'react-icons/fa';
import { addToast } from '../store/slices/uiSlice';
import { apiRequest } from '../utils/api';

const QuizList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [topics, setTopics] = useState([]);
  const [featuredQuizzes, setFeaturedQuizzes] = useState([]);
  const [popularQuizzes, setPopularQuizzes] = useState([]);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalAttempts: 0,
    averageScore: 0,
    completedQuizzes: 0
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchQuizzes();
  }, [searchTerm, selectedTopic, selectedDifficulty, sortBy]);

  const fetchInitialData = async () => {
    try {
      const [topicsRes, featuredRes, popularRes, statsRes] = await Promise.all([
        apiRequest('/topics'),
        apiRequest('/quizzes/featured'),
        apiRequest('/quizzes/popular'),
        isAuthenticated ? apiRequest('/quizzes/my-stats') : Promise.resolve({ data: {} })
      ]);

      setTopics(topicsRes.data);
      setFeaturedQuizzes(featuredRes.data);
      setPopularQuizzes(popularRes.data);
      if (isAuthenticated) {
        setStats(statsRes.data);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedTopic) params.append('topic', selectedTopic);
      if (selectedDifficulty) params.append('difficulty', selectedDifficulty);
      if (sortBy) params.append('sort', sortBy);

      const response = await apiRequest(`/quizzes?${params.toString()}`);
      setQuizzes(response.data);
    } catch (error) {
      dispatch(addToast({
        type: 'error',
        message: 'Failed to load quizzes'
      }));
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const QuizCard = ({ quiz }) => {
    const userAttempt = quiz.userAttempts?.[0];
    const hasAttempted = Boolean(userAttempt);
    const bestScore = hasAttempted ? userAttempt.score?.percentage || 0 : null;
    const passed = bestScore >= quiz.scoring.passingScore;

    return (
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {quiz.thumbnail && (
          <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative">
            <img
              src={quiz.thumbnail}
              alt={quiz.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(quiz.difficulty)}`}>
                {quiz.difficulty}
              </span>
            </div>
            {hasAttempted && (
              <div className="absolute top-4 left-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  passed ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {passed ? (
                    <FaCheck className="text-white text-sm" />
                  ) : (
                    <FaTimes className="text-white text-sm" />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-blue-600 font-medium">
              {quiz.topic?.name || 'General'}
            </span>
            {quiz.featured && (
              <div className="flex items-center text-yellow-500">
                <FaStar className="text-sm" />
                <span className="text-xs ml-1">Featured</span>
              </div>
            )}
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
            {quiz.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {quiz.description}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <FaQuestionCircle />
                <span>{quiz.questions.length} questions</span>
              </div>
              <div className="flex items-center gap-1">
                <FaClock />
                <span>{quiz.timeLimit} min</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <FaUsers />
              <span>{quiz.totalAttempts || 0} attempts</span>
            </div>
          </div>

          {/* Quiz Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-lg font-bold text-purple-600">
                {quiz.scoring.maxPoints}
              </div>
              <div className="text-xs text-gray-600">Max Points</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-lg font-bold text-blue-600">
                {quiz.scoring.passingScore}%
              </div>
              <div className="text-xs text-gray-600">To Pass</div>
            </div>
          </div>

          {/* User's Best Score */}
          {hasAttempted && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Your Best Score:</span>
                <span className={`font-bold ${getScoreColor(bestScore)}`}>
                  {bestScore}%
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                <span>Attempts: {quiz.userAttempts.length}</span>
                {userAttempt.ecoPointsEarned && (
                  <span>+{userAttempt.ecoPointsEarned} EcoPoints</span>
                )}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="flex gap-3">
            <Link
              to={`/quiz/${quiz.slug}`}
              className="flex-1 btn btn-primary text-center"
            >
              <FaPlay className="mr-2" />
              {hasAttempted ? 'Retake Quiz' : 'Start Quiz'}
            </Link>
            
            <Link
              to={`/quiz/${quiz.slug}/preview`}
              className="btn btn-outline"
            >
              Preview
            </Link>
          </div>

          {/* Quiz Features */}
          <div className="mt-3 flex flex-wrap gap-2">
            {quiz.features.instantFeedback && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Instant Feedback
              </span>
            )}
            {quiz.features.showHints && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                Hints Available
              </span>
            )}
            {quiz.features.certificateEnabled && (
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                Certificate
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Test Your Eco Knowledge</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Challenge yourself with interactive quizzes and earn EcoPoints while learning about environmental science
            </p>
          </div>

          {/* User Stats */}
          {isAuthenticated && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{stats.completedQuizzes}</div>
                <div className="text-sm text-blue-200">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{stats.totalAttempts}</div>
                <div className="text-sm text-blue-200">Total Attempts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{stats.averageScore}%</div>
                <div className="text-sm text-blue-200">Average Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{user?.ecoPoints || 0}</div>
                <div className="text-sm text-blue-200">EcoPoints</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Featured Quizzes */}
        {featuredQuizzes.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <FaStar className="text-yellow-500 text-xl" />
              <h2 className="text-2xl font-bold text-gray-800">Featured Quizzes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredQuizzes.slice(0, 3).map(quiz => (
                <QuizCard key={quiz._id} quiz={quiz} />
              ))}
            </div>
          </section>
        )}

        {/* Popular Quizzes */}
        {popularQuizzes.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <FaFire className="text-orange-500 text-xl" />
              <h2 className="text-2xl font-bold text-gray-800">Popular This Week</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularQuizzes.slice(0, 3).map(quiz => (
                <QuizCard key={quiz._id} quiz={quiz} />
              ))}
            </div>
          </section>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search quizzes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Topic Filter */}
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Topics</option>
              {topics.map(topic => (
                <option key={topic._id} value={topic._id}>
                  {topic.name}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="featured">Featured First</option>
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="difficulty">By Difficulty</option>
              <option value="duration">By Duration</option>
            </select>
          </div>
        </div>

        {/* Quiz Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              All Quizzes ({quizzes.length})
            </h2>
            
            {!isAuthenticated && (
              <div className="text-sm text-gray-600">
                <Link to="/login" className="text-blue-600 hover:underline">
                  Login
                </Link> to track your progress
              </div>
            )}
          </div>

          {quizzes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No quizzes found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters or search terms
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map(quiz => (
                <QuizCard key={quiz._id} quiz={quiz} />
              ))}
            </div>
          )}
        </section>

        {/* Call to Action */}
        {!isAuthenticated && (
          <div className="mt-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-8 text-white text-center">
            <div className="text-4xl mb-4">🌱</div>
            <h2 className="text-2xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Join EcoKids India to track your progress, earn EcoPoints, and compete with friends!
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/register" className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Sign Up Free
              </Link>
              <Link to="/login" className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizList;