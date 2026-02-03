import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitGameScore } from '../store/slices/gamesSlice';

const EcoMazeGame = ({ onGameComplete }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  
  const [gameState, setGameState] = useState({
    score: 0,
    level: 1,
    timeLeft: 300, // 5 minutes
    gameStarted: false,
    gameCompleted: false,
    playerPosition: { x: 0, y: 0 },
    collectibles: [],
    obstacles: []
  });

  const [gameBoard, setGameBoard] = useState([]);

  // Initialize game board
  useEffect(() => {
    initializeGame();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval;
    if (gameState.gameStarted && !gameState.gameCompleted && gameState.timeLeft > 0) {
      interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (gameState.timeLeft <= 0) {
      endGame();
    }

    return () => clearInterval(interval);
  }, [gameState.gameStarted, gameState.gameCompleted, gameState.timeLeft]);

  const initializeGame = () => {
    const boardSize = 10;
    const newBoard = Array(boardSize).fill().map(() => Array(boardSize).fill('empty'));
    
    // Add collectibles (recyclables)
    const collectibles = [];
    for (let i = 0; i < 15; i++) {
      const x = Math.floor(Math.random() * boardSize);
      const y = Math.floor(Math.random() * boardSize);
      if (!(x === 0 && y === 0)) { // Don't place on starting position
        newBoard[y][x] = 'collectible';
        collectibles.push({ x, y, collected: false });
      }
    }

    // Add obstacles (pollution)
    for (let i = 0; i < 8; i++) {
      const x = Math.floor(Math.random() * boardSize);
      const y = Math.floor(Math.random() * boardSize);
      if (newBoard[y][x] === 'empty' && !(x === 0 && y === 0)) {
        newBoard[y][x] = 'obstacle';
      }
    }

    setGameBoard(newBoard);
    setGameState(prev => ({
      ...prev,
      collectibles,
      playerPosition: { x: 0, y: 0 }
    }));
  };

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      gameStarted: true,
      timeLeft: 300,
      score: 0
    }));
  };

  const endGame = async () => {
    setGameState(prev => ({ ...prev, gameCompleted: true }));
    
    if (isAuthenticated && gameState.score > 0) {
      try {
        await dispatch(submitGameScore({
          gameId: 'eco-maze-game',
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

  const movePlayer = useCallback((direction) => {
    if (!gameState.gameStarted || gameState.gameCompleted) return;

    setGameState(prev => {
      const newPosition = { ...prev.playerPosition };
      
      switch (direction) {
        case 'up':
          newPosition.y = Math.max(0, newPosition.y - 1);
          break;
        case 'down':
          newPosition.y = Math.min(gameBoard.length - 1, newPosition.y + 1);
          break;
        case 'left':
          newPosition.x = Math.max(0, newPosition.x - 1);
          break;
        case 'right':
          newPosition.x = Math.min(gameBoard[0]?.length - 1 || 0, newPosition.x + 1);
          break;
      }

      // Check for collectibles
      const collectibleIndex = prev.collectibles.findIndex(
        c => c.x === newPosition.x && c.y === newPosition.y && !c.collected
      );

      let newScore = prev.score;
      let newCollectibles = prev.collectibles;

      if (collectibleIndex !== -1) {
        newCollectibles = [...prev.collectibles];
        newCollectibles[collectibleIndex].collected = true;
        newScore += 10;
      }

      // Check if all collectibles are collected
      const allCollected = newCollectibles.every(c => c.collected);
      if (allCollected && !prev.gameCompleted) {
        setTimeout(endGame, 100);
      }

      return {
        ...prev,
        playerPosition: newPosition,
        score: newScore,
        collectibles: newCollectibles
      };
    });
  }, [gameState.gameStarted, gameState.gameCompleted, gameBoard]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          e.preventDefault();
          movePlayer('up');
          break;
        case 'ArrowDown':
        case 's':
          e.preventDefault();
          movePlayer('down');
          break;
        case 'ArrowLeft':
        case 'a':
          e.preventDefault();
          movePlayer('left');
          break;
        case 'ArrowRight':
        case 'd':
          e.preventDefault();
          movePlayer('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePlayer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCellContent = (x, y) => {
    if (gameState.playerPosition.x === x && gameState.playerPosition.y === y) {
      return '🌱'; // Player
    }
    
    const collectible = gameState.collectibles.find(c => c.x === x && c.y === y && !c.collected);
    if (collectible) {
      return '♻️'; // Recyclable item
    }

    if (gameBoard[y] && gameBoard[y][x] === 'obstacle') {
      return '💨'; // Pollution
    }

    return '';
  };

  const getCellClass = (x, y) => {
    const baseClass = 'w-12 h-12 border border-gray-300 flex items-center justify-center text-xl';
    
    if (gameState.playerPosition.x === x && gameState.playerPosition.y === y) {
      return `${baseClass} bg-green-200`;
    }
    
    if (gameBoard[y] && gameBoard[y][x] === 'obstacle') {
      return `${baseClass} bg-red-100`;
    }
    
    return `${baseClass} bg-blue-50 hover:bg-blue-100`;
  };

  if (!gameState.gameStarted) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-600 mb-4">🌍 Eco Maze Adventure</h2>
          <p className="text-gray-600 mb-6">
            Help the eco-hero collect all recyclable items while avoiding pollution! 
            Use arrow keys or WASD to move around the maze.
          </p>
          <div className="mb-6">
            <div className="flex justify-center space-x-8 text-sm">
              <div className="text-center">
                <div className="text-2xl mb-1">🌱</div>
                <div>You</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">♻️</div>
                <div>Collect</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">💨</div>
                <div>Avoid</div>
              </div>
            </div>
          </div>
          <button
            onClick={startGame}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Game Stats */}
      <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{gameState.score}</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formatTime(gameState.timeLeft)}</div>
              <div className="text-sm text-gray-600">Time Left</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {gameState.collectibles.filter(c => !c.collected).length}
              </div>
              <div className="text-sm text-gray-600">Items Left</div>
            </div>
          </div>
          
          {gameState.gameCompleted && (
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">Game Complete!</div>
              <div className="text-sm text-gray-600">Final Score: {gameState.score}</div>
            </div>
          )}
        </div>
      </div>

      {/* Game Board */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-10 gap-1 mb-4">
          {gameBoard.map((row, y) =>
            row.map((cell, x) => (
              <button
                key={`${x}-${y}`}
                className={getCellClass(x, y)}
                onClick={() => {
                  // Allow clicking to move (for mobile)
                  const dx = x - gameState.playerPosition.x;
                  const dy = y - gameState.playerPosition.y;
                  
                  if (Math.abs(dx) + Math.abs(dy) === 1) {
                    if (dx === 1) movePlayer('right');
                    else if (dx === -1) movePlayer('left');
                    else if (dy === 1) movePlayer('down');
                    else if (dy === -1) movePlayer('up');
                  }
                }}
              >
                {getCellContent(x, y)}
              </button>
            ))
          )}
        </div>
        
        <div className="text-center text-sm text-gray-600">
          Use arrow keys or WASD to move. Click adjacent cells on mobile.
        </div>
      </div>

      {/* Mobile Controls */}
      <div className="bg-white rounded-lg shadow-lg p-4 mt-6 md:hidden">
        <div className="grid grid-cols-3 gap-2 w-32 mx-auto">
          <div></div>
          <button
            onClick={() => movePlayer('up')}
            className="p-3 bg-blue-500 text-white rounded-lg"
          >
            ↑
          </button>
          <div></div>
          <button
            onClick={() => movePlayer('left')}
            className="p-3 bg-blue-500 text-white rounded-lg"
          >
            ←
          </button>
          <div></div>
          <button
            onClick={() => movePlayer('right')}
            className="p-3 bg-blue-500 text-white rounded-lg"
          >
            →
          </button>
          <div></div>
          <button
            onClick={() => movePlayer('down')}
            className="p-3 bg-blue-500 text-white rounded-lg"
          >
            ↓
          </button>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default EcoMazeGame;