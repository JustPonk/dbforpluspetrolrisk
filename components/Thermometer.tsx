'use client';

import { motion } from 'framer-motion';

interface ThermometerProps {
  title: string;
  value: number;
  max: number;
  color: 'red' | 'blue' | 'green' | 'yellow';
}

export default function Thermometer({ title, value, max, color }: ThermometerProps) {
  const percentage = (value / max) * 100;
  
  const colorClasses = {
    red: 'from-red-500 to-red-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
  };

  const bgColors = {
    red: 'bg-red-100',
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    yellow: 'bg-yellow-100',
  };

  return (
    <div className="card text-center">
      <h3 className="text-sm font-bold text-gray-700 mb-4">{title}</h3>
      <div className="flex flex-col items-center">
        <div className={`w-16 h-48 ${bgColors[color]} rounded-full relative overflow-hidden border-2 border-gray-300`}>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`absolute bottom-0 w-full bg-gradient-to-t ${colorClasses[color]}`}
          />
        </div>
        <div className="mt-4">
          <span className="text-3xl font-bold text-gray-800">{value}</span>
          <span className="text-sm text-gray-500">/{max}</span>
        </div>
      </div>
    </div>
  );
}
