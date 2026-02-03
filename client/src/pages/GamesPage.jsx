import React from 'react';
import { motion } from 'framer-motion';
import { FaGamepad, FaPlay, FaTrophy, FaClock } from 'react-icons/fa';
import EcoMazeGame from './EcoMazeGame';
import MemoryMatchGame from './MemoryMatchGame';
import WasteSortingGame from './WasteSortingGame';
import EcoAdventureGame from './EcoAdventureGame';
import EcoConnectDotsGame from './EcoConnectDotsGame';

const GamesPage = () => {
  const [selectedGame, setSelectedGame] = React.useState(null);
  const [gameStats, setGameStats] = React.useState({
    totalPlayed: 0,
    highScore: 0,
    averageTime: 0,
    gamesCompleted: 0
  });

  const games = [
    {
      id: 'maze',
      title: 'Eco Maze Adventure',
      description: 'Navigate through an environmental maze, collect eco-friendly items and avoid pollution!',
      icon: '🌿',
      difficulty: 'Easy',
      estimatedTime: '3-5 min',
      component: EcoMazeGame,
      category: 'Adventure',
      skills: ['Problem Solving', 'Environmental Awareness', 'Navigation']
    },
    {
      id: 'memory',
      title: 'Environmental Memory Match',
      description: 'Match pairs of environmental cards and learn about nature conservation!',
      icon: '🧠',
      difficulty: 'Medium',
      estimatedTime: '4-6 min',
      component: MemoryMatchGame,
      category: 'Memory',
      skills: ['Memory', 'Pattern Recognition', 'Nature Knowledge']
    },
    {
      id: 'sorting',
      title: 'Waste Sorting Challenge',
      description: 'Sort different types of waste into the correct bins and learn about recycling!',
      icon: '♻️',
      difficulty: 'Easy',
      estimatedTime: '2-4 min',
      component: WasteSortingGame,
      category: 'Educational',
      skills: ['Classification', 'Environmental Responsibility', 'Quick Thinking']
    },
    {
      id: 'adventure',
      title: 'Eco Hero Adventure',
      description: 'Embark on a platformer adventure to save three different ecosystems!',
      icon: '🌍',
      difficulty: 'Hard',
      estimatedTime: '8-12 min',
      component: EcoAdventureGame,
      category: 'Adventure',
      skills: ['Coordination', 'Strategic Thinking', 'Environmental Action']
    },
    {
      id: 'connect-dots',
      title: 'Eco Connect-the-Dots',
      description: 'Connect numbered dots to create eco-friendly objects and learn about green technology!',
      icon: '🔗',
      difficulty: 'Medium',
      estimatedTime: '5-8 min',
      component: EcoConnectDotsGame,
      category: 'Creative',
      skills: ['Fine Motor Skills', 'Sequencing', 'Green Technology']
    }
  ];

  const handleGameComplete = (gameId, score, timeSpent, completed) => {
    setGameStats(prev => ({
      totalPlayed: prev.totalPlayed + 1,
      highScore: Math.max(prev.highScore, score),
      averageTime: (prev.averageTime * prev.totalPlayed + timeSpent) / (prev.totalPlayed + 1),
      gamesCompleted: prev.gamesCompleted + (completed ? 1 : 0)
    }));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Adventure': return '🗺️';
      case 'Memory': return '🧩';
      case 'Educational': return '📚';
      case 'Creative': return '🎨';
      default: return '🎮';
    }
  };

  if (selectedGame) {
    const GameComponent = selectedGame.component;
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Game Header */}
          <div className="mb-6">
            <button
              onClick={() => setSelectedGame(null)}
              className="btn btn-outline mb-4"
            >
              ← Back to Games
            </button>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {selectedGame.icon} {selectedGame.title}
              </h1>
              <p className="text-gray-600 mb-4">{selectedGame.description}</p>
              <div className="flex justify-center gap-4 text-sm">
                <span className={`px-2 py-1 rounded-full ${getDifficultyColor(selectedGame.difficulty)}`}>
                  {selectedGame.difficulty}
                </span>
                <span className="px-2 py-1 rounded-full text-blue-600 bg-blue-100">
                  <FaClock className="inline mr-1" />
                  {selectedGame.estimatedTime}
                </span>
                <span className="px-2 py-1 rounded-full text-purple-600 bg-purple-100">
                  {getCategoryIcon(selectedGame.category)} {selectedGame.category}
                </span>
              </div>
            </div>
          </div>

          {/* Game Component */}
          <GameComponent
            gameData={selectedGame}
            onScoreSubmit={(score, time, completed) => 
              handleGameComplete(selectedGame.id, score, time, completed)
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-800 mb-4"
          >
            🎮 EcoKids Games
          </motion.h1>
          <p className="text-xl text-gray-600 mb-6">
            Learn about the environment through fun and interactive games!
          </p>

          {/* Game Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="text-2xl font-bold text-blue-600">{gameStats.totalPlayed}</div>
              <div className="text-sm text-gray-600">Games Played</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="text-2xl font-bold text-green-600">{gameStats.highScore}</div>
              <div className="text-sm text-gray-600">High Score</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(gameStats.averageTime)}s
              </div>
              <div className="text-sm text-gray-600">Avg. Time</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="text-2xl font-bold text-orange-600">{gameStats.gamesCompleted}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
              onClick={() => setSelectedGame(game)}
            >
              {/* Game Card Header */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{game.icon}</div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(game.difficulty)}`}>
                      {game.difficulty}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">{game.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{game.description}</p>

                {/* Game Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FaClock className="text-blue-500" />
                    <span>{game.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{getCategoryIcon(game.category)}</span>
                    <span>{game.category}</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="mt-4">
                  <div className="text-xs font-semibold text-gray-700 mb-2">Skills Developed:</div>
                  <div className="flex flex-wrap gap-1">
                    {game.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Play Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary w-full mt-4"
                >
                  <FaPlay className="mr-2" />
                  Play Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Educational Content */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🌱 Why Play Environmental Games?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">🧠</div>
              <h3 className="font-semibold text-gray-800 mb-2">Learn While Playing</h3>
              <p className="text-sm text-gray-600">
                Games make environmental education fun and memorable, helping you understand complex concepts through interactive play.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold text-gray-800 mb-2">Develop Skills</h3>
              <p className="text-sm text-gray-600">
                Build problem-solving, memory, coordination, and critical thinking skills while learning about environmental protection.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🌍</div>
              <h3 className="font-semibold text-gray-800 mb-2">Create Impact</h3>
              <p className="text-sm text-gray-600">
                Understanding environmental issues through games inspirts real-world action and responsible behavior.
              </p>
            </div>
          </div>
        </div>

        {/* Game Categories */}
        <div className="mt-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl shadow-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-4">🏆 Achievement System</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <FaTrophy className="text-3xl mb-2 mx-auto" />
              <div className="font-semibold">Eco Beginner</div>
              <div className="text-sm opacity-80">Play 3 games</div>
            </div>
            <div className="text-center">
              <FaTrophy className="text-3xl mb-2 mx-auto" />
              <div className="font-semibold">Green Champion</div>
              <div className="text-sm opacity-80">Complete all games</div>
            </div>
            <div className="text-center">
              <FaTrophy className="text-3xl mb-2 mx-auto" />
              <div className="font-semibold">Speed Runner</div>
              <div className="text-sm opacity-80">Fast completion times</div>
            </div>
            <div className="text-center">
              <FaTrophy className="text-3xl mb-2 mx-auto" />
              <div className="font-semibold">Perfect Score</div>
              <div className="text-sm opacity-80">High accuracy rates</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamesPage;