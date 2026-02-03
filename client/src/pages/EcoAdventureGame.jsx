import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitGameScore } from '../store/slices/gamesSlice';

const EcoAdventureGame = ({ onGameComplete }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  
  const [gameState, setGameState] = useState({
    score: 0,
    level: 1,
    gameStarted: false,
    gameCompleted: false,
    currentQuestion: 0,
    lives: 3
  });

  const adventures = [
    {
      scenario: "You're walking in a forest and see litter on the ground. What do you do?",
      options: [
        { text: "Pick it up and dispose properly", points: 10, correct: true },
        { text: "Leave it for someone else", points: -5, correct: false },
        { text: "Add more litter", points: -10, correct: false }
      ],
      emoji: "🌲"
    },
    {
      scenario: "At home, you notice the tap is dripping. What's your next action?",
      options: [
        { text: "Ignore it, it's just a small drip", points: -5, correct: false },
        { text: "Tell an adult to fix it", points: 10, correct: true },
        { text: "Use more water since it's already wasting", points: -10, correct: false }
      ],
      emoji: "🚰"
    },
    {
      scenario: "You finished your lunch. What do you do with the packaging?",
      options: [
        { text: "Throw everything in one bin", points: -5, correct: false },
        { text: "Sort recyclables and compost properly", points: 15, correct: true },
        { text: "Leave it on the table", points: -10, correct: false }
      ],
      emoji: "🥪"
    }
  ];

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      gameStarted: true,
      currentQuestion: 0,
      score: 0,
      lives: 3
    }));
  };

  const answerQuestion = (option) => {
    const newScore = Math.max(0, gameState.score + option.points);
    const newLives = option.correct ? gameState.lives : gameState.lives - 1;
    
    setGameState(prev => ({
      ...prev,
      score: newScore,
      lives: newLives
    }));

    if (newLives <= 0 || gameState.currentQuestion + 1 >= adventures.length) {
      setTimeout(endGame, 1500);
    } else {
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          currentQuestion: prev.currentQuestion + 1
        }));
      }, 1500);
    }
  };

  const endGame = async () => {
    setGameState(prev => ({ ...prev, gameCompleted: true }));
    
    if (isAuthenticated && gameState.score > 0) {
      try {
        await dispatch(submitGameScore({
          gameId: 'eco-adventure-game',
          score: gameState.score
        }));
      } catch (error) {
        console.error('Failed to submit score:', error);
      }
    }

    if (onGameComplete) {
      onGameComplete(gameState.score);
    }
  };

  if (!gameState.gameStarted) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-600 mb-4">🌍 Eco Adventure</h2>
          <p className="text-gray-600 mb-6">
            Make the right environmental choices in different scenarios!
          </p>
          <button
            onClick={startGame}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
          >
            Start Adventure
          </button>
        </div>
      </div>
    );
  }

  const currentAdventure = adventures[gameState.currentQuestion];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-green-600">Score: {gameState.score}</div>
          <div className="flex items-center space-x-2">
            <span>Lives:</span>
            {[...Array(3)].map((_, i) => (
              <span key={i} className={i < gameState.lives ? 'text-red-500' : 'text-gray-300'}>
                ❤️
              </span>
            ))}
          </div>
        </div>
      </div>

      {currentAdventure && !gameState.gameCompleted && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{currentAdventure.emoji}</div>
            <h3 className="text-xl font-bold mb-6">{currentAdventure.scenario}</h3>
          </div>
          
          <div className="space-y-4">
            {currentAdventure.options.map((option, index) => (
              <button
                key={index}
                onClick={() => answerQuestion(option)}
                className="w-full p-4 text-left border border-gray-300 rounded-lg hover:bg-green-50 hover:border-green-500 transition-colors"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {gameState.gameCompleted && (
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <h3 className="text-2xl font-bold text-green-600 mb-4">Adventure Complete!</h3>
          <p className="text-lg mb-4">
            You made it through {gameState.currentQuestion + 1} scenarios!
          </p>
          <p className="text-xl font-bold">Final Score: {gameState.score}</p>
          {gameState.lives > 0 ? (
            <p className="text-green-600 mt-2">🌟 Great job protecting the environment!</p>
          ) : (
            <p className="text-yellow-600 mt-2">Keep learning about environmental protection!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EcoAdventureGame;