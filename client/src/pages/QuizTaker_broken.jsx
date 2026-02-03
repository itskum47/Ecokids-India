import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaClock, 
  FaPlay, 
  FaPause, 
  FaStop, 
  FaQuestion,
  FaLightbulb,
  FaCheck,
  FaTimes,
  FaArrowLeft,
  FaArrowRight,
  FaTrophy,
  FaCertificate,
  FaRedo
} from 'react-icons/fa';
import { apiRequest } from '../../utils/api';

// Temporary toast function to replace uiSlice dependency
const showToast = (message, type = 'info') => {
  console.log(`[${type.toUpperCase()}] ${message}`);
  // TODO: Replace with proper toast implementation when uiSlice is working
};

const QuizTaker = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [hintsUsed, setHintsUsed] = useState({});

  const timerRef = useRef(null);
  const questionTimerRef = useRef(null);
  const questionStartTime = useRef(Date.now());

  useEffect(() => {
    if (!isAuthenticated) {
      showToast('Please log in to take quizzes', 'error');
      navigate('/login');
      return;
    }
    fetchQuiz();
  }, [slug, isAuthenticated]);

  // Main timer effect
  useEffect(() => {
    if (quizStarted && !isPaused && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleQuizComplete();
            return 0;
          }
          return prev - 1;
        });
        setTimeSpent(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [quizStarted, isPaused, timeRemaining]);

  const fetchQuiz = async () => {
    try {
      const response = await apiRequest(`/quizzes/${slug}`);
      setQuiz(response.data);
      setTimeRemaining(response.data.timeLimit * 60); // Convert minutes to seconds
    } catch (error) {
      showToast(
        type: 'error',
        message: 'Failed to load quiz'
      }));
      navigate('/quizzes');
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async () => {
    try {
      const response = await apiRequest(`/quizzes/${quiz._id}/start`, {
        method: 'POST'
      });
      
      setAttemptId(response.data.attemptId);
      setQuestions(response.data.questions);
      setQuizStarted(true);
      questionStartTime.current = Date.now();
      
      showToast(
        type: 'success',
        message: 'Quiz started! Good luck!'
      }));
    } catch (error) {
      showToast(
        type: 'error',
        message: error.message || 'Failed to start quiz'
      }));
    }
  };

  const submitAnswer = async (questionId, answer) => {
    try {
      const timeSpentOnQuestion = Math.floor((Date.now() - questionStartTime.current) / 1000);
      const hintsUsedForQuestion = hintsUsed[questionId] || 0;
      
      const response = await apiRequest(`/quizzes/${quiz._id}/submit-answer`, {
        method: 'POST',
        body: JSON.stringify({
          attemptId,
          questionId,
          answer,
          timeSpent: timeSpentOnQuestion,
          hintsUsed: hintsUsedForQuestion
        })
      });

      // Store answer locally
      setAnswers(prev => ({
        ...prev,
        [questionId]: answer
      }));

      // Show instant feedback if enabled
      if (quiz.features.instantFeedback && response.feedback) {
        setFeedback(response.feedback);
        setTimeout(() => setFeedback(null), 3000);
      }

      showToast(
        type: 'success',
        message: 'Answer submitted!'
      }));
    } catch (error) {
      showToast(
        type: 'error',
        message: error.message || 'Failed to submit answer'
      }));
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    submitAnswer(questionId, answer);
    
    // Auto-advance if instant feedback is disabled
    if (!quiz.features.instantFeedback && currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        nextQuestion();
      }, 500);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowHint(false);
      setFeedback(null);
      questionStartTime.current = Date.now();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowHint(false);
      setFeedback(null);
      questionStartTime.current = Date.now();
    }
  };

  const toggleHint = (questionId) => {
    setShowHint(!showHint);
    if (!showHint) {
      setHintsUsed(prev => ({
        ...prev,
        [questionId]: (prev[questionId] || 0) + 1
      }));
    }
  };

  const handleQuizComplete = async () => {
    try {
      const response = await apiRequest(`/quizzes/${quiz._id}/complete`, {
        method: 'POST',
        body: JSON.stringify({
          attemptId,
          totalTimeSpent: timeSpent
        })
      });

      setResults(response.data);
      setShowResults(true);
      setQuizStarted(false);

      showToast(
        type: response.data.passed ? 'success' : 'info',
        message: response.message
      }));
    } catch (error) {
      showToast(
        type: 'error',
        message: error.message || 'Failed to complete quiz'
      }));
    }
  };

  const pauseQuiz = () => {
    if (quiz.features.pauseAllowed) {
      setIsPaused(!isPaused);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  };

  const retakeQuiz = () => {
    setQuizStarted(false);
    setShowResults(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeSpent(0);
    setTimeRemaining(quiz.timeLimit * 60);
    setResults(null);
    setAttemptId(null);
    setQuestions([]);
    setFeedback(null);
    setHintsUsed({});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz not found</h2>
          <button
            onClick={() => navigate('/quizzes')}
            className="btn btn-primary"
          >
            Browse Quizzes
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Quiz Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/quizzes')}
                className="text-gray-600 hover:text-gray-800"
              >
                <FaArrowLeft className="text-xl" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{quiz.title}</h1>
                <p className="text-sm text-gray-600">
                  {quiz.questions.length} questions • {quiz.timeLimit} minutes
                </p>
              </div>
            </div>
            
            {quizStarted && (
              <div className="flex items-center gap-4">
                {/* Timer */}
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  timeRemaining < 300 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  <FaClock />
                  <span className="font-mono font-semibold">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                
                {/* Pause Button */}
                {quiz.features.pauseAllowed && (
                  <button
                    onClick={pauseQuiz}
                    className="btn btn-outline"
                  >
                    {isPaused ? <FaPlay /> : <FaPause />}
                  </button>
                )}
                
                {/* Stop Button */}
                <button
                  onClick={handleQuizComplete}
                  className="btn btn-secondary"
                >
                  <FaStop className="mr-2" />
                  Finish
                </button>
              </div>
            )}
          </div>
          
          {/* Progress Bar */}
          {quizStarted && quiz.features.showProgress && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>{Math.round(getProgressPercentage())}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Quiz Start Screen */}
        {!quizStarted && !showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-6">📝</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{quiz.title}</h2>
            <p className="text-lg text-gray-600 mb-6">{quiz.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {quiz.questions.length}
                </div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {quiz.timeLimit}
                </div>
                <div className="text-sm text-gray-600">Minutes</div>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {quiz.scoring.passingScore}%
                </div>
                <div className="text-sm text-gray-600">To Pass</div>
              </div>
            </div>

            {/* User Attempts */}
            {quiz.userAttempts && quiz.userAttempts.length > 0 && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Your Previous Attempts</h3>
                <div className="space-y-2">
                  {quiz.userAttempts.map((attempt, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>Attempt {attempt.attemptNumber}</span>
                      <span className={`font-semibold ${
                        attempt.score?.percentage >= quiz.scoring.passingScore 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {attempt.score?.percentage || 0}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quiz Features */}
            <div className="mb-6 text-left max-w-md mx-auto">
              <h3 className="font-semibold text-gray-800 mb-3">Quiz Features:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {quiz.features.instantFeedback && (
                  <li className="flex items-center gap-2">
                    <FaCheck className="text-green-500" />
                    Instant feedback on answers
                  </li>
                )}
                {quiz.features.showHints && (
                  <li className="flex items-center gap-2">
                    <FaLightbulb className="text-yellow-500" />
                    Hints available for questions
                  </li>
                )}
                {quiz.features.allowReview && (
                  <li className="flex items-center gap-2">
                    <FaArrowLeft className="text-blue-500" />
                    Navigate between questions
                  </li>
                )}
                {quiz.features.pauseAllowed && (
                  <li className="flex items-center gap-2">
                    <FaPause className="text-purple-500" />
                    Pause quiz allowed
                  </li>
                )}
              </ul>
            </div>

            <button
              onClick={startQuiz}
              className="btn btn-primary btn-lg"
            >
              <FaPlay className="mr-2" />
              Start Quiz
            </button>
          </motion.div>
        )}

        {/* Quiz Questions */}
        {quizStarted && currentQuestion && !isPaused && (
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm px-2 py-1 rounded ${
                    currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {currentQuestion.difficulty}
                  </span>
                  <span className="text-sm text-gray-500">
                    {currentQuestion.points} points
                  </span>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {currentQuestion.questionText}
              </h2>
              
              {currentQuestion.image && (
                <img
                  src={currentQuestion.image}
                  alt="Question"
                  className="w-full max-w-md mx-auto rounded-lg shadow-md mb-4"
                />
              )}
            </div>

            {/* Question Content */}
            <div className="mb-6">
              {currentQuestion.questionType === 'multiple-choice' && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = answers[currentQuestion._id] === option._id;
                    return (
                      <button
                        key={option._id}
                        onClick={() => handleAnswerSelect(currentQuestion._id, option._id)}
                        className={`
                          w-full p-4 text-left rounded-lg border-2 transition-all duration-200
                          ${isSelected 
                            ? 'border-blue-500 bg-blue-50 shadow-md' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center
                            ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}
                          `}>
                            {isSelected && (
                              <div className="w-3 h-3 bg-white rounded-full" />
                            )}
                          </div>
                          <span className="font-medium text-gray-800">
                            {String.fromCharCode(65 + index)}. {option.optionText}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQuestion.questionType === 'true-false' && (
                <div className="flex gap-4 justify-center">
                  {['true', 'false'].map(option => {
                    const isSelected = answers[currentQuestion._id] === option;
                    return (
                      <button
                        key={option}
                        onClick={() => handleAnswerSelect(currentQuestion._id, option)}
                        className={`
                          px-8 py-4 rounded-lg border-2 transition-all duration-200 min-w-[120px]
                          ${isSelected 
                            ? 'border-blue-500 bg-blue-50 shadow-md' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }
                        `}
                      >
                        <span className="font-semibold text-gray-800 capitalize">
                          {option}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQuestion.questionType === 'fill-blank' && (
                <div className="max-w-md mx-auto">
                  <input
                    type="text"
                    value={answers[currentQuestion._id] || ''}
                    onChange={(e) => setAnswers(prev => ({
                      ...prev,
                      [currentQuestion._id]: e.target.value
                    }))}
                    onBlur={(e) => {
                      if (e.target.value) {
                        handleAnswerSelect(currentQuestion._id, e.target.value);
                      }
                    }}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="Type your answer here..."
                  />
                </div>
              )}
            </div>

            {/* Instant Feedback */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mb-6 p-4 rounded-lg ${
                    feedback.isCorrect 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {feedback.isCorrect ? (
                      <FaCheck className="text-green-600" />
                    ) : (
                      <FaTimes className="text-red-600" />
                    )}
                    <span className={`font-semibold ${
                      feedback.isCorrect ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {feedback.isCorrect ? 'Correct!' : 'Incorrect'}
                    </span>
                  </div>
                  {feedback.explanation && (
                    <p className="text-sm text-gray-700">{feedback.explanation}</p>
                  )}
                  {!feedback.isCorrect && feedback.correctAnswer && (
                    <p className="text-sm text-gray-600 mt-1">
                      Correct answer: {feedback.correctAnswer}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hint */}
            <AnimatePresence>
              {showHint && currentQuestion.hint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FaLightbulb className="text-yellow-600" />
                    <span className="font-semibold text-yellow-800">Hint</span>
                  </div>
                  <p className="text-sm text-gray-700">{currentQuestion.hint}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                {currentQuestion.hint && quiz.features.showHints && (
                  <button
                    onClick={() => toggleHint(currentQuestion._id)}
                    className="btn btn-outline"
                  >
                    <FaLightbulb className="mr-2" />
                    {showHint ? 'Hide Hint' : 'Show Hint'}
                  </button>
                )}
              </div>
              
              <div className="flex gap-3">
                {quiz.features.allowReview && currentQuestionIndex > 0 && (
                  <button
                    onClick={previousQuestion}
                    className="btn btn-outline"
                  >
                    <FaArrowLeft className="mr-2" />
                    Previous
                  </button>
                )}
                
                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    onClick={nextQuestion}
                    className="btn btn-primary"
                    disabled={!answers[currentQuestion._id]}
                  >
                    Next
                    <FaArrowRight className="ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={handleQuizComplete}
                    className="btn btn-success"
                    disabled={!answers[currentQuestion._id]}
                  >
                    <FaTrophy className="mr-2" />
                    Finish Quiz
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Pause Screen */}
        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-6">⏸️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz Paused</h2>
            <p className="text-gray-600 mb-6">
              Take your time! Click resume when you're ready to continue.
            </p>
            <button
              onClick={pauseQuiz}
              className="btn btn-primary"
            >
              <FaPlay className="mr-2" />
              Resume Quiz
            </button>
          </motion.div>
        )}

        {/* Results Screen */}
        {showResults && results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <div className={`text-6xl mb-4 ${
                results.passed ? '🎉' : '📚'
              }`}></div>
              <h2 className={`text-3xl font-bold mb-4 ${
                results.passed ? 'text-green-600' : 'text-blue-600'
              }`}>
                {results.passed ? 'Congratulations!' : 'Good Effort!'}
              </h2>
              <p className="text-lg text-gray-600">
                {results.passed 
                  ? 'You passed the quiz!' 
                  : 'Keep studying and try again!'
                }
              </p>
            </div>

            {/* Score Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {results.score.percentage}%
                </div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {results.score.correct}/{results.score.total}
                </div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {formatTime(results.timeSpent)}
                </div>
                <div className="text-sm text-gray-600">Time</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 mb-2">
                  {results.ecoPointsEarned}
                </div>
                <div className="text-sm text-gray-600">EcoPoints</div>
              </div>
            </div>

            {/* Certificate */}
            {results.certificateIssued && (
              <div className="text-center mb-6 p-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg">
                <FaCertificate className="text-3xl mb-2 mx-auto" />
                <h3 className="font-bold mb-1">Certificate Earned!</h3>
                <p className="text-sm">You can download your certificate from your profile</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/quizzes')}
                className="btn btn-outline"
              >
                Browse More Quizzes
              </button>
              
              {quiz.scoring.allowRetakes && 
               quiz.userAttempts.length < quiz.scoring.maxAttempts && (
                <button
                  onClick={retakeQuiz}
                  className="btn btn-primary"
                >
                  <FaRedo className="mr-2" />
                  Retake Quiz
                </button>
              )}
              
              <button
                onClick={() => navigate(`/profile/quiz-results`)}
                className="btn btn-secondary"
              >
                View All Results
              </button>
            </div>

            {/* Detailed Review (if enabled) */}
            {quiz.features.reviewMode && (
              <div className="mt-8 border-t pt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Review Your Answers</h3>
                <div className="space-y-6">
                  {results.questions.map((question, index) => (
                    <div key={question._id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-800">
                          Question {index + 1}
                        </h4>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          question.userAnswer?.isCorrect
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {question.userAnswer?.isCorrect ? 'Correct' : 'Incorrect'}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{question.questionText}</p>
                      
                      {question.userAnswer && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-1">Your Answer:</p>
                          <p className="font-medium">
                            {question.questionType === 'multiple-choice'
                              ? question.options.find(opt => opt._id === question.userAnswer.selectedAnswer)?.optionText
                              : question.userAnswer.selectedAnswer}
                          </p>
                        </div>
                      )}
                      
                      {!question.userAnswer?.isCorrect && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-1">Correct Answer:</p>
                          <p className="font-medium text-green-600">
                            {question.questionType === 'multiple-choice'
                              ? question.options.find(opt => opt.isCorrect)?.optionText
                              : question.correctAnswer}
                          </p>
                        </div>
                      )}
                      
                      {question.explanation && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                          <p className="text-sm text-blue-800">{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QuizTaker;