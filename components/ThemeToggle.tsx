'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  try {
    const { theme, toggleTheme } = useTheme();

    return (
      <motion.button
        onClick={toggleTheme}
        className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800/50 dark:bg-slate-800/50 light:bg-blue-100 hover:bg-slate-700/50 dark:hover:bg-slate-700/50 light:hover:bg-blue-200 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
        title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
      >
        <motion.div
          initial={{ opacity: 0, rotate: -180 }}
          animate={{ 
            opacity: theme === 'dark' ? 1 : 0,
            rotate: theme === 'dark' ? 0 : 180
          }}
          transition={{ duration: 0.3 }}
          className="absolute"
        >
          <Moon className="w-5 h-5 text-slate-300 dark:text-slate-300 light:text-blue-600" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, rotate: 180 }}
          animate={{ 
            opacity: theme === 'light' ? 1 : 0,
            rotate: theme === 'light' ? 0 : -180
          }}
          transition={{ duration: 0.3 }}
          className="absolute"
        >
          <Sun className="w-5 h-5 text-yellow-500 dark:text-yellow-500 light:text-[#003B7A]" />
        </motion.div>
      </motion.button>
    );
  } catch (error) {
    // Fallback if theme context is not available
    return null;
  }
}
