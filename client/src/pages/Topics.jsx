import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  FaLeaf, 
  FaWater, 
  FaRecycle, 
  FaSun,
  FaTree,
  FaFish,
  FaCloud,
  FaMountain,
  FaSearch,
  FaFilter,
  FaBookOpen,
  FaPlay,
  FaLock,
  FaCheckCircle,
  FaClock,
  FaStar
} from 'react-icons/fa';
import { apiRequest } from '../utils/api';

const Topics = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [filteredTopics, setFilteredTopics] = useState([]);

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    filterTopics();
  }, [topics, searchTerm, selectedCategory, selectedLevel]);

  const fetchTopics = async () => {
    try {
      const response = await apiRequest('/topics');
      setTopics(response.data);
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTopics = () => {
    let filtered = topics;

    if (searchTerm) {
      filtered = filtered.filter(topic =>
        topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(topic => topic.category === selectedCategory);
    }

    if (selectedLevel) {
      filtered = filtered.filter(topic => topic.level === selectedLevel);
    }

    setFilteredTopics(filtered);
  };

  const getTopicIcon = (category) => {
    const iconMap = {
      'water': FaWater,
      'air': FaCloud,
      'forest': FaTree,
      'wildlife': FaFish,
      'energy': FaSun,
      'waste': FaRecycle,
      'climate': FaMountain,
      'plants': FaLeaf
    };
    return iconMap[category] || FaLeaf;
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      'water': 'from-blue-400 to-blue-600',
      'air': 'from-sky-400 to-sky-600',
      'forest': 'from-green-400 to-green-600',
      'wildlife': 'from-orange-400 to-orange-600',
      'energy': 'from-yellow-400 to-yellow-600',
      'waste': 'from-purple-400 to-purple-600',
      'climate': 'from-indigo-400 to-indigo-600',
      'plants': 'from-emerald-400 to-emerald-600'
    };
    return colorMap[category] || 'from-green-400 to-green-600';
  };

  const getLevelColor = (level) => {
    const colorMap = {
      'beginner': 'bg-green-100 text-green-800',
      'intermediate': 'bg-yellow-100 text-yellow-800',
      'advanced': 'bg-red-100 text-red-800'
    };
    return colorMap[level] || 'bg-gray-100 text-gray-800';
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const TopicCard = ({ topic, index }) => {
    const IconComponent = getTopicIcon(topic.category);
    const isLocked = topic.prerequisites && !topic.prerequisitesMet;
    const progress = topic.userProgress?.completionPercentage || 0;
    const isCompleted = progress >= 100;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -5 }}
        className={`relative bg-white rounded-2xl shadow-lg overflow-hidden group ${
          isLocked ? 'opacity-75' : ''
        }`}
      >
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(topic.category)} opacity-10`} />
        
        {/* Lock Overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <FaLock className="text-2xl text-gray-600" />
            </div>
          </div>
        )}

        {/* Completion Badge */}
        {isCompleted && (
          <div className="absolute top-4 right-4 z-20">
            <div className="bg-green-500 text-white rounded-full p-2 shadow-lg">
              <FaCheckCircle className="text-lg" />
            </div>
          </div>
        )}

        <div className="relative p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className={`p-4 rounded-full bg-gradient-to-br ${getCategoryColor(topic.category)} text-white shadow-lg`}>
              <IconComponent className="text-2xl" />
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(topic.level)}`}>
                {topic.level}
              </span>
            </div>
          </div>

          {/* Content */}
          <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
            {topic.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-6 line-clamp-3">
            {topic.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6 text-center">
            <div>
              <div className="text-lg font-bold text-gray-800">{topic.contentCount?.quizzes || 0}</div>
              <div className="text-xs text-gray-500">Quizzes</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-800">{topic.contentCount?.games || 0}</div>
              <div className="text-xs text-gray-500">Games</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-800">{topic.contentCount?.experiments || 0}</div>
              <div className="text-xs text-gray-500">Experiments</div>
            </div>
          </div>

          {/* Progress Bar */}
          {isAuthenticated && !isLocked && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Prerequisites */}
          {topic.prerequisites && topic.prerequisites.length > 0 && (
            <div className="mb-6">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Prerequisites:</h5>
              <div className="flex flex-wrap gap-2">
                {topic.prerequisites.slice(0, 2).map((prereq, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {prereq.name}
                  </span>
                ))}
                {topic.prerequisites.length > 2 && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    +{topic.prerequisites.length - 2} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Button */}
          <Link
            to={isLocked ? '#' : `/topics/${topic.slug}`}
            className={`w-full btn transition-all duration-300 ${
              isLocked 
                ? 'btn-disabled cursor-not-allowed' 
                : isCompleted 
                  ? 'btn-success' 
                  : 'btn-primary'
            }`}
            onClick={(e) => isLocked && e.preventDefault()}
          >
            {isLocked ? (
              <>
                <FaLock className="mr-2" />
                Locked
              </>
            ) : isCompleted ? (
              <>
                <FaCheckCircle className="mr-2" />
                Review Topic
              </>
            ) : (
              <>
                <FaPlay className="mr-2" />
                Start Learning
              </>
            )}
          </Link>

          {/* Estimated Time */}
          <div className="flex items-center justify-center mt-3 text-xs text-gray-500">
            <FaClock className="mr-1" />
            ~{topic.estimatedTime || 30} minutes
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
      <section className="bg-gradient-to-r from-green-500 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-6xl mb-6">📚</div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Explore Environmental Topics
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Dive deep into fascinating environmental topics designed specifically for Indian students. 
              From local ecosystems to global climate challenges.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option value="water">💧 Water</option>
              <option value="air">☁️ Air Quality</option>
              <option value="forest">🌳 Forests</option>
              <option value="wildlife">🐅 Wildlife</option>
              <option value="energy">☀️ Energy</option>
              <option value="waste">♻️ Waste Management</option>
              <option value="climate">🌡️ Climate</option>
              <option value="plants">🌱 Plants</option>
            </select>

            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Levels</option>
              <option value="beginner">🌱 Beginner</option>
              <option value="intermediate">🌿 Intermediate</option>
              <option value="advanced">🌳 Advanced</option>
            </select>

            {/* Sort */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaFilter />
              <span>{filteredTopics.length} topics found</span>
            </div>
          </div>
        </motion.div>

        {/* Topics Grid */}
        {filteredTopics.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-4">No topics found</h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedLevel('');
              }}
              className="btn btn-primary"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTopics.map((topic, index) => (
              <TopicCard key={topic._id} topic={topic} index={index} />
            ))}
          </div>
        )}

        {/* Learning Path Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-12 text-white text-center"
        >
          <div className="text-6xl mb-6">🎯</div>
          <h2 className="text-3xl font-bold mb-6">
            Follow Your Learning Path
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-purple-100">
            Our topics are carefully sequenced to build your understanding step by step. 
            Complete prerequisites to unlock advanced topics!
          </p>
          
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                Start Your Journey
              </Link>
              <Link
                to="/login"
                className="border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}
        </motion.div>

        {/* Featured Topics */}
        {topics.filter(t => t.featured).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-20"
          >
            <div className="flex items-center gap-3 mb-8">
              <FaStar className="text-yellow-500 text-2xl" />
              <h2 className="text-3xl font-bold text-gray-800">Featured Topics</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topics
                .filter(topic => topic.featured)
                .slice(0, 3)
                .map((topic, index) => (
                  <TopicCard key={`featured-${topic._id}`} topic={topic} index={index} />
                ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Topics;