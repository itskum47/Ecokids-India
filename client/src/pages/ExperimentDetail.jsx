import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaClock, 
  FaUsers, 
  FaEye, 
  FaStar, 
  FaBook, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaCamera,
  FaUpload,
  FaPlay,
  FaStop,
  FaDownload
} from 'react-icons/fa';
// import { addToast } from '../../store/slices/uiSlice';
import { apiRequest } from '../utils/api';

// Temporary workaround for addToast
const addToast = (payload) => ({ type: 'ui/addToast', payload });

const ExperimentDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  const [experiment, setExperiment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  // Submission form state
  const [submission, setSubmission] = useState({
    observations: '',
    results: '',
    learnings: '',
    rating: 5,
    feedback: '',
    photos: []
  });

  // Timer state for tracking experiment time
  const [timeSpent, setTimeSpent] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    fetchExperiment();
  }, [slug]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const fetchExperiment = async () => {
    try {
      const response = await apiRequest(`/experiments/${slug}`);
      setExperiment(response.data);
      
      // Check if user has already submitted
      if (isAuthenticated && response.data.submissions) {
        const userSubmission = response.data.submissions.find(
          sub => sub.user._id === user.id
        );
        setHasSubmitted(!!userSubmission);
      }
    } catch (error) {
      dispatch(addToast({
        type: 'error',
        message: 'Failed to load experiment'
      }));
    } finally {
      setLoading(false);
    }
  };

  const startExperiment = () => {
    setIsTimerRunning(true);
    dispatch(addToast({
      type: 'info',
      message: 'Experiment timer started! Good luck!'
    }));
  };

  const stopExperiment = () => {
    setIsTimerRunning(false);
    setShowSubmissionForm(true);
    dispatch(addToast({
      type: 'success',
      message: 'Ready to submit your results!'
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setSubmission(prev => ({
      ...prev,
      photos: [...prev.photos, ...files]
    }));
  };

  const removePhoto = (index) => {
    setSubmission(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('observations', submission.observations);
      formData.append('results', submission.results);
      formData.append('learnings', submission.learnings);
      formData.append('rating', submission.rating);
      formData.append('feedback', submission.feedback);
      
      submission.photos.forEach((photo, index) => {
        formData.append('photos', photo);
      });

      await apiRequest(`/experiments/${experiment._id}/submit`, {
        method: 'POST',
        body: formData
      });

      dispatch(addToast({
        type: 'success',
        message: 'Experiment results submitted successfully!'
      }));

      setHasSubmitted(true);
      setShowSubmissionForm(false);
      
    } catch (error) {
      dispatch(addToast({
        type: 'error',
        message: error.message || 'Failed to submit experiment results'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSafetyLevelColor = (level) => {
    switch (level) {
      case 'info': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'warning': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'danger': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!experiment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Experiment not found</h2>
          <Link to="/experiments" className="btn btn-primary">
            Browse Experiments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Link to="/experiments" className="text-white/80 hover:text-white">
                  ← Back to Experiments
                </Link>
                <span className={`px-3 py-1 rounded-full text-sm ${getDifficultyColor(experiment.difficulty)}`}>
                  {experiment.difficulty}
                </span>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                {experiment.title}
              </h1>
              
              <p className="text-xl text-white/90 mb-6">
                {experiment.description}
              </p>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <FaClock />
                  <span>{experiment.estimatedTime} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUsers />
                  <span>Grades {experiment.gradeLevel.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaEye />
                  <span>{experiment.metrics.views} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaStar />
                  <span>{experiment.metrics.averageRating.toFixed(1)}</span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              {experiment.multimedia?.featuredImage && (
                <img
                  src={experiment.multimedia.featuredImage}
                  alt={experiment.title}
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Experiment Timer and Controls */}
            {isAuthenticated && !hasSubmitted && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Experiment Timer</h3>
                  <div className="text-2xl font-mono text-blue-600">
                    {formatTime(timeSpent)}
                  </div>
                </div>
                
                <div className="flex gap-4">
                  {!isTimerRunning ? (
                    <button
                      onClick={startExperiment}
                      className="btn btn-primary"
                    >
                      <FaPlay className="mr-2" />
                      Start Experiment
                    </button>
                  ) : (
                    <button
                      onClick={stopExperiment}
                      className="btn btn-secondary"
                    >
                      <FaStop className="mr-2" />
                      Finish & Submit
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Objective */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 Objective</h3>
              <p className="text-gray-600">{experiment.objective}</p>
            </div>

            {/* Safety Guidelines */}
            {experiment.safety && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">⚠️ Safety First</h3>
                
                {experiment.safety.adultSupervision && (
                  <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <p className="font-semibold text-yellow-800">
                      🧑‍🏫 Adult supervision required for this experiment
                    </p>
                  </div>
                )}

                {experiment.safety.warnings && experiment.safety.warnings.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {experiment.safety.warnings.map((warning, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <FaExclamationTriangle className="text-red-500 mt-1 flex-shrink-0" />
                        <p className="text-red-800">{warning}</p>
                      </div>
                    ))}
                  </div>
                )}

                {experiment.safety.protectiveGear && experiment.safety.protectiveGear.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Protective Gear:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {experiment.safety.protectiveGear.map((gear, index) => (
                        <li key={index} className="text-gray-600">{gear}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Materials */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🧪 Materials Needed</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {experiment.materials.map((material, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">{material.name}</h4>
                      {material.essential && (
                        <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                          Essential
                        </span>
                      )}
                    </div>
                    
                    {material.quantity && (
                      <p className="text-sm text-gray-600 mb-2">
                        Quantity: {material.quantity}
                      </p>
                    )}
                    
                    {material.whereToFind && (
                      <p className="text-sm text-blue-600 mb-2">
                        📍 {material.whereToFind}
                      </p>
                    )}
                    
                    {material.cost && (
                      <p className="text-sm text-green-600">
                        💰 ₹{material.cost.min}
                        {material.cost.max && material.cost.max !== material.cost.min && 
                          ` - ₹${material.cost.max}`
                        }
                      </p>
                    )}
                    
                    {material.alternatives && material.alternatives.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Alternatives:</p>
                        <ul className="text-xs text-gray-600 list-disc list-inside">
                          {material.alternatives.map((alt, altIndex) => (
                            <li key={altIndex}>{alt}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Procedure Steps */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">📋 Step-by-Step Procedure</h3>
              
              <div className="space-y-6">
                {experiment.procedure.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border-l-4 pl-6 pb-6 ${
                      index === activeStep ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-white font-bold
                        ${index === activeStep ? 'bg-blue-500' : index < activeStep ? 'bg-green-500' : 'bg-gray-400'}
                      `}>
                        {index < activeStep ? <FaCheckCircle /> : index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{step.title}</h4>
                        {step.timeEstimate && (
                          <p className="text-sm text-gray-500">
                            ⏱️ ~{step.timeEstimate} minutes
                          </p>
                        )}
                      </div>
                      
                      <button
                        onClick={() => setActiveStep(index)}
                        className={`btn btn-sm ${
                          index === activeStep ? 'btn-primary' : 'btn-outline'
                        }`}
                      >
                        {index === activeStep ? 'Current' : 'View'}
                      </button>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-700 leading-relaxed">{step.instruction}</p>
                    </div>
                    
                    {step.image && (
                      <div className="mb-4">
                        <img
                          src={step.image}
                          alt={`Step ${index + 1}`}
                          className="w-full max-w-md rounded-lg shadow-md"
                        />
                      </div>
                    )}
                    
                    {step.tips && step.tips.length > 0 && (
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <h5 className="font-semibold text-green-800 mb-2">💡 Tips:</h5>
                        <ul className="list-disc list-inside space-y-1">
                          {step.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="text-green-700 text-sm">{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {step.safetyNote && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <FaExclamationTriangle className="text-yellow-600 mt-1 flex-shrink-0" />
                          <p className="text-yellow-800 text-sm">{step.safetyNote}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Expected Results */}
            {experiment.expectedResults && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">🔬 Expected Results</h3>
                <p className="text-gray-700 mb-4">{experiment.expectedResults.description}</p>
                
                {experiment.expectedResults.images && experiment.expectedResults.images.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {experiment.expectedResults.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Expected result ${index + 1}`}
                        className="w-full rounded-lg shadow-md"
                      />
                    ))}
                  </div>
                )}
                
                {experiment.expectedResults.variations && experiment.expectedResults.variations.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Possible Variations:</h4>
                    <div className="space-y-2">
                      {experiment.expectedResults.variations.map((variation, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium text-gray-800">{variation.condition}</p>
                          <p className="text-gray-600 text-sm">{variation.result}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Scientific Explanation */}
            {experiment.scientificExplanation && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">🧬 Scientific Explanation</h3>
                
                {experiment.scientificExplanation.phenomenon && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">What's Happening?</h4>
                    <p className="text-gray-700">{experiment.scientificExplanation.phenomenon}</p>
                  </div>
                )}
                
                {experiment.scientificExplanation.theory && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">The Science Behind It</h4>
                    <p className="text-gray-700">{experiment.scientificExplanation.theory}</p>
                  </div>
                )}
                
                {experiment.scientificExplanation.realWorldApplications && 
                 experiment.scientificExplanation.realWorldApplications.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Real-World Applications</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {experiment.scientificExplanation.realWorldApplications.map((app, index) => (
                        <li key={index} className="text-gray-700">{app}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{experiment.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{experiment.estimatedTime} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className={`px-2 py-1 rounded text-sm ${getDifficultyColor(experiment.difficulty)}`}>
                    {experiment.difficulty}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Views:</span>
                  <span className="font-medium">{experiment.metrics.views}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating:</span>
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-500" />
                    <span className="font-medium">{experiment.metrics.averageRating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Indian Context */}
            {experiment.indianContext && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">🇮🇳 Indian Context</h3>
                
                {experiment.indianContext.localRelevance && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Local Relevance</h4>
                    <p className="text-gray-700 text-sm">{experiment.indianContext.localRelevance}</p>
                  </div>
                )}
                
                {experiment.indianContext.environmentalImpact && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Environmental Impact</h4>
                    <p className="text-gray-700 text-sm">{experiment.indianContext.environmentalImpact}</p>
                  </div>
                )}
                
                {experiment.indianContext.culturalConnections && 
                 experiment.indianContext.culturalConnections.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Cultural Connections</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {experiment.indianContext.culturalConnections.map((connection, index) => (
                        <li key={index} className="text-gray-700 text-sm">{connection}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Author Info */}
            {experiment.author && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Created By</h3>
                <div className="flex items-center gap-3">
                  {experiment.author.profile?.avatar && (
                    <img
                      src={experiment.author.profile.avatar}
                      alt={experiment.author.name}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-800">{experiment.author.name}</p>
                    {experiment.author.profile?.title && (
                      <p className="text-sm text-gray-600">{experiment.author.profile.title}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Related Topics */}
            {experiment.relatedTopics && experiment.relatedTopics.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Related Topics</h3>
                <div className="space-y-2">
                  {experiment.relatedTopics.map(topic => (
                    <Link
                      key={topic._id}
                      to={`/topics/${topic.slug}`}
                      className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <FaBook className="text-blue-500" />
                        <span className="font-medium text-gray-800">{topic.title}</span>
                      </div>
                      {topic.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {topic.description}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Download Materials List */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Downloads</h3>
              <button className="btn btn-outline w-full">
                <FaDownload className="mr-2" />
                Materials Checklist
              </button>
            </div>
          </div>
        </div>

        {/* Submission Form Modal */}
        <AnimatePresence>
          {showSubmissionForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    📝 Submit Your Results
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Observations */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        What did you observe? *
                      </label>
                      <textarea
                        value={submission.observations}
                        onChange={(e) => setSubmission(prev => ({
                          ...prev,
                          observations: e.target.value
                        }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={4}
                        placeholder="Describe what you saw, heard, felt, or measured during the experiment..."
                        required
                      />
                    </div>

                    {/* Results */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        What were your results? *
                      </label>
                      <textarea
                        value={submission.results}
                        onChange={(e) => setSubmission(prev => ({
                          ...prev,
                          results: e.target.value
                        }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={4}
                        placeholder="Describe the outcome of your experiment..."
                        required
                      />
                    </div>

                    {/* Learnings */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        What did you learn?
                      </label>
                      <textarea
                        value={submission.learnings}
                        onChange={(e) => setSubmission(prev => ({
                          ...prev,
                          learnings: e.target.value
                        }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="What new knowledge or insights did you gain?"
                      />
                    </div>

                    {/* Photos */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Photos
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <FaCamera className="mx-auto text-gray-400 text-3xl mb-2" />
                        <p className="text-gray-600 mb-2">
                          Upload photos of your experiment setup, process, or results
                        </p>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="photo-upload"
                        />
                        <label
                          htmlFor="photo-upload"
                          className="btn btn-outline cursor-pointer"
                        >
                          <FaUpload className="mr-2" />
                          Choose Photos
                        </label>
                      </div>
                      
                      {submission.photos.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                          {submission.photos.map((photo, index) => (
                            <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(photo)}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removePhoto(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rate this experiment
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setSubmission(prev => ({
                              ...prev,
                              rating: star
                            }))}
                            className={`text-2xl ${
                              star <= submission.rating ? 'text-yellow-500' : 'text-gray-300'
                            }`}
                          >
                            <FaStar />
                          </button>
                        ))}
                        <span className="ml-2 text-gray-600">
                          {submission.rating}/5 stars
                        </span>
                      </div>
                    </div>

                    {/* Feedback */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Feedback (optional)
                      </label>
                      <textarea
                        value={submission.feedback}
                        onChange={(e) => setSubmission(prev => ({
                          ...prev,
                          feedback: e.target.value
                        }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="Any suggestions or feedback about this experiment?"
                      />
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowSubmissionForm(false)}
                        className="btn btn-outline flex-1"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary flex-1"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Results'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Already Submitted Message */}
        {hasSubmitted && (
          <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl text-center">
            <FaCheckCircle className="text-green-600 text-3xl mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Experiment Completed!
            </h3>
            <p className="text-green-700">
              You have already submitted your results for this experiment. 
              Check your profile to see your submission status.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperimentDetail;