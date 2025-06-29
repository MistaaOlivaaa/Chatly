import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lobby from './components/Lobby';
import ChatRoom from './components/ChatRoom';
import AnimatedBackground from './components/AnimatedBackground';

function App() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route path="/room/:roomId" element={<ChatRoom />} />
        </Routes>
      </motion.div>
    </div>
  );
}

export default App; 