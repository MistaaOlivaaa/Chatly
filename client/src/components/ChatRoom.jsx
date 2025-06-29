import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Copy, Check, ArrowLeft, Users, Wifi, WifiOff, Sparkles } from 'lucide-react';
import useWebSocket from '../hooks/useWebSocket';
import Message from './Message';
import UserCounter from './UserCounter';

const ChatRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userCount, setUserCount] = useState(1);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { isConnected, messages, sendMessage, userInfo, error } = useWebSocket('ws://localhost:3001');

  // Join room on mount
  useEffect(() => {
    if (isConnected && roomId) {
      sendMessage({ type: 'join_room', roomId });
    }
  }, [isConnected, roomId, sendMessage]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle typing indicator
  useEffect(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (isTyping) {
      sendMessage({ type: 'typing', isTyping: true });
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        sendMessage({ type: 'typing', isTyping: false });
      }, 3000);
    } else {
      sendMessage({ type: 'typing', isTyping: false });
    }
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [isTyping, sendMessage]);

  // Update user count from messages
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.type === 'system' && lastMessage.content.includes('users')) {
      const match = lastMessage.content.match(/\((\d+) users?\)/);
      if (match) {
        setUserCount(parseInt(match[1]));
      }
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !isConnected) return;
    sendMessage({
      type: 'send_message',
      content: message.trim(),
      encrypted: false
    });
    setMessage('');
    setIsTyping(false);
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
    }
  };

  const copyRoomUrl = async () => {
    const url = `${window.location.origin}/room/${roomId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Generate avatar (initials)
  const getAvatar = (username) => {
    if (!username) return '?';
    return username.split(/(?=[A-Z])/).map(s => s[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background/95">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl mx-auto glass-effect rounded-3xl mt-8 mb-4 px-8 py-6 shadow-glass border border-accent/10"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="btn-secondary p-2"
              title="Back to Lobby"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-text font-bold text-2xl flex items-center gap-2">
                <Sparkles className="w-7 h-7 text-accent animate-glow" />
                Room: <span className="tracking-widest text-accent">{roomId}</span>
              </h1>
              <div className="flex items-center gap-2 text-text-secondary text-base mt-1">
                {isConnected ? (
                  <Wifi className="w-5 h-5 text-accent" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-400" />
                )}
                <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <UserCounter count={userCount} />
            <button
              onClick={copyRoomUrl}
              className="btn-secondary p-2"
              title="Copy room URL"
            >
              {copied ? (
                <Check className="w-6 h-6 text-accent" />
              ) : (
                <Copy className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Chat Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl flex-1 flex flex-col glass-effect rounded-3xl shadow-glass px-0 md:px-8 py-6 mb-8"
        style={{ minHeight: '60vh' }}
      >
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-2 space-y-6">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <Message
                key={msg.id || index}
                message={msg}
                isOwn={userInfo?.username === msg.username}
                formatTime={formatTime}
                avatar={getAvatar(msg.username)}
              />
            ))}
          </AnimatePresence>
          {/* Typing indicator */}
          {typingUsers.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-text-secondary text-base mt-2"
            >
              <div className="flex space-x-1">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity }} className="w-2 h-2 bg-accent rounded-full" />
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 bg-accent rounded-full" />
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 bg-accent rounded-full" />
              </div>
              <span>{Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...</span>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* Message Input */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSendMessage}
          className="flex items-center gap-4 mt-6 px-4 md:px-8"
        >
          <input
            type="text"
            value={message}
            onChange={handleTyping}
            placeholder="Type your message..."
            className="input-field flex-1 text-lg shadow-md"
            disabled={!isConnected}
            autoFocus
          />
          <button
            type="submit"
            disabled={!message.trim() || !isConnected}
            className="btn-primary p-4 rounded-full shadow-accent disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            style={{ minWidth: 56, minHeight: 56 }}
            title="Send"
          >
            <Send className="w-7 h-7" />
          </button>
        </motion.form>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
        >
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ChatRoom; 