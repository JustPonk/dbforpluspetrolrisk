import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface RiskLevelBarProps {
  riskScore: number;
}

export default function RiskLevelBar({ riskScore }: RiskLevelBarProps) {
  const levels = ['BAJO', 'MODERADO', 'MEDIO', 'ALTO', 'EXTREMO'];
  const colors = ['bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500'];

  // Calcular la posición de la flecha basada en el riskScore (0-100)
  // La flecha debe estar posicionada proporcionalmente en la barra
  const arrowPosition = `${riskScore}%`;

  return (
    <motion.div
      key="risk-levels-bar"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.1 }}
      className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 py-4"
    >
      {/* Contenedor de la barra con la flecha indicadora */}
      <div className="relative px-4 mb-8">
        {/* Barra de gradiente */}
        <div className="h-3 bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-600 rounded-full shadow-lg" />
        
        {/* Flecha indicadora */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.3, type: "spring", stiffness: 200 }}
          className="absolute -top-8"
          style={{ left: arrowPosition, transform: 'translateX(-50%)' }}
        >
          <div className="flex flex-col items-center">
            <div className="bg-white text-slate-900 px-3 py-1 rounded-md font-bold text-sm shadow-lg">
              {riskScore}%
            </div>
            <ChevronDown className="w-6 h-6 text-white drop-shadow-lg" strokeWidth={3} />
          </div>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-5 gap-4 text-center px-4">
        {levels.map((level, index) => (
          <motion.div
            key={level}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 + index * 0.1 }}
            className={`${colors[index]} text-white py-3 rounded-lg font-bold text-xl`}
          >
            {level}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
