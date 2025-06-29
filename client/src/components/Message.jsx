import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const Message = ({ message, isOwn, formatTime, avatar }) => {
  const isSystem = message.type === 'system';
  
  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex justify-center"
      >
        <div className="bg-chat/80 border border-accent/10 rounded-full px-6 py-2 shadow-glass">
          <p className="text-text-secondary text-base text-center font-medium">
            {message.content}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`flex items-end gap-3 ${isOwn ? 'justify-end flex-row-reverse' : 'justify-start'}`}
    >
      {/* Avatar */}
      <div className="avatar select-none shadow-md border-2 border-accent/30">
        {avatar}
      </div>
      {/* Message bubble */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        className={`message-bubble ${isOwn ? 'own' : ''} relative`}
        style={{ boxShadow: isOwn ? '0 0 0 2px #818cf8' : '0 0 0 1px #1f2937' }}
      >
        {/* Username */}
        {!isOwn && (
          <div className="text-xs text-accent font-bold mb-1 tracking-wide">
            {message.username}
          </div>
        )}
        {/* Message content */}
        <div className="text-base leading-relaxed flex items-center gap-1">
          {message.encrypted && (
            <Shield className="inline-block w-4 h-4 mr-1 text-accent" />
          )}
          {message.content}
        </div>
        {/* Timestamp */}
        <div className={`text-xs mt-2 font-medium ${isOwn ? 'text-background/70' : 'text-timestamp'}`}>
          {formatTime(message.timestamp)}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Message; 