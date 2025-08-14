import React, { useState, useEffect } from 'react';
import GameSetup from './components/GameSetup';
import ChatInterface from './components/ChatInterface';
import GameHeader from './components/GameHeader';

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameConfig, setGameConfig] = useState(null);
  const [gameCompleted, setGameCompleted] = useState(false);

  const handleStartGame = (config) => {
    setGameConfig(config);
    setGameStarted(true);
    setGameCompleted(false);
  };

  const handleGameComplete = () => {
    setGameCompleted(true);
  };

  const handleRestart = () => {
    setGameStarted(false);
    setGameConfig(null);
    setGameCompleted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <GameHeader />
        
        {!gameStarted ? (
          <GameSetup onStartGame={handleStartGame} />
        ) : (
          <ChatInterface 
            gameConfig={gameConfig}
            onGameComplete={handleGameComplete}
            onRestart={handleRestart}
            gameCompleted={gameCompleted}
          />
        )}
      </div>
    </div>
  );
};

export default App;
