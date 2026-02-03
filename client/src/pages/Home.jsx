import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  FaPlay, 
  FaGamepad, 
  FaFlask, 
  FaQuestionCircle,
  FaTrophy,
  FaUsers,
  FaLeaf,
  FaGlobe,
  FaChartLine,
  FaStar,
  FaArrowRight,
  FaBookOpen,
  FaCertificate
} from 'react-icons/fa';
import { apiRequest } from '../utils/api';
import LanguageSwitcher from '../components/common/LanguageSwitcher';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuizzes: 0,
    totalGames: 0,
    totalExperiments: 0
  });
  const [featuredContent, setFeaturedContent] = useState({
    quizzes: [],
    games: [],
    experiments: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [statsRes, quizzesRes, gamesRes, experimentsRes] = await Promise.all([
        apiRequest('/admin/stats').catch(() => ({ data: stats })),
        apiRequest('/quizzes/featured').catch(() => ({ data: [] })),
        apiRequest('/games?featured=true&limit=3').catch(() => ({ data: [] })),
        apiRequest('/experiments?featured=true&limit=3').catch(() => ({ data: [] }))
      ]);

      setStats(statsRes.data);
      setFeaturedContent({
        quizzes: quizzesRes.data.slice(0, 3),
        games: gamesRes.data.slice(0, 3),
        experiments: experimentsRes.data.slice(0, 3)
      });
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const heroVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    },
    hover: { 
      y: -10,
      transition: { duration: 0.3 }
    }
  };

  const FeatureCard = ({ icon: Icon, title, description, link, color, delay = 0 }) => (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{ delay }}
      className="group"
    >
      <Link to={link} className="block">
        <div className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 ${color}`}>
          <div className="flex items-center justify-between mb-6">
            <div className={`p-4 rounded-full ${color.replace('border-', 'bg-').replace('-500', '-100')}`}>
              <Icon className={`text-2xl ${color.replace('border-', 'text-')}`} />
            </div>
            <FaArrowRight className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
      </Link>
    </motion.div>
  );

  const StatCard = ({ icon: Icon, value, label, color }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="text-center p-6"
    >
      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${color} mb-4`}>
        <Icon className="text-2xl text-white" />
      </div>
      <div className="text-3xl font-bold text-white mb-2">{value.toLocaleString()}</div>
      <div className="text-blue-100">{label}</div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-32">
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="text-center text-white"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-block text-8xl mb-8"
            >
              🌍
            </motion.div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              {t('home.hero.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="bg-white text-green-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg flex items-center gap-2"
                >
                  <FaPlay />
                  Continue Learning
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-white text-green-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                  >
                    {t('home.hero.getStarted')}
                  </Link>
                  <Link
                    to="/login"
                    className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
                  >
                    {t('auth.login.signInButton')}
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-bounce">
          <div className="text-4xl">🌱</div>
        </div>
        <div className="absolute bottom-20 right-10 animate-pulse">
          <div className="text-4xl">🦋</div>
        </div>
        <div className="absolute top-1/2 left-20 animate-bounce" style={{ animationDelay: '1s' }}>
          <div className="text-3xl">🌸</div>
        </div>
      </section>

      {/* Platform Stats */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard
              icon={FaUsers}
              value={stats.totalUsers}
              label="Eco Warriors"
              color="bg-green-500"
            />
            <StatCard
              icon={FaQuestionCircle}
              value={stats.totalQuizzes}
              label="Quizzes"
              color="bg-blue-500"
            />
            <StatCard
              icon={FaGamepad}
              value={stats.totalGames}
              label="Games"
              color="bg-purple-500"
            />
            <StatCard
              icon={FaFlask}
              value={stats.totalExperiments}
              label="Experiments"
              color="bg-orange-500"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Learn Through Play & Discovery
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge educational technology with Indian environmental contexts 
              to create an immersive learning experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={FaGamepad}
              title="Interactive Games"
              description="Play engaging games that teach environmental concepts through fun challenges and adventures."
              link="/games"
              color="border-green-500"
              delay={0.1}
            />
            <FeatureCard
              icon={FaFlask}
              title="Hands-on Experiments"
              description="Conduct real experiments with step-by-step guidance and safety instructions."
              link="/experiments"
              color="border-blue-500"
              delay={0.2}
            />
            <FeatureCard
              icon={FaQuestionCircle}
              title="Smart Quizzes"
              description="Test your knowledge with adaptive quizzes that provide instant feedback and explanations."
              link="/quizzes"
              color="border-purple-500"
              delay={0.3}
            />
            <FeatureCard
              icon={FaTrophy}
              title="Earn Rewards"
              description="Collect EcoPoints, unlock badges, and climb leaderboards as you learn and grow."
              link="/leaderboard"
              color="border-orange-500"
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Featured Content */}
      {!loading && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
                Start Learning Today
              </h2>
              <p className="text-xl text-gray-600">
                Explore our most popular content and join thousands of students on their eco-journey.
              </p>
            </motion.div>

            {/* Featured Quizzes */}
            {featuredContent.quizzes.length > 0 && (
              <div className="mb-16">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <FaStar className="text-yellow-500" />
                    Featured Quizzes
                  </h3>
                  <Link to="/quizzes" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
                    View All <FaArrowRight />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredContent.quizzes.map((quiz, index) => (
                    <motion.div
                      key={quiz._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-xl shadow-lg overflow-hidden"
                    >
                      <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        <div className="text-6xl">📝</div>
                      </div>
                      <div className="p-6">
                        <h4 className="text-lg font-bold text-gray-800 mb-2">{quiz.title}</h4>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{quiz.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <span>{quiz.questions?.length || 0} questions</span>
                          <span>{quiz.timeLimit} min</span>
                        </div>
                        <Link
                          to={`/quiz/${quiz.slug}`}
                          className="w-full btn btn-primary"
                        >
                          Take Quiz
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl p-12 text-center text-white"
            >
              <div className="text-6xl mb-6">🚀</div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Ready to Become an Eco Champion?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Join our community of young environmental scientists and start making a difference today!
              </p>
              
              {!isAuthenticated && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/register"
                    className="bg-white text-green-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                  >
                    Join Free Today
                  </Link>
                  <Link
                    to="/about"
                    className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
                  >
                    Learn More
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Why Choose EcoKids India?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <FaGlobe className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Indian Context</h3>
                    <p className="text-gray-600">
                      All content is tailored to Indian environmental challenges and solutions.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaChartLine className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Progress Tracking</h3>
                    <p className="text-gray-600">
                      Monitor your learning journey with detailed analytics and achievements.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <FaCertificate className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Certificates & Badges</h3>
                    <p className="text-gray-600">
                      Earn recognized certificates and showcase your environmental knowledge.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <FaBookOpen className="text-orange-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Curriculum Aligned</h3>
                    <p className="text-gray-600">
                      Content aligned with NCERT syllabus and environmental education standards.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="text-8xl mb-8">🌳</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Join 10,000+ Students
              </h3>
              <p className="text-gray-600 mb-8">
                Students across India are already learning and making a difference. 
                Be part of the change!
              </p>
              
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className="btn btn-primary btn-lg"
                >
                  View Your Progress
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="btn btn-primary btn-lg"
                >
                  Start Learning Now
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;