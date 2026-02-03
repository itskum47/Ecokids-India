import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { loadUser, login, register, logout, clearError } from './store/slices/authSlice';
import Navbar from './components/layout/Navbar';
import SimpleExperimentsPage from './pages/SimpleExperimentsPage';
import QuizList from './pages/QuizList';

// Authentication Components
const LoginForm = ({ onClose, onSwitchToRegister }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.auth);

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(credentials));
    if (login.fulfilled.match(result)) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-green-800">Login to EcoKids</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-green-600 hover:text-green-800 font-medium"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const RegisterForm = ({ onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    age: '',
    grade: ''
  });
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.auth);

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const { confirmPassword, ...userData } = formData;
    const result = await dispatch(register(userData));
    if (register.fulfilled.match(result)) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-green-800">Join EcoKids</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {formData.role === 'student' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  min="3"
                  max="18"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                >
                  <option value="">Select Grade</option>
                  <option value="Pre-K">Pre-K</option>
                  <option value="K">Kindergarten</option>
                  <option value="1">Grade 1</option>
                  <option value="2">Grade 2</option>
                  <option value="3">Grade 3</option>
                  <option value="4">Grade 4</option>
                  <option value="5">Grade 5</option>
                  <option value="6">Grade 6</option>
                  <option value="7">Grade 7</option>
                  <option value="8">Grade 8</option>
                  <option value="9">Grade 9</option>
                  <option value="10">Grade 10</option>
                  <option value="11">Grade 11</option>
                  <option value="12">Grade 12</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">
              Must contain at least one uppercase letter, one lowercase letter, and one number
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-green-600 hover:text-green-800 font-medium"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Navigation Header with Authentication - NIEHS inspired design (OLD - REPLACED)
const OldNavbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
      {/* Top utility bar */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm font-eraser">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <span className="mr-2">🌍</span>
                An educational platform for environmental awareness
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span>🌱 Growing Eco-Conscious Kids</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300">
                <span className="text-2xl">🌱</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-gray-800 tracking-wide leading-none font-eraser transform hover:scale-105 transition-transform duration-200">
                  EcoKids India
                </span>
                <span className="text-sm text-green-600 font-medium tracking-wide font-inter">
                  Kids Environment & Health
                </span>
              </div>
            </Link>
          </div>

          {/* Main navigation menu */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              to="/"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200 font-medium font-eraser text-lg"
            >
              <span className="text-lg">🏠</span>
              <span>Home</span>
            </Link>
            <Link
              to="/topics"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200 font-medium font-eraser text-lg"
            >
              <span className="text-lg">💡</span>
              <span>Topics</span>
            </Link>
            <Link
              to="/games"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200 font-medium font-eraser text-lg"
            >
              <span className="text-lg">🎮</span>
              <span>Games</span>
            </Link>
            <Link
              to="/activities"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200 font-medium font-eraser text-lg"
            >
              <span className="text-lg">🌿</span>
              <span>Activities</span>
            </Link>
            <Link
              to="/little-kids"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200 font-medium font-eraser text-lg"
            >
              <span className="text-lg">🐸</span>
              <span>Little Kids</span>
            </Link>
          </nav>

          {/* Search and auth section */}
          <div className="flex items-center space-x-4">
            {/* Search bar */}
            <div className="hidden md:block relative">
              <input
                type="text"
                placeholder="Search Kids Pages"
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors font-inter"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Authentication section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-3 bg-gradient-to-r from-green-50 to-blue-50 px-4 py-2 rounded-full border border-green-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md font-inter">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800 leading-none font-inter">
                      {user?.name}
                    </span>
                    <span className="text-xs text-green-600 capitalize leading-none font-inter">
                      {user?.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/${user?.role}-dashboard`)}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105 font-inter"
                >
                  Dashboard
                </button>

                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg font-inter"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowLogin(true)}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105 font-inter"
                >
                  Login
                </button>
                <button
                  onClick={() => setShowRegister(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105 font-inter"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {showLogin && (
        <LoginForm
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}

      {showRegister && (
        <RegisterForm
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </header>
  );
};

// Role-based Dashboard Components
const StudentDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-green-800 mb-6">
            Welcome back, {user?.name}! 🌟
          </h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-xl font-semibold text-green-800 mb-3">Your Progress</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Games Completed:</span>
                  <span className="font-semibold">5/9</span>
                </div>
                <div className="flex justify-between">
                  <span>Activities Done:</span>
                  <span className="font-semibold">3/12</span>
                </div>
                <div className="flex justify-between">
                  <span>Eco Points:</span>
                  <span className="font-semibold text-green-600">850 🌟</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">Quick Access</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/games')}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Continue Games 🎮
                </button>
                <button
                  onClick={() => navigate('/activities')}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                >
                  Try Activities 🌱
                </button>
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <h3 className="text-xl font-semibold text-yellow-800 mb-3">Achievements</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span>🏆</span>
                  <span className="text-sm">Recycling Champion</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🌊</span>
                  <span className="text-sm">Ocean Protector</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>⚡</span>
                  <span className="text-sm">Energy Saver</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Continue Learning</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-green-700">Climate Quest Game</h4>
                <p className="text-sm text-gray-600 mt-1">Continue your climate adventure!</p>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <span className="text-xs text-gray-500">60% Complete</span>
                </div>
              </div>

              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-blue-700">Water Conservation Activity</h4>
                <p className="text-sm text-gray-600 mt-1">Learn to save water at home!</p>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                  <span className="text-xs text-gray-500">30% Complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TeacherDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-green-800 mb-6">
            Teacher Dashboard - {user?.name} 👩‍🏫
          </h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-xl font-semibold text-purple-800 mb-3">My Classes</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Grade 3A:</span>
                  <span className="font-semibold">25 students</span>
                </div>
                <div className="flex justify-between">
                  <span>Grade 4B:</span>
                  <span className="font-semibold">22 students</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Today:</span>
                  <span className="font-semibold text-green-600">18 students</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-xl font-semibold text-green-800 mb-3">Class Progress</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm">Games Completion Rate</span>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <span className="text-xs text-gray-500">78% Average</span>
                </div>
                <div>
                  <span className="text-sm">Activities Completion</span>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <span className="text-xs text-gray-500">65% Average</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                  View Student Progress 📊
                </button>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                  Assign Activities 📝
                </button>
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors">
                  Create Lesson Plan 📚
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Student Performance</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Student Name</th>
                      <th className="text-left py-2">Games Completed</th>
                      <th className="text-left py-2">Activities Done</th>
                      <th className="text-left py-2">Eco Points</th>
                      <th className="text-left py-2">Last Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">Aisha Patel</td>
                      <td className="py-2">8/9</td>
                      <td className="py-2">10/12</td>
                      <td className="py-2 text-green-600 font-semibold">1,250</td>
                      <td className="py-2 text-gray-600">Today</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Rohan Kumar</td>
                      <td className="py-2">6/9</td>
                      <td className="py-2">7/12</td>
                      <td className="py-2 text-green-600 font-semibold">890</td>
                      <td className="py-2 text-gray-600">Yesterday</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Priya Singh</td>
                      <td className="py-2">9/9</td>
                      <td className="py-2">12/12</td>
                      <td className="py-2 text-green-600 font-semibold">1,450</td>
                      <td className="py-2 text-gray-600">Today</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-green-800 mb-6">
            Admin Dashboard - {user?.name} 👨‍💼
          </h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">Platform Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Users:</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span>Students:</span>
                  <span className="font-semibold">1,156</span>
                </div>
                <div className="flex justify-between">
                  <span>Teachers:</span>
                  <span className="font-semibold">89</span>
                </div>
                <div className="flex justify-between">
                  <span>Admins:</span>
                  <span className="font-semibold">2</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-xl font-semibold text-green-800 mb-3">Activity Today</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Active Users:</span>
                  <span className="font-semibold">342</span>
                </div>
                <div className="flex justify-between">
                  <span>Games Played:</span>
                  <span className="font-semibold">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span>Activities Done:</span>
                  <span className="font-semibold">567</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-xl font-semibold text-purple-800 mb-3">Content Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Games Available:</span>
                  <span className="font-semibold">9</span>
                </div>
                <div className="flex justify-between">
                  <span>Activities:</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span>Topics:</span>
                  <span className="font-semibold">6</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <h3 className="text-xl font-semibold text-orange-800 mb-3">System Health</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Server Status:</span>
                  <span className="font-semibold text-green-600">🟢 Online</span>
                </div>
                <div className="flex justify-between">
                  <span>Database:</span>
                  <span className="font-semibold text-green-600">🟢 Connected</span>
                </div>
                <div className="flex justify-between">
                  <span>API Status:</span>
                  <span className="font-semibold text-green-600">🟢 Healthy</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Management</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                    Manage Users 👥
                  </button>
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                    Create Teacher Account 👩‍🏫
                  </button>
                  <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors">
                    View User Analytics 📊
                  </button>
                  <button className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
                    Moderate Content 🛡️
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">New user registered</span>
                    <span className="text-xs text-gray-500">2 mins ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Teacher created lesson plan</span>
                    <span className="text-xs text-gray-500">15 mins ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">System backup completed</span>
                    <span className="text-xs text-gray-500">1 hour ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">New content uploaded</span>
                    <span className="text-xs text-gray-500">3 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Professional Home component inspired by NIEHS design
const SimpleHome = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Navbar />
      {/* Hero Section with Full Background Image and Overlay */}
      <div className="relative min-h-screen flex items-center justify-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop')`
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-8 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-shadow-lg">
            EcoKids India
          </h1>
          <h2 className="text-3xl md:text-4xl font-light mb-8 text-green-300">
            {t('home.hero.subtitle') || 'Environment Kids Health'}
          </h2>
          <p className="text-xl md:text-2xl mb-12 leading-relaxed max-w-3xl mx-auto font-light">
            {t('home.hero.description') || 'A comprehensive resource for kids, parents, and teachers to find fun and educational materials related to health, science, and the environment we live in today.'}
          </p>

          {/* Navigation Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            <Link to="/topics" className="group">
              <div className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-lg p-6 transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl mb-3">💡</div>
                <h3 className="text-gray-800 font-bold text-lg">{t('navigation.topics') || 'Topics'}</h3>
              </div>
            </Link>

            <Link to="/games" className="group">
              <div className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-lg p-6 transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl mb-3">🚀</div>
                <h3 className="text-gray-800 font-bold text-lg">{t('navigation.games') || 'Games'}</h3>
              </div>
            </Link>

            <Link to="/activities" className="group">
              <div className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-lg p-6 transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="text-gray-800 font-bold text-lg">Activities</h3>
              </div>
            </Link>

            <Link to="/quizzes" className="group">
              <div className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-lg p-6 transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl mb-3">📖</div>
                <h3 className="text-gray-800 font-bold text-lg">{t('navigation.quizzes') || 'Lessons'}</h3>
              </div>
            </Link>
          </div>

          {/* Scroll Down Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <button
              onClick={() => {
                const featuresSection = document.getElementById('features-section');
                if (featuresSection) {
                  featuresSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                  });
                }
              }}
              className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center hover:bg-white hover:text-gray-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              aria-label="Scroll down to features"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features-section" className="bg-gray-50 py-20">
        <div className="container mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">{t('home.features.title') || 'Discover, Explore, Learn'}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.features.subtitle') || 'Interactive learning experiences designed to inspire the next generation of environmental stewards'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Feature 1 */}
            <div className="bg-green-100 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🌱</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t('navigation.topics') || 'Environmental Topics'}</h3>
              <p className="text-gray-600">
                {t('home.features.gamification.description') || 'Explore climate change, ecosystems, and sustainability through engaging content'}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-blue-100 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🎮</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t('navigation.games') || 'Interactive Games'}</h3>
              <p className="text-gray-600">
                Learn while playing with fun, educational games about the environment
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-purple-100 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🔬</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Hands-on Activities</h3>
              <p className="text-gray-600">
                Conduct experiments and activities to understand environmental science
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Link
              to="/topics"
              className="inline-flex items-center px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-lg"
            >
              Start Learning Today
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Super Cool Animated Frog Mascot */}
      <Link
        to="/little-kids"
        className="fixed bottom-6 right-6 z-50 group"
      >
        {/* Mascot Container with Advanced Animations */}
        <div className="relative w-24 h-24">
          {/* Magical Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-300 via-yellow-300 to-green-400 rounded-full opacity-75 animate-ping scale-110"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-400 to-lime-400 rounded-full opacity-50 animate-pulse scale-105"></div>

          {/* Main Mascot */}
          <div className="relative bg-gradient-to-br from-green-300 via-green-400 to-green-500 hover:from-green-400 hover:via-green-500 hover:to-green-600 rounded-full p-2 shadow-2xl transform hover:scale-110 transition-all duration-300 animate-bounce hover:animate-none border-4 border-white">
            {/* Full Body SVG Frog */}
            <div className="transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 relative">
              <svg width="80" height="80" viewBox="0 0 100 100" className="drop-shadow-lg">
                {/* Frog Body */}
                <ellipse cx="50" cy="65" rx="25" ry="20" fill="#4ade80" stroke="#22c55e" strokeWidth="2" className="group-hover:fill-[#22c55e] transition-colors duration-300" />

                {/* Frog Head */}
                <ellipse cx="50" cy="35" rx="20" ry="18" fill="#4ade80" stroke="#22c55e" strokeWidth="2" className="group-hover:fill-[#22c55e] transition-colors duration-300" />

                {/* Front Legs */}
                <ellipse cx="35" cy="55" rx="8" ry="12" fill="#4ade80" stroke="#22c55e" strokeWidth="1.5" className="group-hover:fill-[#22c55e] transition-colors duration-300" />
                <ellipse cx="65" cy="55" rx="8" ry="12" fill="#4ade80" stroke="#22c55e" strokeWidth="1.5" className="group-hover:fill-[#22c55e] transition-colors duration-300" />

                {/* Back Legs */}
                <ellipse cx="30" cy="75" rx="12" ry="8" fill="#4ade80" stroke="#22c55e" strokeWidth="1.5" className="group-hover:fill-[#22c55e] transition-colors duration-300" />
                <ellipse cx="70" cy="75" rx="12" ry="8" fill="#4ade80" stroke="#22c55e" strokeWidth="1.5" className="group-hover:fill-[#22c55e] transition-colors duration-300" />

                {/* Feet */}
                <ellipse cx="25" cy="82" rx="6" ry="4" fill="#22c55e" className="group-hover:fill-[#16a34a] transition-colors duration-300" />
                <ellipse cx="75" cy="82" rx="6" ry="4" fill="#22c55e" className="group-hover:fill-[#16a34a] transition-colors duration-300" />

                {/* Eyes */}
                <circle cx="42" cy="28" r="6" fill="#ffffff" stroke="#22c55e" strokeWidth="1" />
                <circle cx="58" cy="28" r="6" fill="#ffffff" stroke="#22c55e" strokeWidth="1" />

                {/* Eye pupils - change expression on hover */}
                <circle cx="42" cy="28" r="3" fill="#000000" className="group-hover:hidden transition-opacity duration-300" />
                <circle cx="58" cy="28" r="3" fill="#000000" className="group-hover:hidden transition-opacity duration-300" />

                {/* Happy eyes (hidden by default, shown on hover) */}
                <path d="M 38 26 Q 42 30 46 26" stroke="#000000" strokeWidth="2" fill="none" className="hidden group-hover:block" />
                <path d="M 54 26 Q 58 30 62 26" stroke="#000000" strokeWidth="2" fill="none" className="hidden group-hover:block" />

                {/* Mouth */}
                <path d="M 45 40 Q 50 45 55 40" stroke="#22c55e" strokeWidth="2" fill="none" className="group-hover:hidden" />

                {/* Happy mouth (shown on hover) */}
                <path d="M 43 38 Q 50 48 57 38" stroke="#22c55e" strokeWidth="3" fill="none" className="hidden group-hover:block" />

                {/* Nose */}
                <ellipse cx="50" cy="35" rx="2" ry="1" fill="#22c55e" />

                {/* Spots */}
                <circle cx="45" cy="50" r="2" fill="#22c55e" opacity="0.7" />
                <circle cx="58" cy="48" r="1.5" fill="#22c55e" opacity="0.7" />
                <circle cx="40" cy="62" r="2" fill="#22c55e" opacity="0.7" />
                <circle cx="62" cy="65" r="1.5" fill="#22c55e" opacity="0.7" />

                {/* Crown (appears on hover) */}
                <g className="hidden group-hover:block animate-bounce">
                  <polygon points="46,15 50,8 54,15" fill="#ffd700" stroke="#f59e0b" strokeWidth="1" />
                  <circle cx="50" cy="12" r="2" fill="#f59e0b" />
                </g>

                {/* Blush (appears on hover) */}
                <circle cx="35" cy="35" r="3" fill="#fca5a5" opacity="0.6" className="hidden group-hover:block" />
                <circle cx="65" cy="35" r="3" fill="#fca5a5" opacity="0.6" className="hidden group-hover:block" />
              </svg>
            </div>

            {/* Sparkle Effects */}
            <div className="absolute -top-2 -right-2 text-yellow-300 animate-spin">✨</div>
            <div className="absolute -bottom-1 -left-2 text-yellow-300 animate-ping">⭐</div>
            <div className="absolute top-1 left-1 text-green-200 animate-pulse">💚</div>
          </div>

          {/* Cool Speech Bubble */}
          <div className="absolute -top-24 -left-16 bg-gradient-to-r from-white via-green-50 to-white rounded-2xl px-4 py-3 shadow-xl opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300 whitespace-nowrap border-2 border-green-200">
            <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              Hey Kids! Let's Learn! 🌟✨
            </p>
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-white"></div>
          </div>

          {/* Floating Hearts */}
          <div className="absolute -top-8 left-4 text-red-400 animate-bounce delay-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-lg">💖</div>
          <div className="absolute -top-10 right-2 text-pink-400 animate-bounce delay-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-lg">💕</div>

          {/* Rainbow Trail Effect */}
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400 via-yellow-400 to-purple-400 animate-spin"></div>
          </div>
        </div>

        {/* Cool Sound Effect Text (Visual) */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-green-600 font-bold text-sm opacity-0 group-hover:opacity-100 animate-bounce transition-all duration-300">
          *RIBBIT* 🎵
        </div>

        {/* Extra Fun Animations */}
        <div className="absolute -top-16 -right-6 text-yellow-400 animate-spin opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 text-xl">🌟</div>
        <div className="absolute -bottom-4 -left-6 text-green-300 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300 text-lg">🍃</div>
        <div className="absolute top-4 -right-8 text-blue-300 animate-bounce opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 text-lg">💧</div>
        <div className="absolute -top-6 -left-8 text-purple-300 animate-spin opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-400 text-lg">🦋</div>
        <div className="absolute bottom-2 -right-10 text-orange-300 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-500 text-lg">🌺</div>
      </Link>
    </div>
  );
};

// Environmental Topics page with actual topics
const TopicsPage = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const topics = [
    {
      id: 1,
      title: "Climate Change Basics",
      description: "Understanding global warming, greenhouse gases, and climate patterns",
      image: "https://images.unsplash.com/photo-1569163139394-de44cb5894ab?w=400&h=250&fit=crop",
      url: "https://climate.nasa.gov/kids/",
      difficulty: "Beginner",
      duration: "15 mins",
      category: "Climate"
    },
    {
      id: 2,
      title: "Renewable Energy Sources",
      description: "Solar, wind, hydro, and other clean energy alternatives",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=250&fit=crop",
      url: "https://www.energy.gov/eere/education/energy-education-and-workforce-development",
      difficulty: "Intermediate",
      duration: "20 mins",
      category: "Energy"
    },
    {
      id: 3,
      title: "Ocean Conservation",
      description: "Marine ecosystems, plastic pollution, and ocean protection",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop",
      url: "https://oceanservice.noaa.gov/education/",
      difficulty: "Beginner",
      duration: "12 mins",
      category: "Marine"
    },
    {
      id: 4,
      title: "Forest Ecosystems",
      description: "Biodiversity, deforestation, and forest conservation efforts",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop",
      url: "https://www.fs.usda.gov/learn/",
      difficulty: "Intermediate",
      duration: "18 mins",
      category: "Forest"
    },
    {
      id: 5,
      title: "Recycling & Waste Management",
      description: "Reduce, reuse, recycle principles and waste reduction strategies",
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=250&fit=crop",
      url: "https://www.epa.gov/recycle",
      difficulty: "Beginner",
      duration: "10 mins",
      category: "Waste"
    },
    {
      id: 6,
      title: "Wildlife Protection",
      description: "Endangered species, habitat conservation, and biodiversity",
      image: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400&h=250&fit=crop",
      url: "https://www.worldwildlife.org/teaching-resources",
      difficulty: "Advanced",
      duration: "25 mins",
      category: "Wildlife"
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">📚 Environmental Topics</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore comprehensive learning materials about climate change, biodiversity, renewable energy, and sustainable living practices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topics.map((topic) => (
            <div key={topic.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <img
                src={topic.image}
                alt={topic.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(topic.difficulty)}`}>
                    {topic.difficulty}
                  </span>
                  <span className="text-sm text-gray-500">{topic.duration}</span>
                </div>

                <h3 className="text-xl font-bold mb-2 text-gray-800">{topic.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{topic.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {topic.category}
                  </span>
                  <button
                    onClick={() => setSelectedTopic(topic)}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Learn More
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Topic Details Modal */}
        {selectedTopic && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full h-full max-w-6xl overflow-hidden flex flex-col">
              <div className="p-4 bg-green-600 flex items-center justify-between text-white shrink-0">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold">{selectedTopic.title}</h2>
                  <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">
                    Translated View
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={selectedTopic.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm underline hover:text-green-100"
                  >
                    Open Original
                  </a>
                  <button
                    onClick={() => setSelectedTopic(null)}
                    className="bg-white text-green-600 p-2 rounded-full hover:bg-green-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex-1 relative bg-gray-100">
                <iframe
                  key={`${selectedTopic.id}-${i18n.language}`}
                  title={selectedTopic.title}
                  src={`http://localhost:5001/api/proxy?url=${encodeURIComponent(selectedTopic.url)}&lang=${i18n.language}`}
                  className="w-full h-full border-0"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <div className="bg-green-50 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-green-800 mb-4">🌱 Start Your Environmental Journey</h3>
            <p className="text-green-700 mb-6">
              Each topic links to trusted educational resources from NASA, EPA, NOAA, and other reputable organizations.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Recycling Sort Game Component
const RecyclingSortGame = () => {
  const [score, setScore] = React.useState(0);
  const [lives, setLives] = React.useState(3);
  const [gameOver, setGameOver] = React.useState(false);
  const [currentItem, setCurrentItem] = React.useState(null);
  const [gameWon, setGameWon] = React.useState(false);

  const wasteItems = [
    { id: 1, name: 'Plastic Bottle', type: 'plastic', emoji: '🍼', used: false },
    { id: 2, name: 'Banana Peel', type: 'organic', emoji: '🍌', used: false },
    { id: 3, name: 'Newspaper', type: 'paper', emoji: '📰', used: false },
    { id: 4, name: 'Glass Jar', type: 'glass', emoji: '🫙', used: false },
    { id: 5, name: 'Apple Core', type: 'organic', emoji: '🍎', used: false },
    { id: 6, name: 'Soda Can', type: 'metal', emoji: '🥤', used: false },
    { id: 7, name: 'Pizza Box', type: 'paper', emoji: '📦', used: false },
    { id: 8, name: 'Yogurt Cup', type: 'plastic', emoji: '🥛', used: false }
  ];

  const [items, setItems] = React.useState(wasteItems);

  const bins = [
    { type: 'plastic', name: 'Plastic', color: 'bg-blue-500', emoji: '♻️' },
    { type: 'organic', name: 'Organic', color: 'bg-green-500', emoji: '🌱' },
    { type: 'paper', name: 'Paper', color: 'bg-yellow-500', emoji: '📄' },
    { type: 'glass', name: 'Glass', color: 'bg-purple-500', emoji: '🫙' },
    { type: 'metal', name: 'Metal', color: 'bg-gray-500', emoji: '🔩' }
  ];

  React.useEffect(() => {
    const availableItems = items.filter(item => !item.used);
    if (availableItems.length > 0 && !currentItem && !gameOver) {
      const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
      setCurrentItem(randomItem);
    } else if (availableItems.length === 0 && !gameOver) {
      setGameWon(true);
    }
  }, [items, currentItem, gameOver]);

  const handleSort = (binType) => {
    if (!currentItem) return;

    if (currentItem.type === binType) {
      setScore(score + 10);
      setItems(items.map(item =>
        item.id === currentItem.id ? { ...item, used: true } : item
      ));
      setCurrentItem(null);
    } else {
      setLives(lives - 1);
      if (lives <= 1) {
        setGameOver(true);
      }
      setCurrentItem(null);
    }
  };

  const resetGame = () => {
    setScore(0);
    setLives(3);
    setGameOver(false);
    setGameWon(false);
    setCurrentItem(null);
    setItems(wasteItems.map(item => ({ ...item, used: false })));
  };

  if (gameWon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-auto text-center shadow-2xl">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-green-600 mb-4">Congratulations!</h2>
          <p className="text-lg mb-4">You sorted all items correctly!</p>
          <p className="text-2xl font-bold text-blue-600 mb-6">Final Score: {score}</p>
          <div className="space-y-3">
            <button
              onClick={resetGame}
              className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              Play Again
            </button>
            <Link
              to="/games"
              className="block w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              Back to Games
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 to-orange-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-auto text-center shadow-2xl">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-3xl font-bold text-red-600 mb-4">Game Over!</h2>
          <p className="text-lg mb-4">Don't worry, sorting takes practice!</p>
          <p className="text-2xl font-bold text-blue-600 mb-6">Final Score: {score}</p>
          <div className="space-y-3">
            <button
              onClick={resetGame}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
            <Link
              to="/games"
              className="block w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              Back to Games
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-600 p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">♻️ Recycling Sort Challenge</h1>
          <div className="flex justify-center space-x-8 text-white text-lg">
            <div>Score: <span className="font-bold">{score}</span></div>
            <div>Lives: <span className="font-bold">{'❤️'.repeat(lives)}</span></div>
          </div>
        </div>

        {/* Current Item */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-auto shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Sort this item:</h2>
            {currentItem && (
              <div className="text-center">
                <div className="text-8xl mb-4">{currentItem.emoji}</div>
                <h3 className="text-xl font-semibold">{currentItem.name}</h3>
              </div>
            )}
          </div>
        </div>

        {/* Recycling Bins */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
          {bins.map((bin) => (
            <button
              key={bin.type}
              onClick={() => handleSort(bin.type)}
              className={`${bin.color} text-white p-6 rounded-2xl hover:scale-105 transition-transform duration-200 shadow-lg`}
            >
              <div className="text-4xl mb-2">{bin.emoji}</div>
              <div className="font-semibold">{bin.name}</div>
            </button>
          ))}
        </div>

        {/* Instructions */}
        <div className="bg-white bg-opacity-20 rounded-2xl p-6 max-w-2xl mx-auto mt-8 text-white text-center">
          <h3 className="text-xl font-bold mb-2">How to Play:</h3>
          <p>Click the correct recycling bin for each item. Get 10 points for correct sorting, lose a life for mistakes!</p>
        </div>
      </div>
    </div>
  );
};

// Ocean Memory Game Component
const OceanMemoryGame = () => {
  const [cards, setCards] = React.useState([]);
  const [flippedCards, setFlippedCards] = React.useState([]);
  const [matchedCards, setMatchedCards] = React.useState([]);
  const [score, setScore] = React.useState(0);
  const [moves, setMoves] = React.useState(0);
  const [gameWon, setGameWon] = React.useState(false);

  const oceanAnimals = [
    { id: 1, name: 'Dolphin', emoji: '🐬' },
    { id: 2, name: 'Whale', emoji: '🐋' },
    { id: 3, name: 'Octopus', emoji: '🐙' },
    { id: 4, name: 'Turtle', emoji: '🐢' },
    { id: 5, name: 'Fish', emoji: '🐠' },
    { id: 6, name: 'Shark', emoji: '🦈' }
  ];

  React.useEffect(() => {
    const shuffledCards = [...oceanAnimals, ...oceanAnimals]
      .map((animal, index) => ({ ...animal, cardId: index, isFlipped: false }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
  }, []);

  React.useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves(moves + 1);
      const [first, second] = flippedCards;
      if (first.id === second.id) {
        setMatchedCards([...matchedCards, first.cardId, second.cardId]);
        setScore(score + 20);
        setFlippedCards([]);

        if (matchedCards.length + 2 === cards.length) {
          setGameWon(true);
        }
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, matchedCards, cards.length, score, moves]);

  const handleCardClick = (card) => {
    if (flippedCards.length < 2 && !flippedCards.find(c => c.cardId === card.cardId) && !matchedCards.includes(card.cardId)) {
      setFlippedCards([...flippedCards, card]);
    }
  };

  const resetGame = () => {
    const shuffledCards = [...oceanAnimals, ...oceanAnimals]
      .map((animal, index) => ({ ...animal, cardId: index, isFlipped: false }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setScore(0);
    setMoves(0);
    setGameWon(false);
  };

  if (gameWon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-teal-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-auto text-center shadow-2xl">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Ocean Master!</h2>
          <p className="text-lg mb-4">You matched all the sea creatures!</p>
          <p className="text-xl font-bold text-teal-600 mb-2">Score: {score}</p>
          <p className="text-lg text-gray-600 mb-6">Moves: {moves}</p>
          <div className="space-y-3">
            <button
              onClick={resetGame}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Play Again
            </button>
            <Link
              to="/games"
              className="block w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              Back to Games
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-teal-600 p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🌊 Ocean Memory Match</h1>
          <div className="flex justify-center space-x-8 text-white text-lg">
            <div>Score: <span className="font-bold">{score}</span></div>
            <div>Moves: <span className="font-bold">{moves}</span></div>
          </div>
        </div>

        {/* Memory Cards Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
          {cards.map((card) => (
            <button
              key={card.cardId}
              onClick={() => handleCardClick(card)}
              className={`aspect-square rounded-2xl text-4xl font-bold transition-all duration-300 transform hover:scale-105 ${flippedCards.find(c => c.cardId === card.cardId) || matchedCards.includes(card.cardId)
                ? 'bg-white text-blue-600 shadow-lg'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                }`}
            >
              {flippedCards.find(c => c.cardId === card.cardId) || matchedCards.includes(card.cardId)
                ? card.emoji
                : '🌊'
              }
            </button>
          ))}
        </div>

        {/* Instructions */}
        <div className="bg-white bg-opacity-20 rounded-2xl p-6 max-w-2xl mx-auto text-white text-center">
          <h3 className="text-xl font-bold mb-2">How to Play:</h3>
          <p>Click cards to flip them and find matching pairs of ocean animals. Complete all matches to win!</p>
        </div>
      </div>
    </div>
  );
};

// Climate Quest Game Component
const ClimateQuestGame = () => {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState('');
  const [showResult, setShowResult] = React.useState(false);
  const [gameCompleted, setGameCompleted] = React.useState(false);

  const questions = [
    {
      question: "What is the main cause of climate change?",
      options: [
        "Natural weather patterns",
        "Greenhouse gas emissions",
        "Solar radiation",
        "Ocean currents"
      ],
      correct: "Greenhouse gas emissions",
      explanation: "Human activities that produce greenhouse gases like CO2 are the main cause of current climate change."
    },
    {
      question: "Which gas is the biggest contributor to global warming?",
      options: [
        "Oxygen",
        "Nitrogen",
        "Carbon Dioxide",
        "Hydrogen"
      ],
      correct: "Carbon Dioxide",
      explanation: "Carbon dioxide (CO2) from burning fossil fuels is the largest contributor to greenhouse gas emissions."
    },
    {
      question: "What can you do to help reduce climate change?",
      options: [
        "Use more plastic bags",
        "Leave lights on all day",
        "Walk or bike instead of driving",
        "Waste more food"
      ],
      correct: "Walk or bike instead of driving",
      explanation: "Using sustainable transportation reduces carbon emissions and helps fight climate change."
    },
    {
      question: "What happens when ice caps melt?",
      options: [
        "Sea levels rise",
        "Weather gets cooler",
        "More snow falls",
        "Nothing changes"
      ],
      correct: "Sea levels rise",
      explanation: "Melting ice caps add water to the oceans, causing sea levels to rise and threatening coastal areas."
    },
    {
      question: "Which energy source is better for the environment?",
      options: [
        "Coal",
        "Oil",
        "Solar power",
        "Natural gas"
      ],
      correct: "Solar power",
      explanation: "Solar power is renewable and produces no greenhouse gas emissions during operation."
    }
  ];

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    setShowResult(true);
    if (selectedAnswer === questions[currentQuestion].correct) {
      setScore(score + 20);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setShowResult(false);
    } else {
      setGameCompleted(true);
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer('');
    setShowResult(false);
    setGameCompleted(false);
  };

  if (gameCompleted) {
    const percentage = (score / (questions.length * 20)) * 100;
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-auto text-center shadow-2xl">
          <div className="text-6xl mb-4">
            {percentage >= 80 ? '🌟' : percentage >= 60 ? '🌱' : '🌍'}
          </div>
          <h2 className="text-3xl font-bold text-green-600 mb-4">
            {percentage >= 80 ? 'Climate Expert!' : percentage >= 60 ? 'Well Done!' : 'Keep Learning!'}
          </h2>
          <p className="text-lg mb-4">You completed the Climate Quest!</p>
          <p className="text-2xl font-bold text-blue-600 mb-2">Score: {score}/{questions.length * 20}</p>
          <p className="text-lg text-gray-600 mb-6">{percentage.toFixed(0)}% Correct</p>
          <div className="space-y-3">
            <button
              onClick={resetGame}
              className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              Play Again
            </button>
            <Link
              to="/games"
              className="block w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              Back to Games
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-600 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🌍 Climate Quest</h1>
          <div className="flex justify-center space-x-8 text-white text-lg">
            <div>Question: <span className="font-bold">{currentQuestion + 1}/{questions.length}</span></div>
            <div>Score: <span className="font-bold">{score}</span></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {questions[currentQuestion].question}
          </h2>

          {/* Answer Options */}
          <div className="space-y-4 mb-6">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={showResult}
                className={`w-full p-4 rounded-lg text-left transition-colors border-2 ${selectedAnswer === option
                  ? showResult
                    ? option === questions[currentQuestion].correct
                      ? 'bg-green-100 border-green-500 text-green-800'
                      : 'bg-red-100 border-red-500 text-red-800'
                    : 'bg-blue-100 border-blue-500 text-blue-800'
                  : showResult && option === questions[currentQuestion].correct
                    ? 'bg-green-100 border-green-500 text-green-800'
                    : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                  }`}
              >
                {option}
                {showResult && option === questions[currentQuestion].correct && (
                  <span className="float-right">✅</span>
                )}
                {showResult && selectedAnswer === option && option !== questions[currentQuestion].correct && (
                  <span className="float-right">❌</span>
                )}
              </button>
            ))}
          </div>

          {/* Result and Explanation */}
          {showResult && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="font-semibold text-blue-800 mb-2">
                {selectedAnswer === questions[currentQuestion].correct ? 'Correct!' : 'Not quite right.'}
              </p>
              <p className="text-blue-700">{questions[currentQuestion].explanation}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="text-center">
            {!showResult ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                className={`px-8 py-3 rounded-lg font-semibold transition-colors ${selectedAnswer
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-8 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white bg-opacity-20 rounded-full h-4 mb-4">
          <div
            className="bg-white h-4 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

// Energy Saver Game Component
const EnergySaverGame = () => {
  const [score, setScore] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(60);
  const [gameOver, setGameOver] = React.useState(false);
  const [items, setItems] = React.useState([
    { id: 1, name: 'Living Room Light', type: 'light', on: true, x: 20, y: 30, emoji: '💡' },
    { id: 2, name: 'TV', type: 'appliance', on: true, x: 60, y: 40, emoji: '📺' },
    { id: 3, name: 'Kitchen Light', type: 'light', on: true, x: 30, y: 70, emoji: '💡' },
    { id: 4, name: 'Computer', type: 'appliance', on: true, x: 70, y: 20, emoji: '💻' },
    { id: 5, name: 'Bedroom Light', type: 'light', on: true, x: 80, y: 60, emoji: '💡' },
    { id: 6, name: 'Fan', type: 'appliance', on: true, x: 40, y: 50, emoji: '🪭' }
  ]);

  React.useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  const toggleItem = (id) => {
    if (gameOver) return;

    setItems(items.map(item => {
      if (item.id === id && item.on) {
        setScore(score + 10);
        return { ...item, on: false };
      }
      return item;
    }));
  };

  const resetGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setItems(items.map(item => ({ ...item, on: true })));
  };

  const allOff = items.every(item => !item.on);

  if (gameOver || allOff) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-auto text-center shadow-2xl">
          <div className="text-6xl mb-4">{allOff ? '🌟' : '⚡'}</div>
          <h2 className="text-3xl font-bold text-yellow-600 mb-4">
            {allOff ? 'Energy Hero!' : 'Time\'s Up!'}
          </h2>
          <p className="text-lg mb-4">
            {allOff ? 'You saved all the energy!' : 'You helped save some energy!'}
          </p>
          <p className="text-2xl font-bold text-orange-600 mb-6">Score: {score}</p>
          <div className="space-y-3">
            <button onClick={resetGame} className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors">
              Play Again
            </button>
            <Link to="/games" className="block w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors">
              Back to Games
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-600 p-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">⚡ Energy Saver Challenge</h1>
          <div className="flex justify-center space-x-8 text-white text-lg">
            <div>Score: <span className="font-bold">{score}</span></div>
            <div>Time: <span className="font-bold">{timeLeft}s</span></div>
          </div>
        </div>

        <div className="relative bg-white rounded-2xl p-8 max-w-4xl mx-auto shadow-2xl" style={{ minHeight: '500px' }}>
          <h2 className="text-2xl font-bold mb-6 text-center">Click to turn OFF lights and appliances!</h2>

          {items.map(item => (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-full text-4xl transition-all duration-300 ${item.on
                ? 'bg-yellow-200 hover:bg-yellow-300 animate-pulse shadow-lg'
                : 'bg-gray-200 opacity-50'
                }`}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
            >
              {item.emoji}
            </button>
          ))}
        </div>

        <div className="bg-white bg-opacity-20 rounded-2xl p-6 max-w-2xl mx-auto mt-8 text-white text-center">
          <h3 className="text-xl font-bold mb-2">Save Energy, Save Earth!</h3>
          <p>Turn off all the lights and appliances before time runs out. Every action counts!</p>
        </div>
      </div>
    </div>
  );
};

// Animal Habitat Game Component
const AnimalHabitatGame = () => {
  const [score, setScore] = React.useState(0);
  const [currentAnimal, setCurrentAnimal] = React.useState(null);
  const [matchedAnimals, setMatchedAnimals] = React.useState([]);
  const [gameWon, setGameWon] = React.useState(false);

  const animals = [
    { id: 1, name: 'Polar Bear', habitat: 'arctic', emoji: '🐻‍❄️' },
    { id: 2, name: 'Monkey', habitat: 'forest', emoji: '🐵' },
    { id: 3, name: 'Fish', habitat: 'ocean', emoji: '🐠' },
    { id: 4, name: 'Cactus', habitat: 'desert', emoji: '🌵' },
    { id: 5, name: 'Penguin', habitat: 'arctic', emoji: '🐧' },
    { id: 6, name: 'Tree', habitat: 'forest', emoji: '🌳' },
    { id: 7, name: 'Whale', habitat: 'ocean', emoji: '🐋' },
    { id: 8, name: 'Camel', habitat: 'desert', emoji: '🐪' }
  ];

  const habitats = [
    { type: 'arctic', name: 'Arctic', color: 'bg-blue-200', emoji: '❄️', description: 'Cold, icy regions' },
    { type: 'forest', name: 'Forest', color: 'bg-green-200', emoji: '🌲', description: 'Lush, tree-filled areas' },
    { type: 'ocean', name: 'Ocean', color: 'bg-blue-300', emoji: '🌊', description: 'Deep, salty waters' },
    { type: 'desert', name: 'Desert', color: 'bg-yellow-200', emoji: '🏜️', description: 'Hot, dry sandy areas' }
  ];

  React.useEffect(() => {
    const availableAnimals = animals.filter(animal => !matchedAnimals.includes(animal.id));
    if (availableAnimals.length > 0 && !currentAnimal) {
      setCurrentAnimal(availableAnimals[Math.floor(Math.random() * availableAnimals.length)]);
    } else if (availableAnimals.length === 0) {
      setGameWon(true);
    }
  }, [matchedAnimals, currentAnimal]);

  const handleHabitatClick = (habitatType) => {
    if (!currentAnimal) return;

    if (currentAnimal.habitat === habitatType) {
      setScore(score + 15);
      setMatchedAnimals([...matchedAnimals, currentAnimal.id]);
      setCurrentAnimal(null);
    } else {
      setScore(Math.max(0, score - 5));
    }
  };

  const resetGame = () => {
    setScore(0);
    setMatchedAnimals([]);
    setCurrentAnimal(null);
    setGameWon(false);
  };

  if (gameWon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 to-teal-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-auto text-center shadow-2xl">
          <div className="text-6xl mb-4">🌍</div>
          <h2 className="text-3xl font-bold text-green-600 mb-4">Habitat Expert!</h2>
          <p className="text-lg mb-4">You matched all animals to their homes!</p>
          <p className="text-2xl font-bold text-teal-600 mb-6">Final Score: {score}</p>
          <div className="space-y-3">
            <button onClick={resetGame} className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors">
              Play Again
            </button>
            <Link to="/games" className="block w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors">
              Back to Games
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-teal-600 p-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🏡 Animal Habitat Match</h1>
          <div className="text-white text-lg">
            Score: <span className="font-bold">{score}</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-auto shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Where does this live?</h2>
            {currentAnimal && (
              <div className="text-center">
                <div className="text-8xl mb-4">{currentAnimal.emoji}</div>
                <h3 className="text-xl font-semibold">{currentAnimal.name}</h3>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {habitats.map((habitat) => (
            <button
              key={habitat.type}
              onClick={() => handleHabitatClick(habitat.type)}
              className={`${habitat.color} p-6 rounded-2xl hover:scale-105 transition-transform duration-200 shadow-lg`}
            >
              <div className="text-4xl mb-2">{habitat.emoji}</div>
              <div className="font-semibold text-lg">{habitat.name}</div>
              <div className="text-sm text-gray-600">{habitat.description}</div>
            </button>
          ))}
        </div>

        <div className="bg-white bg-opacity-20 rounded-2xl p-6 max-w-2xl mx-auto mt-8 text-white text-center">
          <h3 className="text-xl font-bold mb-2">Learn About Habitats!</h3>
          <p>Match animals and plants to their natural homes. Understanding habitats helps us protect them!</p>
        </div>
      </div>
    </div>
  );
};

// Water Conservation Game Component
const WaterConservationGame = () => {
  const [score, setScore] = React.useState(0);
  const [waterLevel, setWaterLevel] = React.useState(100);
  const [leaks, setLeaks] = React.useState([
    { id: 1, x: 25, y: 40, fixed: false, size: 'small' },
    { id: 2, x: 60, y: 30, fixed: false, size: 'medium' },
    { id: 3, x: 80, y: 50, fixed: false, size: 'large' },
    { id: 4, x: 40, y: 70, fixed: false, size: 'small' },
  ]);
  const [gameOver, setGameOver] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const activeLeaks = leaks.filter(leak => !leak.fixed);
      if (activeLeaks.length > 0 && waterLevel > 0) {
        const lossRate = activeLeaks.reduce((total, leak) => {
          return total + (leak.size === 'large' ? 3 : leak.size === 'medium' ? 2 : 1);
        }, 0);
        setWaterLevel(prev => Math.max(0, prev - lossRate));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [leaks, waterLevel]);

  React.useEffect(() => {
    if (waterLevel <= 0) {
      setGameOver(true);
    }
  }, [waterLevel]);

  const fixLeak = (id) => {
    if (gameOver) return;

    setLeaks(leaks.map(leak => {
      if (leak.id === id && !leak.fixed) {
        const points = leak.size === 'large' ? 30 : leak.size === 'medium' ? 20 : 10;
        setScore(score + points);
        return { ...leak, fixed: true };
      }
      return leak;
    }));
  };

  const allFixed = leaks.every(leak => leak.fixed);

  const resetGame = () => {
    setScore(0);
    setWaterLevel(100);
    setGameOver(false);
    setLeaks(leaks.map(leak => ({ ...leak, fixed: false })));
  };

  if (allFixed && !gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-auto text-center shadow-2xl">
          <div className="text-6xl mb-4">💧</div>
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Water Hero!</h2>
          <p className="text-lg mb-4">You saved all the water!</p>
          <p className="text-2xl font-bold text-cyan-600 mb-6">Score: {score}</p>
          <div className="space-y-3">
            <button onClick={resetGame} className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
              Play Again
            </button>
            <Link to="/games" className="block w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors">
              Back to Games
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 to-orange-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-auto text-center shadow-2xl">
          <div className="text-6xl mb-4">💔</div>
          <h2 className="text-3xl font-bold text-red-600 mb-4">Water Crisis!</h2>
          <p className="text-lg mb-4">All the water leaked out!</p>
          <p className="text-2xl font-bold text-orange-600 mb-6">Score: {score}</p>
          <div className="space-y-3">
            <button onClick={resetGame} className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
              Try Again
            </button>
            <Link to="/games" className="block w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors">
              Back to Games
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-cyan-600 p-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">💧 Water Conservation</h1>
          <div className="flex justify-center space-x-8 text-white text-lg">
            <div>Score: <span className="font-bold">{score}</span></div>
            <div>Water: <span className="font-bold">{waterLevel}%</span></div>
          </div>
        </div>

        <div className="relative bg-white rounded-2xl p-8 max-w-4xl mx-auto shadow-2xl" style={{ minHeight: '500px' }}>
          <h2 className="text-2xl font-bold mb-6 text-center">Fix the leaks to save water!</h2>

          {/* Water Level Indicator */}
          <div className="absolute top-4 right-4 w-16 h-32 bg-gray-200 rounded-lg overflow-hidden">
            <div
              className={`w-full transition-all duration-1000 ${waterLevel > 50 ? 'bg-blue-500' : waterLevel > 25 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ height: `${waterLevel}%`, position: 'absolute', bottom: 0 }}
            />
          </div>

          {leaks.map(leak => (
            <button
              key={leak.id}
              onClick={() => fixLeak(leak.id)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full text-2xl transition-all duration-300 ${leak.fixed
                ? 'bg-green-200 opacity-50'
                : 'bg-red-200 hover:bg-red-300 animate-bounce'
                }`}
              style={{ left: `${leak.x}%`, top: `${leak.y}%` }}
            >
              {leak.fixed ? '✅' : '💧'}
            </button>
          ))}
        </div>

        <div className="bg-white bg-opacity-20 rounded-2xl p-6 max-w-2xl mx-auto mt-8 text-white text-center">
          <h3 className="text-xl font-bold mb-2">Save Every Drop!</h3>
          <p>Click on the leaks to fix them before all the water runs out. Water is precious!</p>
        </div>
      </div>
    </div>
  );
};

// Ecosystem Balance Game Component
const EcoSystemBalanceGame = () => {
  const [ecosystem, setEcosystem] = React.useState({
    plants: 5,
    herbivores: 3,
    carnivores: 1,
    water: 80,
    pollution: 20
  });
  const [score, setScore] = React.useState(100);
  const [gameOver, setGameOver] = React.useState(false);
  const [round, setRound] = React.useState(1);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setEcosystem(prev => {
        let newEco = { ...prev };

        // Natural changes
        if (newEco.plants < newEco.herbivores * 2) {
          newEco.herbivores = Math.max(0, newEco.herbivores - 1);
        }
        if (newEco.herbivores < newEco.carnivores) {
          newEco.carnivores = Math.max(0, newEco.carnivores - 1);
        }
        if (newEco.pollution > 50) {
          newEco.plants = Math.max(0, newEco.plants - 1);
        }

        return newEco;
      });

      setRound(prev => prev + 1);

      const balance = Math.abs(ecosystem.plants - ecosystem.herbivores * 2) +
        Math.abs(ecosystem.herbivores - ecosystem.carnivores * 3);

      if (balance > 10 || ecosystem.pollution > 80 || ecosystem.water < 20) {
        setGameOver(true);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [ecosystem]);

  const addToEcosystem = (type) => {
    if (gameOver) return;

    setEcosystem(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));

    if (type === 'plants') setScore(score + 5);
  };

  const removeFromEcosystem = (type) => {
    if (gameOver) return;

    setEcosystem(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] - 1)
    }));
  };

  const resetGame = () => {
    setEcosystem({
      plants: 5,
      herbivores: 3,
      carnivores: 1,
      water: 80,
      pollution: 20
    });
    setScore(100);
    setGameOver(false);
    setRound(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-500 p-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">⚖️ Ecosystem Balance</h1>
          <div className="flex justify-center space-x-8 text-white text-lg">
            <div>Score: <span className="font-bold">{score}</span></div>
            <div>Round: <span className="font-bold">{round}</span></div>
          </div>
        </div>

        {gameOver ? (
          <div className="bg-white rounded-2xl p-8 max-w-md mx-auto text-center shadow-2xl">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-3xl font-bold text-red-600 mb-4">Ecosystem Collapsed!</h2>
            <p className="text-lg mb-4">The balance was disrupted!</p>
            <p className="text-2xl font-bold text-blue-600 mb-6">Final Score: {score}</p>
            <div className="space-y-3">
              <button onClick={resetGame} className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors">
                Try Again
              </button>
              <Link to="/games" className="block w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors">
                Back to Games
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-center">Ecosystem Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-3xl mb-2">🌱</div>
                  <div className="font-bold">Plants: {ecosystem.plants}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🐰</div>
                  <div className="font-bold">Herbivores: {ecosystem.herbivores}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🦁</div>
                  <div className="font-bold">Carnivores: {ecosystem.carnivores}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">💧</div>
                  <div className="font-bold">Water: {ecosystem.water}%</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🏭</div>
                  <div className="font-bold">Pollution: {ecosystem.pollution}%</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-center">Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button onClick={() => addToEcosystem('plants')} className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-colors">
                  <div className="text-2xl mb-2">🌱</div>
                  <div>Plant Trees</div>
                </button>
                <button onClick={() => removeFromEcosystem('pollution')} className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors">
                  <div className="text-2xl mb-2">🧹</div>
                  <div>Clean Up</div>
                </button>
                <button onClick={() => addToEcosystem('water')} className="bg-cyan-500 text-white p-4 rounded-lg hover:bg-cyan-600 transition-colors">
                  <div className="text-2xl mb-2">💧</div>
                  <div>Add Water</div>
                </button>
                <button onClick={() => removeFromEcosystem('carnivores')} className="bg-orange-500 text-white p-4 rounded-lg hover:bg-orange-600 transition-colors">
                  <div className="text-2xl mb-2">🏃</div>
                  <div>Relocate Predator</div>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white bg-opacity-20 rounded-2xl p-6 max-w-2xl mx-auto mt-8 text-white text-center">
          <h3 className="text-xl font-bold mb-2">Keep Nature Balanced!</h3>
          <p>Maintain the ecosystem by managing plants, animals, water, and pollution levels.</p>
        </div>
      </div>
    </div>
  );
};

// Pollution Cleanup Game Component
const PollutionCleanupGame = () => {
  const [score, setScore] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(90);
  const [gameOver, setGameOver] = React.useState(false);
  const [pollutionItems, setPollutionItems] = React.useState([
    { id: 1, type: 'plastic', x: 20, y: 30, emoji: '🥤', cleaned: false },
    { id: 2, type: 'trash', x: 60, y: 40, emoji: '🗑️', cleaned: false },
    { id: 3, type: 'oil', x: 30, y: 70, emoji: '⛽', cleaned: false },
    { id: 4, type: 'smoke', x: 70, y: 20, emoji: '🏭', cleaned: false },
    { id: 5, type: 'plastic', x: 80, y: 60, emoji: '🛍️', cleaned: false },
    { id: 6, type: 'trash', x: 40, y: 50, emoji: '🍕', cleaned: false },
    { id: 7, type: 'oil', x: 15, y: 80, emoji: '🛢️', cleaned: false },
    { id: 8, type: 'smoke', x: 85, y: 35, emoji: '🚗', cleaned: false }
  ]);

  React.useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  const cleanPollution = (id) => {
    if (gameOver) return;

    setPollutionItems(items => items.map(item => {
      if (item.id === id && !item.cleaned) {
        setScore(score + 15);
        return { ...item, cleaned: true };
      }
      return item;
    }));
  };

  const allCleaned = pollutionItems.every(item => item.cleaned);

  const resetGame = () => {
    setScore(0);
    setTimeLeft(90);
    setGameOver(false);
    setPollutionItems(items => items.map(item => ({ ...item, cleaned: false })));
  };

  if (gameOver || allCleaned) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-auto text-center shadow-2xl">
          <div className="text-6xl mb-4">{allCleaned ? '🌍' : '😔'}</div>
          <h2 className="text-3xl font-bold text-green-600 mb-4">
            {allCleaned ? 'Planet Saved!' : 'Time\'s Up!'}
          </h2>
          <p className="text-lg mb-4">
            {allCleaned ? 'You cleaned up all the pollution!' : 'You helped make the planet cleaner!'}
          </p>
          <p className="text-2xl font-bold text-blue-600 mb-6">Score: {score}</p>
          <div className="space-y-3">
            <button onClick={resetGame} className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors">
              Play Again
            </button>
            <Link to="/games" className="block w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors">
              Back to Games
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-600 p-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🧹 Pollution Cleanup</h1>
          <div className="flex justify-center space-x-8 text-white text-lg">
            <div>Score: <span className="font-bold">{score}</span></div>
            <div>Time: <span className="font-bold">{timeLeft}s</span></div>
          </div>
        </div>

        <div className="relative bg-white rounded-2xl p-8 max-w-4xl mx-auto shadow-2xl" style={{ minHeight: '500px' }}>
          <h2 className="text-2xl font-bold mb-6 text-center">Clean up all the pollution!</h2>

          {pollutionItems.map(item => (
            <button
              key={item.id}
              onClick={() => cleanPollution(item.id)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-3 rounded-full text-3xl transition-all duration-300 ${item.cleaned
                ? 'bg-green-200 opacity-50'
                : 'bg-red-200 hover:bg-red-300 animate-pulse shadow-lg'
                }`}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
            >
              {item.cleaned ? '✨' : item.emoji}
            </button>
          ))}
        </div>

        <div className="bg-white bg-opacity-20 rounded-2xl p-6 max-w-2xl mx-auto mt-8 text-white text-center">
          <h3 className="text-xl font-bold mb-2">Save Our Planet!</h3>
          <p>Click on pollution sources to clean them up. Every cleanup action helps restore our environment!</p>
        </div>
      </div>
    </div>
  );
};

// Carbon Footprint Game Component
const CarbonFootprintGame = () => {
  const [totalCarbon, setTotalCarbon] = React.useState(0);
  const [choices, setChoices] = React.useState({
    transport: '',
    energy: '',
    food: '',
    waste: ''
  });
  const [currentCategory, setCurrentCategory] = React.useState('transport');
  const [gameCompleted, setGameCompleted] = React.useState(false);

  const categories = {
    transport: {
      title: 'How do you travel to school?',
      options: [
        { name: 'Walk or Bike', carbon: 0, emoji: '🚶‍♂️' },
        { name: 'Public Bus', carbon: 5, emoji: '🚌' },
        { name: 'Electric Car', carbon: 8, emoji: '🚗' },
        { name: 'Regular Car', carbon: 15, emoji: '🚙' }
      ]
    },
    energy: {
      title: 'What energy do you use at home?',
      options: [
        { name: 'Solar Power', carbon: 2, emoji: '☀️' },
        { name: 'Wind Power', carbon: 3, emoji: '💨' },
        { name: 'Mixed Sources', carbon: 10, emoji: '🏠' },
        { name: 'Coal Power', carbon: 20, emoji: '🏭' }
      ]
    },
    food: {
      title: 'What do you usually eat?',
      options: [
        { name: 'Mostly Plants', carbon: 3, emoji: '🥗' },
        { name: 'Some Meat', carbon: 8, emoji: '🍽️' },
        { name: 'Lots of Meat', carbon: 15, emoji: '🥩' },
        { name: 'Fast Food Daily', carbon: 25, emoji: '🍔' }
      ]
    },
    waste: {
      title: 'How do you handle waste?',
      options: [
        { name: 'Recycle Everything', carbon: 1, emoji: '♻️' },
        { name: 'Recycle Some', carbon: 5, emoji: '🗂️' },
        { name: 'Little Recycling', carbon: 10, emoji: '🗑️' },
        { name: 'No Recycling', carbon: 20, emoji: '🚮' }
      ]
    }
  };

  const categoryOrder = ['transport', 'energy', 'food', 'waste'];

  const makeChoice = (option) => {
    const newChoices = { ...choices, [currentCategory]: option.name };
    setChoices(newChoices);
    setTotalCarbon(totalCarbon + option.carbon);

    const currentIndex = categoryOrder.indexOf(currentCategory);
    if (currentIndex < categoryOrder.length - 1) {
      setCurrentCategory(categoryOrder[currentIndex + 1]);
    } else {
      setGameCompleted(true);
    }
  };

  const resetGame = () => {
    setTotalCarbon(0);
    setChoices({ transport: '', energy: '', food: '', waste: '' });
    setCurrentCategory('transport');
    setGameCompleted(false);
  };

  const getRating = () => {
    if (totalCarbon <= 15) return { level: 'Eco Hero!', color: 'text-green-600', emoji: '🌟' };
    if (totalCarbon <= 30) return { level: 'Good Effort!', color: 'text-yellow-600', emoji: '👍' };
    if (totalCarbon <= 50) return { level: 'Can Improve', color: 'text-orange-600', emoji: '⚠️' };
    return { level: 'High Impact', color: 'text-red-600', emoji: '🚨' };
  };

  if (gameCompleted) {
    const rating = getRating();
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-lg mx-auto text-center shadow-2xl">
          <div className="text-6xl mb-4">{rating.emoji}</div>
          <h2 className={`text-3xl font-bold ${rating.color} mb-4`}>{rating.level}</h2>
          <p className="text-2xl font-bold text-gray-800 mb-6">
            Your Carbon Footprint: {totalCarbon} kg CO₂/day
          </p>

          <div className="text-left mb-6 space-y-2">
            <h3 className="font-bold text-lg mb-3">Your Choices:</h3>
            <div>🚶‍♂️ Transport: {choices.transport}</div>
            <div>⚡ Energy: {choices.energy}</div>
            <div>🍽️ Food: {choices.food}</div>
            <div>♻️ Waste: {choices.waste}</div>
          </div>

          <div className="space-y-3">
            <button onClick={resetGame} className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors">
              Calculate Again
            </button>
            <Link to="/games" className="block w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors">
              Back to Games
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-600 p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🌍 Carbon Footprint Calculator</h1>
          <div className="text-white text-lg">
            Current Total: <span className="font-bold">{totalCarbon} kg CO₂</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <div className="flex justify-between mb-4">
              {categoryOrder.map((cat, index) => (
                <div key={cat} className={`w-1/4 h-2 rounded ${categoryOrder.indexOf(currentCategory) > index ? 'bg-green-500' :
                  categoryOrder.indexOf(currentCategory) === index ? 'bg-blue-500' : 'bg-gray-200'
                  }`} />
              ))}
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-center">
            {categories[currentCategory].title}
          </h2>

          <div className="space-y-4">
            {categories[currentCategory].options.map((option, index) => (
              <button
                key={index}
                onClick={() => makeChoice(option)}
                className="w-full p-4 text-left rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{option.emoji}</span>
                    <span className="font-semibold">{option.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">+{option.carbon} kg CO₂</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white bg-opacity-20 rounded-2xl p-6 mt-8 text-white text-center">
          <h3 className="text-xl font-bold mb-2">Learn About Your Impact!</h3>
          <p>Make choices to calculate your daily carbon footprint and learn how to reduce it.</p>
        </div>
      </div>
    </div>
  );
};

// Activities Page Component
const ActivitiesPage = () => {
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const { t } = useTranslation();

  const activityCategories = [
    { id: 'all', name: 'All Activities', icon: '🌟', color: 'purple' },
    { id: 'indoor', name: 'Indoor Fun', icon: '🏠', color: 'blue' },
    { id: 'outdoor', name: 'Outdoor Adventures', icon: '🌳', color: 'green' },
    { id: 'family', name: 'Family Time', icon: '👨‍👩‍👧‍👦', color: 'orange' },
    { id: 'diy', name: 'DIY Projects', icon: '🛠️', color: 'red' },
    { id: 'science', name: 'Experiments', icon: '🧪', color: 'teal' }
  ];

  const activityImages = {
    1: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=300&fit=crop',
    2: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    3: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    4: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
    5: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    6: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
    7: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=300&fit=crop',
    8: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    9: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=300&fit=crop',
    10: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
    11: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=300&fit=crop',
    12: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400&h=300&fit=crop'
  };

  const activities = React.useMemo(() => {
    const list = t('activitiesList', { returnObjects: true });
    if (!list || typeof list !== 'object' || Array.isArray(list)) return [];

    return Object.keys(list).map(key => ({
      id: parseInt(key),
      ...list[key],
      image: activityImages[key]
    }));
  }, [t]);

  const filteredActivities = selectedCategory === 'all'
    ? activities
    : activities.filter(activity => activity.category === selectedCategory);

  const getCategoryColor = (color) => {
    const colors = {
      purple: 'bg-purple-600 hover:bg-purple-700 border-purple-600',
      blue: 'bg-blue-600 hover:bg-blue-700 border-blue-600',
      green: 'bg-green-600 hover:bg-green-700 border-green-600',
      orange: 'bg-orange-600 hover:bg-orange-700 border-orange-600',
      red: 'bg-red-600 hover:bg-red-700 border-red-600',
      teal: 'bg-teal-600 hover:bg-teal-700 border-teal-600'
    };
    return colors[color] || colors.purple;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-blue-500 to-purple-600">
      <Navbar />
      <div className="container mx-auto px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 text-shadow-lg">🎯 Environmental Activities</h1>
          <p className="text-xl text-white opacity-90 max-w-3xl mx-auto">
            Hands-on activities to explore, learn, and protect our environment. Perfect for curious kids and families!
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {activityCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg ${selectedCategory === category.id
                ? getCategoryColor(category.color) + ' ring-4 ring-white ring-opacity-50'
                : 'bg-white bg-opacity-20 hover:bg-opacity-30 border-2 border-white border-opacity-30'
                }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 group hover:shadow-3xl"
              onMouseEnter={() => {
                // Add sparkle effect on hover
                const card = event.currentTarget;
                card.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 30px rgba(34, 197, 94, 0.3)';
              }}
              onMouseLeave={() => {
                const card = event.currentTarget;
                card.style.boxShadow = '';
              }}
            >
              <div className="relative">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(activity.difficulty)}`}>
                    {activity.difficulty}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{activity.title}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{activity.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    ⏱️ {activity.duration}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    👶 {activity.ageGroup}
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Materials needed:</h4>
                  <div className="flex flex-wrap gap-1">
                    {activity.materials.slice(0, 3).map((material, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {material}
                      </span>
                    ))}
                    {activity.materials.length > 3 && (
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        +{activity.materials.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <details className="mb-4 group">
                  <summary className="cursor-pointer font-semibold text-blue-600 hover:text-blue-800 transition-all duration-200 flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-50">
                    <span className="transform group-open:rotate-90 transition-transform duration-200">▶️</span>
                    <span>View Instructions</span>
                    <span className="text-yellow-500 animate-bounce">✨</span>
                  </summary>
                  <ol className="mt-2 space-y-1 text-sm text-gray-600">
                    {activity.instructions.map((step, index) => (
                      <li key={index} className="flex">
                        <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </details>

                <Link
                  to={`/activities/${activity.id}`}
                  className="block w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 text-center"
                  onClick={() => {
                    // Fun click sound effect (visual feedback)
                    const button = event.target;
                    button.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                      button.style.transform = 'scale(1.05)';
                    }, 100);
                  }}
                >
                  Start Activity! 🌟
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* No activities message */}
        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white text-xl">No activities found in this category. Try selecting a different category!</p>
          </div>
        )}

        {/* Bottom CTA with Animations */}
        <div className="bg-white bg-opacity-20 rounded-2xl p-8 mt-12 text-center relative overflow-hidden">
          {/* Floating Animation Elements */}
          <div className="absolute top-4 left-4 text-yellow-300 animate-bounce delay-100">⭐</div>
          <div className="absolute top-8 right-8 text-green-300 animate-pulse delay-200">🌱</div>
          <div className="absolute bottom-4 left-8 text-blue-300 animate-bounce delay-300">💧</div>
          <div className="absolute bottom-8 right-4 text-purple-300 animate-pulse delay-400">🦋</div>

          <h3 className="text-2xl font-bold text-white mb-4">🌟 Ready to Make a Difference?</h3>
          <p className="text-white opacity-90 mb-6">
            These activities help you learn about the environment while having fun. Share your completed projects with friends and family!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/games"
              className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg transform hover:scale-105 hover:shadow-xl"
              onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3), 0 0 20px rgba(147, 51, 234, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = '';
              }}
            >
              🎮 Play Games
            </Link>
            <Link
              to="/topics"
              className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-all duration-300 shadow-lg transform hover:scale-105 hover:shadow-xl"
              onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3), 0 0 20px rgba(147, 51, 234, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = '';
              }}
            >
              📚 Learn Topics
            </Link>
          </div>

          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Little Kids Page Component
const LittleKidsPage = () => {
  const [selectedActivity, setSelectedActivity] = React.useState(null);

  const kidActivities = [
    {
      id: 1,
      title: "Coloring Pages",
      description: "Fun environmental coloring pages for little hands",
      icon: "🖍️",
      color: "bg-pink-400",
      content: [
        { name: "Happy Earth", image: "🌍", description: "Color our beautiful planet!", link: "/little-kids/coloring/earth" },
        { name: "Friendly Animals", image: "🦋", description: "Color cute forest friends!", link: "/little-kids/coloring/butterfly" },
        { name: "Clean Ocean", image: "🌊", description: "Color fish and sea creatures!", link: "/little-kids/coloring/ocean" },
        { name: "Green Trees", image: "🌳", description: "Color a magical forest!", link: "/little-kids/coloring/tree" }
      ]
    },
    {
      id: 2,
      title: "Environmental Songs",
      description: "Catchy songs about taking care of nature",
      icon: "🎵",
      color: "bg-blue-400",
      content: [
        { name: "Earth is Our Home", image: "🏠", description: "Sing about our planet!" },
        { name: "Recycle Song", image: "♻️", description: "Learn to reduce, reuse, recycle!" },
        { name: "Animal Friends", image: "🐻", description: "Songs about wildlife!" },
        { name: "Clean Water", image: "💧", description: "Keep our water clean!" }
      ]
    },
    {
      id: 3,
      title: "Simple Games",
      description: "Easy games for tiny environmental heroes",
      icon: "🎮",
      color: "bg-green-400",
      content: [
        { name: "Match the Animals", image: "🦆", description: "Match animals to their homes!", link: "/games/animal-habitat" },
        { name: "Sort the Trash", image: "🗑️", description: "Help clean up!", link: "/games/recycling-sort" },
        { name: "Find Hidden Objects", image: "🔍", description: "Find nature items!" },
        { name: "Memory Match", image: "🧠", description: "Remember the animals!", link: "/games/ocean-memory" }
      ]
    },
    {
      id: 4,
      title: "Story Time",
      description: "Environmental stories for bedtime and playtime",
      icon: "📚",
      color: "bg-purple-400",
      content: [
        { name: "Captain Planet's Adventure", image: "🌟", description: "A hero saves the day!" },
        { name: "The Little Seed", image: "🌱", description: "Watch a plant grow!" },
        { name: "Ocean Friends", image: "🐠", description: "Animals help each other!" },
        { name: "Clean Air Heroes", image: "💨", description: "Kids make air cleaner!" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-green-300 to-blue-300">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header with cute styling */}
        <div className="text-center mb-12">
          <div className="text-8xl mb-4">🐸</div>
          <h1 className="text-6xl font-bold text-green-700 mb-4 font-comic">Little Kids Zone!</h1>
          <p className="text-2xl text-green-600 max-w-2xl mx-auto font-comic">
            Fun activities, songs, and games just for our youngest environmental heroes!
          </p>
        </div>

        {/* Back to main site button */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            🏠 Back to Main Site
          </Link>
        </div>

        {/* Activity Selection */}
        {!selectedActivity ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {kidActivities.map((activity) => (
              <button
                key={activity.id}
                onClick={() => setSelectedActivity(activity)}
                className={`${activity.color} p-8 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 text-white`}
              >
                <div className="text-6xl mb-4">{activity.icon}</div>
                <h2 className="text-3xl font-bold mb-4 font-comic">{activity.title}</h2>
                <p className="text-lg font-comic">{activity.description}</p>
              </button>
            ))}
          </div>
        ) : (
          /* Activity Detail View */
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <button
                onClick={() => setSelectedActivity(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg transform hover:scale-105 transition-all duration-200 mb-4"
              >
                ← Back to Activities
              </button>
              <h2 className="text-4xl font-bold text-green-700 mb-4 font-comic">
                {selectedActivity.icon} {selectedActivity.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {selectedActivity.content.map((item, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="text-5xl mb-4 text-center">{item.image}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 text-center font-comic">{item.name}</h3>
                  <p className="text-gray-600 text-center mb-4 font-comic">{item.description}</p>
                  {item.link ? (
                    <Link
                      to={item.link}
                      className="block w-full bg-green-400 hover:bg-green-500 text-white py-2 rounded-lg font-bold text-center transition-colors"
                    >
                      Play Now! 🎮
                    </Link>
                  ) : (
                    <button className="w-full bg-blue-400 hover:bg-blue-500 text-white py-2 rounded-lg font-bold transition-colors">
                      Coming Soon! ✨
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fun facts for little kids */}
        <div className="bg-white bg-opacity-80 rounded-3xl p-8 mt-12 max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-green-700 mb-6 font-comic">🌟 Did You Know?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-lg">
            <div className="bg-yellow-200 p-4 rounded-2xl">
              <div className="text-3xl mb-2">🌳</div>
              <p className="font-comic">Trees give us oxygen to breathe!</p>
            </div>
            <div className="bg-blue-200 p-4 rounded-2xl">
              <div className="text-3xl mb-2">🐝</div>
              <p className="font-comic">Bees help flowers grow!</p>
            </div>
            <div className="bg-green-200 p-4 rounded-2xl">
              <div className="text-3xl mb-2">♻️</div>
              <p className="font-comic">We can reuse old things!</p>
            </div>
          </div>
        </div>

        {/* Encourage parent involvement */}
        <div className="text-center mt-12 bg-orange-200 rounded-3xl p-8 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-orange-700 mb-4 font-comic">👨‍👩‍👧‍👦 For Parents</h3>
          <p className="text-lg text-orange-600 font-comic">
            These activities are designed for ages 3-7. Adult supervision and participation makes learning even more fun!
          </p>
        </div>
      </div>
    </div>
  );
};

// Interactive Coloring Page Component
const ColoringPage = ({ coloringData }) => {
  const [selectedColor, setSelectedColor] = React.useState('#ff6b6b');
  const [coloredParts, setColoredParts] = React.useState({});

  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
    '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
    '#10ac84', '#ee5a24', '#0abde3', '#3742fa', '#2f3542'
  ];

  const colorPart = (partId) => {
    setColoredParts({
      ...coloredParts,
      [partId]: selectedColor
    });
  };

  const resetColoring = () => {
    setColoredParts({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/little-kids"
            className="inline-block bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-full font-bold mb-4 transform hover:scale-105 transition-all duration-200"
          >
            ← Back to Little Kids
          </Link>
          <h1 className="text-4xl font-bold text-purple-700 mb-4">🖍️ {coloringData.title}</h1>
          <p className="text-lg text-purple-600">{coloringData.description}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          {/* Coloring Canvas */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{coloringData.name}</h2>
                <div className="relative inline-block">
                  {/* SVG Coloring Area */}
                  <svg width="400" height="400" viewBox="0 0 400 400" className="border-4 border-gray-200 rounded-2xl">
                    {coloringData.type === 'earth' && (
                      <>
                        {/* Earth Coloring Template */}
                        <circle
                          cx="200" cy="200" r="150"
                          fill={coloredParts.ocean || '#e3f2fd'}
                          stroke="#333" strokeWidth="3"
                          onClick={() => colorPart('ocean')}
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                        />
                        <path
                          d="M 100 150 Q 150 100 200 150 Q 250 100 300 150 Q 280 200 200 180 Q 120 200 100 150 Z"
                          fill={coloredParts.land1 || '#c8e6c9'}
                          stroke="#333" strokeWidth="2"
                          onClick={() => colorPart('land1')}
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                        />
                        <path
                          d="M 120 250 Q 180 220 240 250 Q 280 280 200 300 Q 120 280 120 250 Z"
                          fill={coloredParts.land2 || '#c8e6c9'}
                          stroke="#333" strokeWidth="2"
                          onClick={() => colorPart('land2')}
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                        />
                        <circle cx="170" cy="170" r="8" fill={coloredParts.cloud1 || 'white'} onClick={() => colorPart('cloud1')} className="cursor-pointer hover:opacity-80" />
                        <circle cx="230" cy="180" r="10" fill={coloredParts.cloud2 || 'white'} onClick={() => colorPart('cloud2')} className="cursor-pointer hover:opacity-80" />
                        <circle cx="250" cy="160" r="6" fill={coloredParts.cloud3 || 'white'} onClick={() => colorPart('cloud3')} className="cursor-pointer hover:opacity-80" />
                      </>
                    )}

                    {coloringData.type === 'butterfly' && (
                      <>
                        {/* Butterfly Coloring Template */}
                        <ellipse cx="200" cy="200" rx="4" ry="80" fill={coloredParts.body || '#8d6e63'} stroke="#333" strokeWidth="2" onClick={() => colorPart('body')} className="cursor-pointer hover:opacity-80" />
                        <path d="M 160 150 Q 120 120 140 180 Q 160 200 200 180 Z" fill={coloredParts.wing1 || '#ffcdd2'} stroke="#333" strokeWidth="2" onClick={() => colorPart('wing1')} className="cursor-pointer hover:opacity-80" />
                        <path d="M 240 150 Q 280 120 260 180 Q 240 200 200 180 Z" fill={coloredParts.wing2 || '#ffcdd2'} stroke="#333" strokeWidth="2" onClick={() => colorPart('wing2')} className="cursor-pointer hover:opacity-80" />
                        <path d="M 160 220 Q 120 250 140 200 Q 160 180 200 200 Z" fill={coloredParts.wing3 || '#e1bee7'} stroke="#333" strokeWidth="2" onClick={() => colorPart('wing3')} className="cursor-pointer hover:opacity-80" />
                        <path d="M 240 220 Q 280 250 260 200 Q 240 180 200 200 Z" fill={coloredParts.wing4 || '#e1bee7'} stroke="#333" strokeWidth="2" onClick={() => colorPart('wing4')} className="cursor-pointer hover:opacity-80" />
                        <circle cx="195" cy="140" r="3" fill={coloredParts.antenna1 || '#333'} onClick={() => colorPart('antenna1')} className="cursor-pointer" />
                        <circle cx="205" cy="140" r="3" fill={coloredParts.antenna2 || '#333'} onClick={() => colorPart('antenna2')} className="cursor-pointer" />
                      </>
                    )}

                    {coloringData.type === 'tree' && (
                      <>
                        {/* Tree Coloring Template */}
                        <rect x="180" y="250" width="40" height="100" fill={coloredParts.trunk || '#8d6e63'} stroke="#333" strokeWidth="2" onClick={() => colorPart('trunk')} className="cursor-pointer hover:opacity-80" />
                        <circle cx="200" cy="200" r="60" fill={coloredParts.leaves1 || '#c8e6c9'} stroke="#333" strokeWidth="2" onClick={() => colorPart('leaves1')} className="cursor-pointer hover:opacity-80" />
                        <circle cx="170" cy="180" r="40" fill={coloredParts.leaves2 || '#c8e6c9'} stroke="#333" strokeWidth="2" onClick={() => colorPart('leaves2')} className="cursor-pointer hover:opacity-80" />
                        <circle cx="230" cy="180" r="40" fill={coloredParts.leaves3 || '#c8e6c9'} stroke="#333" strokeWidth="2" onClick={() => colorPart('leaves3')} className="cursor-pointer hover:opacity-80" />
                        <circle cx="190" cy="160" r="25" fill={coloredParts.leaves4 || '#c8e6c9'} stroke="#333" strokeWidth="2" onClick={() => colorPart('leaves4')} className="cursor-pointer hover:opacity-80" />
                        <circle cx="210" cy="160" r="25" fill={coloredParts.leaves5 || '#c8e6c9'} stroke="#333" strokeWidth="2" onClick={() => colorPart('leaves5')} className="cursor-pointer hover:opacity-80" />
                        {/* Apples */}
                        <circle cx="170" cy="170" r="8" fill={coloredParts.apple1 || '#ffcdd2'} stroke="#333" strokeWidth="1" onClick={() => colorPart('apple1')} className="cursor-pointer hover:opacity-80" />
                        <circle cx="220" cy="190" r="8" fill={coloredParts.apple2 || '#ffcdd2'} stroke="#333" strokeWidth="1" onClick={() => colorPart('apple2')} className="cursor-pointer hover:opacity-80" />
                        <circle cx="200" cy="180" r="8" fill={coloredParts.apple3 || '#ffcdd2'} stroke="#333" strokeWidth="1" onClick={() => colorPart('apple3')} className="cursor-pointer hover:opacity-80" />
                      </>
                    )}

                    {coloringData.type === 'ocean' && (
                      <>
                        {/* Ocean Scene Coloring Template */}
                        <rect x="0" y="0" width="400" height="200" fill={coloredParts.sky || '#e3f2fd'} onClick={() => colorPart('sky')} className="cursor-pointer hover:opacity-80" />
                        <rect x="0" y="200" width="400" height="200" fill={coloredParts.water || '#b3e5fc'} onClick={() => colorPart('water')} className="cursor-pointer hover:opacity-80" />
                        {/* Fish */}
                        <ellipse cx="100" cy="280" rx="30" ry="15" fill={coloredParts.fish1 || '#ffab91'} stroke="#333" strokeWidth="2" onClick={() => colorPart('fish1')} className="cursor-pointer hover:opacity-80" />
                        <polygon points="70,280 50,270 50,290" fill={coloredParts.fishtail1 || '#ffab91'} stroke="#333" strokeWidth="1" onClick={() => colorPart('fishtail1')} className="cursor-pointer hover:opacity-80" />
                        <ellipse cx="300" cy="320" rx="25" ry="12" fill={coloredParts.fish2 || '#ffcc02'} stroke="#333" strokeWidth="2" onClick={() => colorPart('fish2')} className="cursor-pointer hover:opacity-80" />
                        <polygon points="275,320 260,312 260,328" fill={coloredParts.fishtail2 || '#ffcc02'} stroke="#333" strokeWidth="1" onClick={() => colorPart('fishtail2')} className="cursor-pointer hover:opacity-80" />
                        {/* Seaweed */}
                        <path d="M 50 400 Q 60 350 50 300 Q 40 250 50 200" fill="none" stroke={coloredParts.seaweed1 || '#4caf50'} strokeWidth="6" onClick={() => colorPart('seaweed1')} className="cursor-pointer hover:opacity-80" />
                        <path d="M 350 400 Q 340 350 350 300 Q 360 250 350 200" fill="none" stroke={coloredParts.seaweed2 || '#4caf50'} strokeWidth="6" onClick={() => colorPart('seaweed2')} className="cursor-pointer hover:opacity-80" />
                        {/* Sun */}
                        <circle cx="350" cy="50" r="30" fill={coloredParts.sun || '#ffd54f'} stroke="#333" strokeWidth="2" onClick={() => colorPart('sun')} className="cursor-pointer hover:opacity-80" />
                      </>
                    )}
                  </svg>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={resetColoring}
                  className="bg-red-400 hover:bg-red-500 text-white px-6 py-2 rounded-full font-bold transform hover:scale-105 transition-all duration-200"
                >
                  🔄 Reset Colors
                </button>
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div className="lg:w-64">
            <div className="bg-white rounded-3xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">🎨 Choose Your Colors!</h3>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-12 h-12 rounded-full border-4 transition-all duration-200 transform hover:scale-110 ${selectedColor === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                      }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 mb-2">Selected Color:</p>
                <div
                  className="w-16 h-16 rounded-full border-4 border-gray-300 mx-auto"
                  style={{ backgroundColor: selectedColor }}
                />
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-500 mb-4">Click on the picture parts to color them!</p>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <p className="text-xs text-yellow-700 font-bold">💡 Tip: Try different color combinations to make your picture unique!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Activity Router Component
const ActivityRouter = () => {
  const { id } = useParams();

  const activities = [
    {
      id: 1,
      title: 'Make a Bird Feeder',
      description: 'Create a simple bird feeder using recycled materials and observe local wildlife',
      image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=300&fit=crop',
      category: 'diy',
      difficulty: 'Easy',
      duration: '30 mins',
      materials: ['Plastic bottle', 'Seeds', 'String', 'Scissors'],
      ageGroup: '6-12 years',
      instructions: [
        'Clean an empty plastic bottle thoroughly with soap and water',
        'Cut small holes around the bottle for birds to access seeds',
        'Fill the bottle with bird seeds of your choice',
        'Make holes at the top and thread string for hanging',
        'Hang outside in a safe spot and observe which birds visit!'
      ]
    },
    {
      id: 2,
      title: 'Start a Herb Garden',
      description: 'Grow your own herbs on a windowsill and learn about sustainable food',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
      category: 'indoor',
      difficulty: 'Easy',
      duration: '45 mins setup',
      materials: ['Small pots', 'Soil', 'Herb seeds', 'Water'],
      ageGroup: '4-14 years',
      instructions: [
        'Choose easy herbs like basil, mint, or parsley to start',
        'Fill small pots with quality potting soil',
        'Plant seeds according to packet instructions',
        'Place pots in a sunny window that gets 4-6 hours of sunlight',
        'Water regularly and watch them grow into delicious herbs!'
      ]
    },
    {
      id: 3,
      title: 'Nature Scavenger Hunt',
      description: 'Explore your local area and discover different plants, animals, and natural objects',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
      category: 'outdoor',
      difficulty: 'Easy',
      duration: '60 mins',
      materials: ['Checklist', 'Magnifying glass', 'Collection bag'],
      ageGroup: '5-15 years',
      instructions: [
        'Create a list of items to find (different colored leaves, smooth rocks, flowers)',
        'Go to a local park or nature area with an adult',
        'Search for items on your list carefully and quietly',
        'Take photos instead of picking flowers to protect plants',
        'Discuss what you found with family and research unknown plants'
      ]
    }
  ];

  const activity = activities.find(a => a.id === parseInt(id));

  if (!activity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Activity Not Found</h1>
          <Link to="/activities" className="bg-white text-orange-600 px-6 py-3 rounded-full font-bold">
            Back to Activities
          </Link>
        </div>
      </div>
    );
  }

  return <ActivityDetailPage activityData={activity} />;
};

// Individual Activity Page Component
const ActivityDetailPage = ({ activityData }) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [completedSteps, setCompletedSteps] = React.useState([]);
  const [showCelebration, setShowCelebration] = React.useState(false);
  const [timer, setTimer] = React.useState(0);
  const [isTimerRunning, setIsTimerRunning] = React.useState(false);

  React.useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(timer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const markStepComplete = (stepIndex) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
      if (stepIndex === activityData.instructions.length - 1) {
        setShowCelebration(true);
        setIsTimerRunning(false);
        setTimeout(() => setShowCelebration(false), 3000);
      }
    }
  };

  const startActivity = () => {
    setIsTimerRunning(true);
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  const resetActivity = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    setTimer(0);
    setIsTimerRunning(false);
    setShowCelebration(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-400 to-purple-500">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/activities"
            className="inline-block bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-full font-bold mb-6 transform hover:scale-105 transition-all duration-200"
          >
            ← Back to Activities
          </Link>
          <h1 className="text-5xl font-bold text-white mb-4">{activityData.title}</h1>
          <p className="text-xl text-white opacity-90 max-w-2xl mx-auto">{activityData.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Activity Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-2xl mb-6">
              <img
                src={activityData.image}
                alt={activityData.title}
                className="w-full h-48 object-cover rounded-2xl mb-4"
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    ⏱️ {activityData.duration}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    👶 {activityData.ageGroup}
                  </span>
                </div>

                <div className="bg-purple-50 p-4 rounded-2xl">
                  <h3 className="font-bold text-purple-800 mb-2">📋 Materials Needed:</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {activityData.materials.map((material, index) => (
                      <div key={index} className="bg-white p-2 rounded-lg text-sm text-gray-700 text-center">
                        {material}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timer */}
                <div className="bg-yellow-50 p-4 rounded-2xl text-center">
                  <h3 className="font-bold text-yellow-800 mb-2">⏰ Activity Timer</h3>
                  <div className="text-3xl font-bold text-yellow-600 mb-2">{formatTime(timer)}</div>
                  <div className="space-x-2">
                    <button
                      onClick={startActivity}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                    >
                      {isTimerRunning ? '🔄 Restart' : '▶️ Start'}
                    </button>
                    <button
                      onClick={resetActivity}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                    >
                      🔄 Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">📝 Step-by-Step Instructions</h2>

              <div className="space-y-4">
                {activityData.instructions.map((instruction, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 ${completedSteps.includes(index)
                      ? 'bg-green-100 border-green-300'
                      : currentStep === index
                        ? 'bg-blue-100 border-blue-300'
                        : 'bg-gray-50 border-gray-200'
                      }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${completedSteps.includes(index)
                        ? 'bg-green-500'
                        : currentStep === index
                          ? 'bg-blue-500'
                          : 'bg-gray-400'
                        }`}>
                        {completedSteps.includes(index) ? '✓' : index + 1}
                      </div>

                      <div className="flex-1">
                        <p className="text-lg text-gray-800 mb-3">{instruction}</p>

                        {!completedSteps.includes(index) && (
                          <button
                            onClick={() => markStepComplete(index)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold transform hover:scale-105 transition-all duration-200"
                          >
                            Mark Complete ✓
                          </button>
                        )}

                        {completedSteps.includes(index) && (
                          <div className="text-green-600 font-bold">
                            ✅ Completed! Great job!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mt-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-gray-600">Progress</span>
                  <span className="text-sm font-bold text-gray-600">
                    {completedSteps.length}/{activityData.instructions.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${(completedSteps.length / activityData.instructions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Celebration Modal */}
        {showCelebration && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md mx-auto text-center transform animate-bounce">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-green-600 mb-4">Awesome Job!</h2>
              <p className="text-lg text-gray-600 mb-4">
                You completed the {activityData.title} activity!
              </p>
              <p className="text-xl font-bold text-blue-600">
                Time: {formatTime(timer)}
              </p>
              <div className="mt-6 space-x-4">
                <Link
                  to="/activities"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-bold transition-colors"
                >
                  Try Another Activity
                </Link>
                <button
                  onClick={resetActivity}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-bold transition-colors"
                >
                  Do It Again!
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Fun Tips */}
        <div className="bg-white bg-opacity-20 rounded-3xl p-8 mt-8 max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-white mb-4">🌟 Fun Tips!</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
            <div className="bg-white bg-opacity-20 p-4 rounded-2xl">
              <div className="text-2xl mb-2">📸</div>
              <p>Take photos of your progress to share with family!</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-2xl">
              <div className="text-2xl mb-2">🤝</div>
              <p>Ask friends or family to help make it more fun!</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-2xl">
              <div className="text-2xl mb-2">🌱</div>
              <p>Think about how this helps our environment!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Environmental Games page with categories and games
const GamesPage = () => {
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const gameCategories = [
    { id: 'all', name: 'View All', icon: '🎮', color: 'purple' },
    { id: 'quiz', name: 'Eco Quizzes', icon: '🧠', color: 'blue' },
    { id: 'puzzle', name: 'Green Puzzles', icon: '🧩', color: 'green' },
    { id: 'memory', name: 'Memory Games', icon: '🃏', color: 'pink' },
    { id: 'adventure', name: 'Eco Adventures', icon: '🌍', color: 'orange' },
    { id: 'simulation', name: 'Simulations', icon: '🎲', color: 'teal' }
  ];

  const games = [
    {
      id: 1,
      title: 'Climate Change Quest',
      description: 'Learn about global warming through an interactive adventure',
      image: 'https://images.unsplash.com/photo-1569163139394-de44cb5894ab?w=400&h=300&fit=crop',
      category: 'adventure',
      difficulty: 'Intermediate',
      duration: '15 mins',
      players: '1-4',
      url: '/games/climate-quest'
    },
    {
      id: 2,
      title: 'Recycling Sorting Challenge',
      description: 'Sort waste items into the correct recycling bins',
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop',
      category: 'puzzle',
      difficulty: 'Beginner',
      duration: '8 mins',
      players: '1',
      url: '/games/recycling-sort'
    },
    {
      id: 3,
      title: 'Ocean Life Memory Match',
      description: 'Match marine animals and learn about ocean conservation',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
      category: 'memory',
      difficulty: 'Beginner',
      duration: '10 mins',
      players: '1',
      url: '/games/ocean-memory'
    },
    {
      id: 4,
      title: 'Energy Saver Challenge',
      description: 'Turn off lights and appliances to save energy and protect the environment',
      image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=300&fit=crop',
      category: 'puzzle',
      difficulty: 'Beginner',
      duration: '5 mins',
      players: '1',
      url: '/games/energy-saver'
    },
    {
      id: 5,
      title: 'Ecosystem Balance',
      description: 'Maintain the delicate balance of nature in this strategy simulation',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
      category: 'simulation',
      difficulty: 'Advanced',
      duration: '15 mins',
      players: '1',
      url: '/games/ecosystem-balance'
    },
    {
      id: 6,
      title: 'Animal Habitat Match',
      description: 'Match animals with their natural homes and learn about biodiversity',
      image: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400&h=300&fit=crop',
      category: 'puzzle',
      difficulty: 'Beginner',
      duration: '8 mins',
      players: '1',
      url: '/games/animal-habitat'
    },
    {
      id: 7,
      title: 'Water Conservation Hero',
      description: 'Fix leaks and save precious water resources before they run out',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=300&fit=crop',
      category: 'adventure',
      difficulty: 'Intermediate',
      duration: '10 mins',
      players: '1',
      url: '/games/water-conservation'
    },
    {
      id: 8,
      title: 'Carbon Footprint Calculator',
      description: 'Interactive quiz to calculate and reduce your carbon footprint',
      image: 'https://images.unsplash.com/photo-1569163139394-de44cb5894ab?w=400&h=300&fit=crop',
      category: 'quiz',
      difficulty: 'Intermediate',
      duration: '12 mins',
      players: '1',
      url: '/games/carbon-footprint'
    },
    {
      id: 9,
      title: 'Pollution Cleanup Mission',
      description: 'Clean up environmental pollution and restore natural beauty',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
      category: 'adventure',
      difficulty: 'Intermediate',
      duration: '7 mins',
      players: '1',
      url: '/games/pollution-cleanup'
    }
  ];

  const filteredGames = selectedCategory === 'all'
    ? games
    : games.filter(game => game.category === selectedCategory);

  const getCategoryColor = (color) => {
    const colors = {
      purple: 'bg-purple-600 hover:bg-purple-700 border-purple-600',
      blue: 'bg-blue-600 hover:bg-blue-700 border-blue-600',
      green: 'bg-green-600 hover:bg-green-700 border-green-600',
      pink: 'bg-pink-600 hover:bg-pink-700 border-pink-600',
      orange: 'bg-orange-600 hover:bg-orange-700 border-orange-600',
      teal: 'bg-teal-600 hover:bg-teal-700 border-teal-600'
    };
    return colors[color] || colors.purple;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-green-600">
      <Navbar />
      <div className="container mx-auto px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 text-shadow-lg">🎮 Environmental Games</h1>
          <p className="text-xl text-white opacity-90 max-w-3xl mx-auto">
            Learn about the environment through fun and interactive games. Play, explore, and become an environmental champion!
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {gameCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg border-2 text-white font-semibold transition-all duration-300 ${selectedCategory === category.id
                ? `${getCategoryColor(category.color)} transform scale-105`
                : 'bg-white bg-opacity-20 hover:bg-opacity-30 border-white border-opacity-50'
                }`}
            >
              <span className="text-xl">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="relative">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(game.difficulty)}`}>
                    {game.difficulty}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{game.title}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{game.description}</p>

                <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {game.duration}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    {game.players} players
                  </span>
                </div>

                <Link
                  to={game.url}
                  className="block w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold py-3 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 text-center"
                >
                  Play Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-4">🌟 More Games Coming Soon!</h3>
            <p className="text-white opacity-90 mb-6">
              We're constantly developing new environmental games to make learning fun and engaging.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                ← Back to Home
              </Link>
              <Link
                to="/topics"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                Explore Topics →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced placeholder components with images (for other pages)
const SimplePage = ({ title, emoji, description, imageUrl }) => (
  <div className="min-h-screen bg-gray-50">
    <div className="container mx-auto px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">{emoji} {title}</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">{description}</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-64 object-cover"
        />
        <div className="p-8">
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-2xl">🚧</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  This section is under development. We're working hard to bring you amazing {title.toLowerCase()} content!
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-2">📖</div>
              <h3 className="font-semibold">Rich Content</h3>
              <p className="text-sm text-gray-600">Comprehensive learning materials</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold">Interactive</h3>
              <p className="text-sm text-gray-600">Engaging activities and exercises</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-2">🏆</div>
              <h3 className="font-semibold">Achievements</h3>
              <p className="text-sm text-gray-600">Track your progress and earn badges</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  const dispatch = useDispatch();
  const { user, isLoading, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <div className="text-xl text-gray-700 mt-4">Loading EcoKids...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SimpleHome />} />
        <Route path="/topics" element={<TopicsPage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/experiments" element={<SimpleExperimentsPage />} />
        <Route path="/quizzes" element={<QuizList />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/activities/:id" element={<ActivityDetailPage />} />
        <Route path="/little-kids" element={<LittleKidsPage />} />
        <Route path="/little-kids/coloring" element={<ColoringPage />} />
        <Route path="/little-kids/coloring/:template" element={<ColoringPage />} />

        <Route path="/games/recycling-sort" element={<RecyclingSortGame />} />
        <Route path="/games/ocean-memory" element={<OceanMemoryGame />} />
        <Route path="/games/climate-quest" element={<ClimateQuestGame />} />
        <Route path="/games/energy-saver" element={<EnergySaverGame />} />
        <Route path="/games/animal-habitat" element={<AnimalHabitatGame />} />
        <Route path="/games/water-conservation" element={<WaterConservationGame />} />
        <Route path="/games/eco-balance" element={<EcoSystemBalanceGame />} />
        <Route path="/games/pollution-cleanup" element={<PollutionCleanupGame />} />
        <Route path="/games/carbon-footprint" element={<CarbonFootprintGame />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/student-dashboard"
          element={
            isAuthenticated && user?.role === 'student' ?
              <StudentDashboard /> :
              <SimpleHome />
          }
        />
        <Route
          path="/teacher-dashboard"
          element={
            isAuthenticated && user?.role === 'teacher' ?
              <TeacherDashboard /> :
              <SimpleHome />
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            isAuthenticated && user?.role === 'admin' ?
              <AdminDashboard /> :
              <SimpleHome />
          }
        />

        {/* Fallback Route */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
                  <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
                  <Link to="/" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                    Go Home 🏠
                  </Link>
                </div>
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;