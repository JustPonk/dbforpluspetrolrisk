import { motion } from 'framer-motion';
import Speedometer from '@/components/Speedometer';
import ThermometerDisplay from './ThermometerDisplay';

interface CompactViewProps {
  selectedResidence: {
    id: string;
    name: string;
    image: string;
    riskScore: number;
    threatLevel: number;
    vulnerabilityLevel: number;
  };
  currentRiskLevel: {
    level: string;
    color: string;
  };
}

export default function CompactView({ selectedResidence, currentRiskLevel }: CompactViewProps) {
  return (
    <div className="grid grid-cols-[200px_1fr_200px] gap-3 h-[360px]">
      {/* Termómetro de Amenaza - Columna 1 */}
      <ThermometerDisplay
        title="¿Qué tan amenazado estoy?"
        level={selectedResidence.threatLevel}
        description=""
        delay={0.1}
        animationKey="compact-threat"
        height="h-70"
        size="small"
      />

      {/* Imagen y Velocímetro - Columna 2 */}
      <div className="flex flex-col gap-3">
        {/* Imagen arriba */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 h-80"
        >
          <div className="h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
            <img
              src={selectedResidence.image}
              alt={selectedResidence.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400"%3E%3Crect fill="%23ddd" width="600" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23999"%3E' + selectedResidence.name + '%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>
        </motion.div>

        {/* Velocímetro abajo */}
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 h-[215px]"
        >
          <Speedometer 
            value={selectedResidence.riskScore} 
            label={currentRiskLevel.level}
            uniqueId={selectedResidence.id}
          />
        </motion.div>
      </div>

      {/* Termómetro de Vulnerabilidad - Columna 3 */}
      <ThermometerDisplay
        title="¿Qué tan vulnerable soy?"
        level={selectedResidence.vulnerabilityLevel}
        description=""
        delay={0.2}
        animationKey="compact-vulnerability"
        height="h-70"
        size="small"
      />
    </div>
  );
}
