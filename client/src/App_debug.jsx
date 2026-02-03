import React, { useEffect, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// i18n initialization
import './i18n';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/Profile';
import Topics from './pages/Topics';
import TopicDetail from './pages/TopicDetail';
import GamesPage from './pages/GamesPage';
import GameDetail from './pages/GameDetail';
import ExperimentsPage from './pages/ExperimentsPage';
import ExperimentDetail from './pages/ExperimentDetail';
import QuizList from './pages/QuizList';
import QuizTaker from './pages/QuizTaker';
import ProfileGamification from './pages/ProfileGamification';
import Leaderboard from './pages/Leaderboard';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import NotFound from './pages/NotFound';

// Redux actions
import { loadUser } from './store/slices/authSlice';

function App() {
  // Temporary debug version
  return (
    <div className="App">
      <h1 style={{color: 'red', fontSize: '24px', padding: '20px'}}>EcoKids India Debug - App is Loading!</h1>
      <p style={{padding: '20px'}}>If you see this, React is working.</p>
    </div>
  );
}

export default App;