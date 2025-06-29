import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

const UserCounter = ({ count }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2 bg-chat/80 border border-accent/10 rounded-full px-5 py-2 shadow-glass backdrop-blur-md"
      style={{ minWidth: 70 }}
    >
      <Users className="w-5 h-5 text-accent" />
      <motion.span
        key={count}
        initial={{ scale: 1.2, color: '#818cf8' }}
        animate={{ scale: 1, color: '#e5e7eb' }}
        transition={{ duration: 0.3 }}
        className="text-text font-bold text-lg"
      >
        {count}
      </motion.span>
      <span className="text-text-secondary text-base font-medium">
        {count === 1 ? 'user' : 'users'}
      </span>
    </motion.div>
  );
};

export default UserCounter; 