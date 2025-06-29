import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Shield, Users, Copy, Check, Sparkles } from 'lucide-react';
import useWebSocket from '../hooks/useWebSocket';

const Lobby = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [roomUrl, setRoomUrl] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const { isConnected, sendMessage, error } = useWebSocket('ws://localhost:3001');

  const createRoom = async () => {
    if (!isConnected) {
      alert('Not connected to server. Please wait...');
      return;
    }
    setIsCreating(true);
    sendMessage({ type: 'create_room' });
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Listen for room creation response (simulate for now)
  React.useEffect(() => {
    if (isCreating) {
      setTimeout(() => {
        const roomId = Math.random().toString(36).substr(2, 8).toUpperCase();
        const url = `${window.location.origin}/room/${roomId}`;
        setRoomUrl(url);
        setIsCreating(false);
        navigate(`/room/${roomId}`);
      }, 1000);
    }
  }, [isCreating, navigate]);

  const features = [
    {
      icon: <Shield className="w-7 h-7" />,
      title: 'Anonymous & Secure',
      description: 'No accounts, no tracking, messages disappear forever.'
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: 'Up to 10 Users',
      description: 'Private rooms with automatic cleanup when empty.'
    },
    {
      icon: <MessageCircle className="w-7 h-7" />,
      title: 'Real-time Chat',
      description: 'Instant messaging with WebSocket technology.'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-3xl"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-14"
        >
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="text-6xl md:text-7xl font-extrabold text-accent mb-4 tracking-tight drop-shadow-lg flex items-center justify-center gap-2"
          >
            <Sparkles className="w-10 h-10 text-accent animate-glow" />
            Chatly
          </motion.h1>
          <p className="text-text-secondary text-xl md:text-2xl max-w-xl mx-auto font-medium">
            The most beautiful, private, and modern anonymous chat experience.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="glass-effect rounded-3xl p-8 text-center hover:shadow-accent hover:scale-105 transition-all duration-300"
            >
              <div className="text-accent mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-text font-bold text-xl mb-2">
                {feature.title}
              </h3>
              <p className="text-text-secondary text-base">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Create Room Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
          className="text-center"
        >
          <button
            onClick={createRoom}
            disabled={!isConnected || isCreating}
            className="btn-primary text-2xl px-12 py-5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block w-7 h-7 border-2 border-background border-t-accent rounded-full"
              />
            ) : (
              <>
                <MessageCircle className="inline-block w-7 h-7 mr-2" />
                Create New Room
              </>
            )}
          </button>
          {!isConnected && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-text-secondary mt-4 text-lg"
            >
              Connecting to server...
            </motion.p>
          )}
        </motion.div>

        {/* Privacy Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-16 text-center"
        >
          <div className="glass-effect rounded-2xl p-8 max-w-xl mx-auto flex flex-col items-center gap-2">
            <Shield className="w-10 h-10 text-accent mb-3 animate-glow" />
            <h3 className="text-text font-bold text-2xl mb-2">
              Privacy First
            </h3>
            <p className="text-text-secondary text-base leading-relaxed">
              All messages are temporary and disappear when the last user leaves the room. <br />
              No data is stored or logged on our servers.
            </p>
          </div>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
              <p className="text-red-400 text-lg">{error}</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Lobby; 