import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import { 
  FaSearch, 
  FaFilter, 
  FaClock, 
  FaUsers, 
  FaEye, 
  FaStar,
  FaFlask,
  FaLeaf,
  FaDropletSlash,
  FaMicroscope,
  FaSeedling,
  FaWind,
  FaRecycle,
  FaThermometerHalf,
  FaBug
} from 'react-icons/fa';
import { experimentsAPI } from '../utils/api';

// Mock experiments data
const getMockExperiments = () => [
  {
    _id: '1',
    title: 'Water Quality Testing',
    slug: 'water-quality-testing',
    description: 'Learn how to test water quality using simple household items and understand pH levels, pollutants, and filtration methods.',
    category: 'water-testing',
    difficulty: 'medium',
    gradeLevel: ['4-6', '7-9'],
    estimatedTime: 45,
    multimedia: {
      featuredImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop'
    },
    metrics: {
      views: 1250,
      averageRating: 4.5
    }
  },
  {
    _id: '2',
    title: 'Air Quality Monitor',
    slug: 'air-quality-monitor',
    description: 'Build your own air quality monitoring device to measure pollution levels in your neighborhood.',
    category: 'air-quality',
    difficulty: 'hard',
    gradeLevel: ['7-9', '10-12'],
    estimatedTime: 60,
    multimedia: {
      featuredImage: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=250&fit=crop'
    },
    metrics: {
      views: 890,
      averageRating: 4.2
    }
  },
  {
    _id: '3',
    title: 'Soil pH Testing',
    slug: 'soil-ph-testing',
    description: 'Discover how to test soil acidity and alkalinity to understand what plants can grow in different conditions.',
    category: 'soil-analysis',
    difficulty: 'easy',
    gradeLevel: ['1-3', '4-6'],
    estimatedTime: 30,
    multimedia: {
      featuredImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop'
    },
    metrics: {
      views: 2100,
      averageRating: 4.8
    }
  },
  {
    _id: '4',
    title: 'Solar Oven Construction',
    slug: 'solar-oven-construction',
    description: 'Build a solar oven using cardboard and aluminum foil to cook food using renewable energy.',
    category: 'renewable-energy',
    difficulty: 'medium',
    gradeLevel: ['4-6', '7-9'],
    estimatedTime: 90,
    multimedia: {
      featuredImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=250&fit=crop'
    },
    metrics: {
      views: 1750,
      averageRating: 4.6
    }
  },
  {
    _id: '5',
    title: 'Plastic Degradation Study',
    slug: 'plastic-degradation-study',
    description: 'Investigate how different types of plastic break down in various environmental conditions.',
    category: 'waste-recycling',
    difficulty: 'medium',
    gradeLevel: ['7-9', '10-12'],
    estimatedTime: 120,
    multimedia: {
      featuredImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=250&fit=crop'
    },
    metrics: {
      views: 950,
      averageRating: 4.3
    }
  },
  {
    _id: '6',
    title: 'Weather Station Setup',
    slug: 'weather-station-setup',
    description: 'Create your own weather monitoring station to track temperature, humidity, and precipitation.',
    category: 'weather-climate',
    difficulty: 'hard',
    gradeLevel: ['7-9', '10-12'],
    estimatedTime: 75,
    multimedia: {
      featuredImage: 'https://images.unsplash.com/photo-1569163139394-de44cb5894ab?w=400&h=250&fit=crop'
    },
    metrics: {
      views: 1400,
      averageRating: 4.4
    }
  },
  {
    _id: '7',
    title: 'Biodiversity Survey',
    slug: 'biodiversity-survey',
    description: 'Learn how to conduct a biodiversity survey in your local area to count and identify different species.',
    category: 'biodiversity',
    difficulty: 'easy',
    gradeLevel: ['1-3', '4-6'],
    estimatedTime: 50,
    multimedia: {
      featuredImage: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400&h=250&fit=crop'
    },
    metrics: {
      views: 1680,
      averageRating: 4.7
    }
  },
  {
    _id: '8',
    title: 'Plant Growth Experiment',
    slug: 'plant-growth-experiment',
    description: 'Study how different environmental factors affect plant growth including light, water, and nutrients.',
    category: 'plant-biology',
    difficulty: 'easy',
    gradeLevel: ['1-3', '4-6'],
    estimatedTime: 40,
    multimedia: {
      featuredImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop'
    },
    metrics: {
      views: 2850,
      averageRating: 4.9
    }
  }
];

const ExperimentsPage = () => {
  console.log('ExperimentsPage rendering...');
  const [experiments, setExperiments] = useState(getMockExperiments());
  const [featuredExperiments, setFeaturedExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    gradeLevel: '',
    sort: '-publishedAt'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: getMockExperiments().length,
    pages: 1
  });

  const categories = [
    { id: 'air-quality', name: 'Air Quality', icon: FaWind, color: 'text-blue-500' },
    { id: 'water-testing', name: 'Water Testing', icon: FaDropletSlash, color: 'text-cyan-500' },
    { id: 'soil-analysis', name: 'Soil Analysis', icon: FaLeaf, color: 'text-green-500' },
    { id: 'plant-biology', name: 'Plant Biology', icon: FaSeedling, color: 'text-green-600' },
    { id: 'renewable-energy', name: 'Renewable Energy', icon: FaFlask, color: 'text-yellow-500' },
    { id: 'waste-recycling', name: 'Waste & Recycling', icon: FaRecycle, color: 'text-purple-500' },
    { id: 'weather-climate', name: 'Weather & Climate', icon: FaThermometerHalf, color: 'text-orange-500' },
    { id: 'biodiversity', name: 'Biodiversity', icon: FaBug, color: 'text-pink-500' }
  ];

  const difficultyLevels = [
    { id: 'easy', name: 'Easy', color: 'text-green-600 bg-green-100' },
    { id: 'medium', name: 'Medium', color: 'text-yellow-600 bg-yellow-100' },
    { id: 'hard', name: 'Hard', color: 'text-red-600 bg-red-100' }
  ];

  const gradeLevels = [
    { id: '1-3', name: 'Grades 1-3' },
    { id: '4-6', name: 'Grades 4-6' },
    { id: '7-9', name: 'Grades 7-9' },
    { id: '10-12', name: 'Grades 10-12' }
  ];

  useEffect(() => {
    fetchFeaturedExperiments();
  }, []);

  useEffect(() => {
    fetchExperiments();
  }, [filters, pagination.page, searchTerm]);

  const fetchFeaturedExperiments = async () => {
    try {
      const response = await experimentsAPI.getPopularExperiments(6);
      setFeaturedExperiments(response.data || []);
    } catch (error) {
      console.error('Error fetching featured experiments:', error);
      // Set some mock data for now since the API might not be ready
      setFeaturedExperiments([]);
    }
  };

  const fetchExperiments = async () => {
    try {
      setLoading(true);
      const queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
        ...(searchTerm && { search: searchTerm })
      };

      const response = await experimentsAPI.getExperiments(queryParams);
      setExperiments(response.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.total || 0,
        pages: response.pages || 1
      }));
    } catch (error) {
      console.error('Failed to load experiments:', error);
      // Set some mock experiments for now
      setExperiments(getMockExperiments());
      setPagination(prev => ({
        ...prev,
        total: 8,
        pages: 1
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchExperiments();
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      difficulty: '',
      gradeLevel: '',
      sort: '-publishedAt'
    });
    setSearchTerm('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const getDifficultyColor = (difficulty) => {
    const level = difficultyLevels.find(d => d.id === difficulty);
    return level ? level.color : 'text-gray-600 bg-gray-100';
  };

  const getCategoryInfo = (categoryId) => {
    return categories.find(cat => cat.id === categoryId) || {
      name: categoryId,
      icon: FaFlask,
      color: 'text-gray-500'
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl lg:text-5xl font-bold mb-4"
            >
              🧪 Environmental Experiments
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl lg:text-2xl text-white/90 mb-8"
            >
              Hands-on learning experiences to explore our environment
            </motion.p>
            
            {/* Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSearch}
              className="max-w-2xl mx-auto flex gap-4"
            >
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search experiments..."
                  className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-800 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                />
              </div>
              <button type="submit" className="px-6 py-3 bg-white text-blue-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">
                Search
              </button>
            </motion.form>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Featured Experiments */}
        {featuredExperiments.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">⭐ Featured Experiments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredExperiments.map((experiment, index) => (
                <motion.div
                  key={experiment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ExperimentCard experiment={experiment} featured />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🔬 Experiment Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleFilterChange('category', 
                  filters.category === category.id ? '' : category.id
                )}
                className={`
                  p-4 rounded-xl text-center transition-all duration-200
                  ${filters.category === category.id
                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                    : 'bg-white hover:bg-gray-50 shadow-md hover:shadow-lg'
                  }
                `}
              >
                <category.icon className={`
                  text-2xl mx-auto mb-2
                  ${filters.category === category.id ? 'text-white' : category.color}
                `} />
                <div className="text-xs font-medium">{category.name}</div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Filters and Results */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear All
                </button>
              </div>

              {/* Difficulty Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Levels</option>
                  {difficultyLevels.map(level => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grade Level Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade Level
                </label>
                <select
                  value={filters.gradeLevel}
                  onChange={(e) => handleFilterChange('gradeLevel', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Grades</option>
                  {gradeLevels.map(grade => (
                    <option key={grade.id} value={grade.id}>
                      {grade.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="-publishedAt">Newest First</option>
                  <option value="publishedAt">Oldest First</option>
                  <option value="-metrics.views">Most Popular</option>
                  <option value="-metrics.averageRating">Highest Rated</option>
                  <option value="estimatedTime">Shortest First</option>
                  <option value="-estimatedTime">Longest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Experiments Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {filters.category && (
                    <>
                      {getCategoryInfo(filters.category).name} 
                      <span className="text-gray-500"> • </span>
                    </>
                  )}
                  {pagination.total} Experiments
                </h2>
                {searchTerm && (
                  <p className="text-gray-600 mt-1">
                    Search results for "{searchTerm}"
                  </p>
                )}
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : experiments.length === 0 ? (
              /* No Results */
              <div className="text-center py-12">
                <FaMicroscope className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No experiments found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              /* Experiments Grid */
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {experiments.map((experiment, index) => (
                    <motion.div
                      key={experiment._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ExperimentCard experiment={experiment} />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPagination(prev => ({ 
                          ...prev, 
                          page: Math.max(1, prev.page - 1) 
                        }))}
                        disabled={pagination.page === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                        .filter(page => 
                          page === 1 || 
                          page === pagination.pages || 
                          Math.abs(page - pagination.page) <= 2
                        )
                        .map(page => (
                          <button
                            key={page}
                            onClick={() => setPagination(prev => ({ ...prev, page }))}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                              page === pagination.page ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      
                      <button
                        onClick={() => setPagination(prev => ({ 
                          ...prev, 
                          page: Math.min(pagination.pages, prev.page + 1) 
                        }))}
                        disabled={pagination.page === pagination.pages}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Experiment Card Component
const ExperimentCard = ({ experiment, featured = false }) => {
  const categoryInfo = getCategoryInfo(experiment.category);

  return (
    <Link to={`/experiments/${experiment.slug}`}>
      <div className={`
        bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300
        ${featured ? 'ring-2 ring-yellow-400' : ''}
      `}>
        {/* Image */}
        <div className="relative h-48">
          {experiment.multimedia?.featuredImage ? (
            <img
              src={experiment.multimedia.featuredImage}
              alt={experiment.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
              <categoryInfo.icon className="text-6xl text-white" />
            </div>
          )}
          
          {featured && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
              Featured
            </div>
          )}
          
          <div className="absolute bottom-2 left-2">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(experiment.difficulty)}`}>
              {experiment.difficulty}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <categoryInfo.icon className={`${categoryInfo.color}`} />
            <span className="text-sm text-gray-600">{categoryInfo.name}</span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {experiment.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {experiment.description}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <FaClock />
              <span>{experiment.estimatedTime} min</span>
            </div>
            
            <div className="flex items-center gap-1">
              <FaUsers />
              <span>Grades {experiment.gradeLevel?.join(', ')}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <FaEye />
              <span>{experiment.metrics?.views || 0}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-500" />
              <span>{(experiment.metrics?.averageRating || 0).toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Helper function to get category info
const getCategoryInfo = (categoryId) => {
  const categories = [
    { id: 'air-quality', name: 'Air Quality', icon: FaWind, color: 'text-blue-500' },
    { id: 'water-testing', name: 'Water Testing', icon: FaDropletSlash, color: 'text-cyan-500' },
    { id: 'soil-analysis', name: 'Soil Analysis', icon: FaLeaf, color: 'text-green-500' },
    { id: 'plant-biology', name: 'Plant Biology', icon: FaSeedling, color: 'text-green-600' },
    { id: 'renewable-energy', name: 'Renewable Energy', icon: FaFlask, color: 'text-yellow-500' },
    { id: 'waste-recycling', name: 'Waste & Recycling', icon: FaRecycle, color: 'text-purple-500' },
    { id: 'weather-climate', name: 'Weather & Climate', icon: FaThermometerHalf, color: 'text-orange-500' },
    { id: 'biodiversity', name: 'Biodiversity', icon: FaBug, color: 'text-pink-500' }
  ];
  
  return categories.find(cat => cat.id === categoryId) || {
    name: categoryId,
    icon: FaFlask,
    color: 'text-gray-500'
  };
};

// Helper function to get difficulty color
const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'easy': return 'text-green-600 bg-green-100';
    case 'medium': return 'text-yellow-600 bg-yellow-100';
    case 'hard': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export default ExperimentsPage;