import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUser,
  FaEdit,
  FaSave,
  FaTimes,
  FaTrophy,
  FaMedal,
  FaChartLine,
  FaCalendar,
  FaSchool,
  FaMapMarkerAlt,
  FaCamera,
  FaEye,
  FaEyeSlash,
  FaCertificate,
  FaGamepad,
  FaFlask,
  FaQuestionCircle,
  FaFire,
  FaStar,
  FaDownload,
  FaShare
} from 'react-icons/fa';
import { addToast } from '../store/slices/uiSlice';
import { updateProfile } from '../store/slices/authSlice';
import { apiRequest } from '../utils/api';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [profileStats, setProfileStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [achievements, setAchievements] = useState({
    badges: [],
    certificates: [],
    recentPoints: []
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      setEditedProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        profile: {
          grade: user.profile?.grade || '',
          school: user.profile?.school || '',
          city: user.profile?.city || '',
          state: user.profile?.state || '',
          bio: user.profile?.bio || ''
        }
      });
      fetchProfileData();
    }
  }, [isAuthenticated, user]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [statsRes, activityRes, gamificationRes] = await Promise.all([
        apiRequest('/users/profile/stats'),
        apiRequest('/users/profile/activity'),
        apiRequest('/gamification/me')
      ]);

      setProfileStats(statsRes.data);
      setRecentActivity(activityRes.data);
      setAchievements({
        badges: gamificationRes.data.badges || [],
        certificates: gamificationRes.data.certificates || [],
        recentPoints: gamificationRes.data.recentPoints || []
      });
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setEditedProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setEditedProfile(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(editedProfile)
      });

      dispatch(updateProfile(response.data));
      dispatch(addToast({
        type: 'success',
        message: 'Profile updated successfully!'
      }));
      setEditMode(false);
    } catch (error) {
      dispatch(addToast({
        type: 'error',
        message: error.message || 'Failed to update profile'
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedProfile({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      profile: {
        grade: user.profile?.grade || '',
        school: user.profile?.school || '',
        city: user.profile?.city || '',
        state: user.profile?.state || '',
        bio: user.profile?.bio || ''
      }
    });
    setEditMode(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Avatar Section */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {user.profile?.avatar ? (
                  <img
                    src={user.profile.avatar}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`
                )}
              </div>
              <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors">
                <FaCamera />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center lg:text-left">
              {editMode ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={editedProfile.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="First Name"
                      className="input"
                    />
                    <input
                      type="text"
                      value={editedProfile.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Last Name"
                      className="input"
                    />
                  </div>
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Email"
                    className="input w-full"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                      value={editedProfile.profile.grade}
                      onChange={(e) => handleInputChange('profile.grade', e.target.value)}
                      className="input"
                    >
                      <option value="">Select Grade</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>Grade {i + 1}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={editedProfile.profile.school}
                      onChange={(e) => handleInputChange('profile.school', e.target.value)}
                      placeholder="School Name"
                      className="input"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={editedProfile.profile.city}
                      onChange={(e) => handleInputChange('profile.city', e.target.value)}
                      placeholder="City"
                      className="input"
                    />
                    <input
                      type="text"
                      value={editedProfile.profile.state}
                      onChange={(e) => handleInputChange('profile.state', e.target.value)}
                      placeholder="State"
                      className="input"
                    />
                  </div>
                  <textarea
                    value={editedProfile.profile.bio}
                    onChange={(e) => handleInputChange('profile.bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    className="input w-full"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      <FaSave className="mr-2" />
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="btn btn-outline"
                    >
                      <FaTimes className="mr-2" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-800">
                      {user.firstName} {user.lastName}
                    </h1>
                    <button
                      onClick={() => setEditMode(true)}
                      className="text-blue-500 hover:text-blue-600 p-2"
                    >
                      <FaEdit />
                    </button>
                  </div>
                  <p className="text-gray-600 mb-4">{user.email}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    {user.profile?.grade && (
                      <div className="flex items-center gap-1">
                        <FaUser />
                        Grade {user.profile.grade}
                      </div>
                    )}
                    {user.profile?.school && (
                      <div className="flex items-center gap-1">
                        <FaSchool />
                        {user.profile.school}
                      </div>
                    )}
                    {user.profile?.city && (
                      <div className="flex items-center gap-1">
                        <FaMapMarkerAlt />
                        {user.profile.city}, {user.profile?.state}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <FaCalendar />
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {user.profile?.bio && (
                    <p className="text-gray-700 italic">{user.profile.bio}</p>
                  )}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{user.gamification?.ecoPoints || 0}</div>
                <div className="text-sm text-gray-600">EcoPoints</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{user.gamification?.level || 1}</div>
                <div className="text-sm text-gray-600">Level</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{user.gamification?.badges?.length || 0}</div>
                <div className="text-sm text-gray-600">Badges</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{user.gamification?.streaks?.current || 0}</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="flex border-b overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: FaChartLine },
              { id: 'achievements', label: 'Achievements', icon: FaTrophy },
              { id: 'activity', label: 'Activity', icon: FaCalendar },
              { id: 'certificates', label: 'Certificates', icon: FaCertificate }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <tab.icon />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  {/* Learning Stats */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Learning Progress</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                          <FaQuestionCircle className="text-2xl" />
                          <div className="text-right">
                            <div className="text-2xl font-bold">{profileStats?.quizzesCompleted || 0}</div>
                            <div className="text-sm text-blue-100">Quizzes</div>
                          </div>
                        </div>
                        <div className="text-sm text-blue-100">
                          Avg Score: {profileStats?.averageQuizScore || 0}%
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                          <FaGamepad className="text-2xl" />
                          <div className="text-right">
                            <div className="text-2xl font-bold">{profileStats?.gamesPlayed || 0}</div>
                            <div className="text-sm text-green-100">Games</div>
                          </div>
                        </div>
                        <div className="text-sm text-green-100">
                          High Score: {profileStats?.bestGameScore || 0}
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                          <FaFlask className="text-2xl" />
                          <div className="text-right">
                            <div className="text-2xl font-bold">{profileStats?.experimentsCompleted || 0}</div>
                            <div className="text-sm text-purple-100">Experiments</div>
                          </div>
                        </div>
                        <div className="text-sm text-purple-100">
                          Success Rate: {profileStats?.experimentSuccessRate || 0}%
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                          <FaFire className="text-2xl" />
                          <div className="text-right">
                            <div className="text-2xl font-bold">{user.gamification?.streaks?.longest || 0}</div>
                            <div className="text-sm text-orange-100">Best Streak</div>
                          </div>
                        </div>
                        <div className="text-sm text-orange-100">
                          Current: {user.gamification?.streaks?.current || 0} days
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Points */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Points</h3>
                    <div className="space-y-3">
                      {achievements.recentPoints.slice(0, 5).map((activity, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                          <div>
                            <p className="font-medium text-gray-800">{activity.description}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(activity.earnedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-lg font-bold text-green-600">
                            +{activity.points}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Achievements Tab */}
              {activeTab === 'achievements' && (
                <motion.div
                  key="achievements"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-6">
                      Your Badges ({achievements.badges.length})
                    </h3>
                    {achievements.badges.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">🏆</div>
                        <p className="text-gray-600">No badges earned yet. Keep learning to unlock achievements!</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {achievements.badges.map((badgeData, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6 text-center shadow-lg"
                          >
                            <div className="text-4xl mb-3">{badgeData.badge.icon}</div>
                            <h4 className="font-bold text-gray-800 mb-2">{badgeData.badge.name}</h4>
                            <p className="text-sm text-gray-600 mb-3">{badgeData.badge.description}</p>
                            <div className="text-xs text-gray-500">
                              Earned: {new Date(badgeData.awardedAt).toLocaleDateString()}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <motion.div
                  key="activity"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentActivity.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">📈</div>
                        <p className="text-gray-600">No recent activity. Start learning to see your progress here!</p>
                      </div>
                    ) : (
                      recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center gap-4 bg-white border rounded-lg p-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            {activity.type === 'quiz' && <FaQuestionCircle className="text-blue-600" />}
                            {activity.type === 'game' && <FaGamepad className="text-green-600" />}
                            {activity.type === 'experiment' && <FaFlask className="text-purple-600" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{activity.title}</p>
                            <p className="text-sm text-gray-600">{activity.description}</p>
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(activity.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {/* Certificates Tab */}
              {activeTab === 'certificates' && (
                <motion.div
                  key="certificates"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    Your Certificates ({achievements.certificates.length})
                  </h3>
                  {achievements.certificates.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📜</div>
                      <p className="text-gray-600">No certificates yet. Complete quizzes and achievements to earn certificates!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {achievements.certificates.map((certificate, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6 shadow-lg"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-3xl">🏆</div>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">
                                {new Date(certificate.issuedAt).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-gray-500 font-mono">
                                {certificate.data.certificateId}
                              </div>
                            </div>
                          </div>
                          
                          <h4 className="font-bold text-gray-800 mb-2">
                            {certificate.template.name}
                          </h4>
                          
                          <p className="text-sm text-gray-600 mb-4">
                            {certificate.template.type.replace('_', ' ')}
                          </p>
                          
                          <div className="flex gap-3">
                            <button className="flex-1 btn btn-primary btn-sm">
                              <FaDownload className="mr-2" />
                              Download
                            </button>
                            <button className="btn btn-outline btn-sm">
                              <FaShare className="mr-2" />
                              Share
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;