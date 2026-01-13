import { motion } from 'framer-motion';

interface ThermometerDisplayProps {
  title: string;
  level: number;
  description: string;
  delay?: number;
  animationKey: string;
  height?: string;
  size?: 'small' | 'large';
}

export default function ThermometerDisplay({ 
  title, 
  level, 
  description, 
  delay = 0, 
  animationKey,
  height = 'h-64',
  size = 'large'
}: ThermometerDisplayProps) {
  const isSmall = size === 'small';
  
  // Interpolate colors based on exact level value for smooth gradients
  const getLiquidColor = () => {
    if (level <= 20) return '#22c55e'; // green
    if (level <= 40) return '#3b82f6'; // blue
    if (level <= 60) return '#eab308'; // yellow
    if (level <= 80) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  const getGlowColor = () => {
    if (level <= 20) return 'rgba(34, 197, 94, 0.5)';
    if (level <= 40) return 'rgba(59, 130, 246, 0.5)';
    if (level <= 60) return 'rgba(234, 179, 8, 0.5)';
    if (level <= 80) return 'rgba(249, 115, 22, 0.5)';
    return 'rgba(239, 68, 68, 0.5)';
  };

  // Create measurement marks (0, 20, 40, 60, 80, 100)
  const marks = [0, 20, 40, 60, 80, 100];

  return (
    <motion.div
      key={animationKey}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay }}
      className={`bg-slate-800 rounded-xl shadow-xl border border-slate-700 ${height}`}
    >
      <div className="flex flex-col items-center justify-between h-full p-4">
        <h3 className={`${isSmall ? 'text-sm' : 'text-base'} font-bold text-slate-200 text-center`}>
          {title}
        </h3>
        
        {/* Termómetro clásico */}
        <div className="flex items-center gap-3 flex-1 py-4">
          {/* Marcas de medición */}
          <div className="flex flex-col justify-between h-full text-xs text-slate-400 font-medium">
            {marks.reverse().map((mark) => (
              <div key={mark} className="flex items-center">
                <span>{mark}</span>
              </div>
            ))}
          </div>

          {/* Tubo del termómetro */}
          <div className="relative flex flex-col items-center h-full">
            {/* Tubo superior */}
            <div 
              className="w-8 flex-1 bg-slate-700/50 border-2 border-slate-600 rounded-t-full relative overflow-hidden backdrop-blur-sm"
              style={{ 
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)',
              }}
            >
              {/* Líquido animado */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${level}%` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: delay + 0.2 }}
                className="absolute bottom-0 w-full"
                style={{ 
                  backgroundColor: getLiquidColor(),
                  boxShadow: `0 0 20px ${getGlowColor()}, inset 0 0 10px rgba(255,255,255,0.2)`
                }}
              >
                {/* Efecto de brillo en el líquido */}
                <div 
                  className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-white/30 to-transparent"
                  style={{ borderRadius: '0 0 0 50%' }}
                />
              </motion.div>

              {/* Líneas de medición dentro del tubo */}
              {marks.reverse().map((mark) => (
                <div
                  key={mark}
                  className="absolute w-full border-t border-slate-600/30"
                  style={{ bottom: `${mark}%` }}
                />
              ))}
            </div>

            {/* Bulbo inferior */}
            <div 
              className="relative w-16 h-16 -mt-2"
              style={{ filter: `drop-shadow(0 0 12px ${getGlowColor()})` }}
            >
              {/* Bulbo exterior */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: delay + 0.5, type: "spring" }}
                className="w-full h-full rounded-full border-4 border-slate-600 relative overflow-hidden"
                style={{ 
                  backgroundColor: getLiquidColor(),
                  boxShadow: `0 0 30px ${getGlowColor()}, inset 0 0 20px rgba(255,255,255,0.2)`
                }}
              >
                {/* Efecto de brillo en el bulbo */}
                <div 
                  className="absolute top-2 left-2 w-6 h-6 bg-white/40 rounded-full blur-sm"
                />
                
                {/* Número del nivel */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-lg drop-shadow-lg">
                    {level}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Marcas de tick */}
          <div className="flex flex-col justify-between h-full">
            {marks.reverse().map((mark) => (
              <div key={mark} className="w-2 h-0.5 bg-slate-600" />
            ))}
          </div>
        </div>

        {description && (
          <div className="text-xs text-slate-400 text-center px-2">
            <p className="leading-relaxed">
              {description}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
