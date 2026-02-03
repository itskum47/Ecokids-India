import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  FaLeaf, 
  FaBars, 
  FaTimes, 
  FaUser, 
  FaSignOutAlt,
  FaBell,
  FaCog
} from 'react-icons/fa';
import { logout } from '../../store/slices/authSlice';
import LanguageSwitcher from '../common/LanguageSwitcher';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { t, i18n } = useTranslation();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' }
  ];

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsLangOpen(false);
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === i18n.language) || languages[0];
  };

  const navigationItems = [
    { path: '/', label: t('navigation.home'), exact: true },
    { path: '/topics', label: t('navigation.topics') },
    { path: '/games', label: t('navigation.games') },
    { path: '/experiments', label: t('navigation.experiments') },
    { path: '/quizzes', label: t('navigation.quizzes') },
    { path: '/leaderboard', label: t('navigation.leaderboard') }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
    setIsProfileOpen(false);
  };

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-green-200">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to="/" className="flex items-center space-x-2 group">
                  <div className="bg-green-500 p-2 rounded-xl shadow-lg group-hover:bg-green-600 transition-colors">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <FaLeaf className="text-2xl text-white" />
                    </motion.div>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-green-700 font-eraser">EcoKids</h1>
                    <p className="text-lg font-bold text-green-600 font-eraser">India</p>
                    <p className="text-xs text-green-500 font-eraser hidden sm:block">Kids Environment & Health</p>
                  </div>
                </Link>
              </motion.div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item, index) => {
              const icons = {
                '/': '🏠',
                '/topics': '💡',
                '/games': '🎮',
                '/experiments': '🧪',
                '/quizzes': '📝',
                '/leaderboard': '🏆'
              };
              
              return (
                <motion.div
                  key={item.path}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-eraser font-bold transition-all duration-200 ${
                      isActive(item.path, item.exact)
                        ? 'text-white bg-green-500 shadow-md'
                        : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    <span className="text-base">{icons[item.path]}</span>
                    <span className="hidden xl:inline">{item.label}</span>
                  </Link>
                </motion.div>
              );
            })}
              </div>
            </div>

          {/* Right Side */}
          <div className="flex items-center space-x-2">
            {/* Little Kids Avatar */}
            <div className="hidden lg:flex items-center bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full px-3 py-2 shadow-md">
              <motion.span 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-xl mr-1"
              >
                👧
              </motion.span>
              <span className="text-sm font-eraser font-bold text-green-700">Little Kids</span>
            </div>

            {/* Language Switcher Dropdown */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="bg-orange-100 rounded-full px-3 py-2 shadow-md hover:bg-orange-200 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span className="text-base">{getCurrentLanguage().flag}</span>
                  <span className="text-sm font-eraser font-bold text-orange-700 hidden sm:inline">
                    {getCurrentLanguage().nativeName}
                  </span>
                  <motion.svg
                    animate={{ rotate: isLangOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-3 h-3 text-orange-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </div>
              </motion.button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isLangOpen && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsLangOpen(false)}
                    />
                    
                    {/* Dropdown */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border-2 border-orange-200 z-20 overflow-hidden"
                    >
                      {languages.map((lang) => (
                        <motion.button
                          key={lang.code}
                          whileHover={{ backgroundColor: '#FED7AA' }}
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                            i18n.language === lang.code
                              ? 'bg-orange-100 text-orange-800'
                              : 'text-gray-700 hover:bg-orange-50'
                          }`}
                        >
                          <span className="text-2xl">{lang.flag}</span>
                          <div>
                            <p className="text-base font-eraser font-bold">
                              {lang.nativeName}
                            </p>
                            <p className="text-xs text-gray-500">{lang.name}</p>
                          </div>
                          {i18n.language === lang.code && (
                            <span className="ml-auto text-orange-600">✓</span>
                          )}
                        </motion.button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Authentication */}
            {isAuthenticated ? (
              <div className="relative">
                {/* Notifications - simplified */}
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-gray-600 hover:text-green-600 relative bg-gray-100 rounded-lg transition-colors"
                >
                  <FaBell />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    3
                  </span>
                </motion.button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user?.firstName?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden lg:block text-sm font-eraser font-medium text-gray-700">
                      {user?.firstName || 'User'}
                    </span>
                  </motion.button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <>
                        {/* Backdrop */}
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setIsProfileOpen(false)}
                        />
                        
                        {/* Dropdown */}
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20 overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-gray-200">
                            <p className="text-sm font-eraser font-bold text-gray-800">
                              {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-xs text-gray-600">{user?.email}</p>
                          </div>
                          
                          <div className="py-1">
                            <Link
                              to="/dashboard"
                              className="flex items-center px-4 py-2 text-sm font-eraser text-gray-700 hover:bg-gray-100"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <FaUser className="mr-3" />
                              Dashboard
                            </Link>
                            <Link
                              to="/profile"
                              className="flex items-center px-4 py-2 text-sm font-eraser text-gray-700 hover:bg-gray-100"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <FaCog className="mr-3" />
                              Profile
                            </Link>
                          </div>
                          
                          <div className="border-t border-gray-200 py-1">
                            <button
                              onClick={handleLogout}
                              className="flex items-center w-full px-4 py-2 text-sm font-eraser text-red-600 hover:bg-red-50"
                            >
                              <FaSignOutAlt className="mr-3" />
                              Logout
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {/* Account Dropdown */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsAuthOpen(!isAuthOpen)}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-eraser font-bold text-green-600 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <FaUser />
                    <span>{t('auth.account')}</span>
                    <motion.span
                      animate={{ rotate: isAuthOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      ▼
                    </motion.span>
                  </motion.button>

                  <AnimatePresence>
                    {isAuthOpen && (
                      <>
                        {/* Backdrop */}
                        <div 
                          className="fixed inset-0 z-40"
                          onClick={() => setIsAuthOpen(false)}
                        />
                        
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 border-2 border-green-200"
                        >
                          <Link
                            to="/login"
                            onClick={() => setIsAuthOpen(false)}
                            className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-lg">🔑</span>
                              <span className="font-eraser">{t('common.login')}</span>
                            </div>
                          </Link>
                          <Link
                            to="/register"
                            onClick={() => setIsAuthOpen(false)}
                            className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-lg">🌟</span>
                              <span className="font-eraser">{t('common.register')}</span>
                            </div>
                          </Link>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 bg-white"
            >
              <div className="py-4 space-y-2 px-4">
                {navigationItems.map((item, index) => {
                  const icons = {
                    '/': '🏠',
                    '/topics': '💡',
                    '/games': '🎮',
                    '/experiments': '🧪',
                    '/quizzes': '📝',
                    '/leaderboard': '🏆'
                  };
                  
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 text-base font-eraser font-medium rounded-lg transition-colors ${
                          isActive(item.path, item.exact)
                            ? 'text-white bg-green-500'
                            : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="text-lg">{icons[item.path]}</span>
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
                
                {!isAuthenticated && (
                  <div className="pt-4 space-y-3 border-t border-gray-200">
                    <Link
                      to="/login"
                      className="block px-4 py-3 text-base font-eraser font-bold text-green-600 bg-green-100 rounded-xl hover:bg-green-200 transition-colors text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      🔑 {t('common.login')}
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-base font-eraser font-bold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-colors text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      🌟 {t('common.register')}
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
    </>
  );
};

export default Navbar;