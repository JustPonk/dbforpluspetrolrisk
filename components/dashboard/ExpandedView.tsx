import { motion } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';
import DonutChart from './DonutChart';
import ThermometerDisplay from './ThermometerDisplay';
import RiskLevelBar from './RiskLevelBar';
import InfoButtons from './InfoButtons';
import Speedometer from '@/components/Speedometer';

interface ExpandedViewProps {
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
  chartData: Array<{
    name: string;
    value: number;
    color: string;
    label: string;
  }>;
  onOpenModal: (type: 'donut' | 'speedometer' | 'thermometer') => void;
  onClose: () => void;
  residenceName: string;
  residenceAddress: string;
  allResidences: Array<{
    id: string;
    name: string;
    address: string;
  }>;
  onResidenceChange: (residenceId: string) => void;
}

export default function ExpandedView({ 
  selectedResidence, 
  currentRiskLevel, 
  chartData,
  onOpenModal,
  onClose,
  residenceAddress,
  allResidences,
  onResidenceChange
}: ExpandedViewProps) {
  return (
    <>
      {/* Navbar fijo con dirección y selector de residencias */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 shadow-lg"
      >
        <div className="px-8 py-4 flex justify-between items-center">
          {/* Dirección de la residencia */}
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dirección</span>
            <span className="text-sm font-semibold text-slate-100">{residenceAddress}</span>
          </div>

          {/* Selector de residencias */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-semibold text-slate-300">
              Cambiar residencia:
            </label>
            <div className="relative">
              <select
                value={selectedResidence.id}
                onChange={(e) => onResidenceChange(e.target.value)}
                className="px-4 py-2 pr-10 bg-slate-700 border-2 border-slate-600 rounded-lg appearance-none cursor-pointer font-semibold text-slate-100 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-w-[300px]"
              >
                {allResidences.map((residence) => (
                  <option key={residence.id} value={residence.id}>
                    {residence.id} - {residence.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>

            {/* Botón cerrar */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* SECCIÓN 1: Título, Botones y Donut Charts */}
      <section className="min-h-screen snap-start flex flex-col justify-center px-12 pt-24 pb-8 bg-slate-900">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <InfoButtons onOpenModal={onOpenModal} variant="standalone" />
        </motion.div>

        <motion.div
          key="expanded-header"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-pink-500 to-pink-600 text-white text-center py-6 rounded-lg mb-12 shadow-lg"
        >
          <h3 className="text-3xl font-bold px-8">
            A 3 - LOS INDICADORES CLAVE RELACIONADOS CON MI SEGURIDAD PERSONAL
          </h3>
        </motion.div>

        <div className="grid grid-cols-6 gap-6">
          {chartData.map((data, index) => (
            <DonutChart key={index} data={data} index={index} isExpanded={true} />
          ))}
        </div>
      </section>

      {/* SECCIÓN 2: Termómetros, Imagen y Speedometer */}
      <section className="min-h-screen snap-start flex items-center p-12 bg-slate-900">
        <div className="grid grid-cols-12 gap-6 w-full">
          <motion.div
            key="threat-thermometer"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="col-span-2"
          >
            <ThermometerDisplay
              title="¿Qué tan amenazado estoy?"
              level={selectedResidence.threatLevel}
              description="Esta dimensión evalúa el grado en el que las condiciones de entorno podrían tornarse adversas."
              delay={0.5}
              animationKey="expanded-threat"
              height="h-[600px]"
              size="large"
            />
          </motion.div>

          <motion.div
            key="center-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="col-span-8"
          >
            <div className="space-y-6">
              <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700">
                <div className="h-[300px] bg-gradient-to-br from-slate-700 to-slate-600 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={selectedResidence.image}
                    alt={selectedResidence.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400"%3E%3Crect fill="%23ddd" width="600" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23999"%3E' + selectedResidence.name + '%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 min-h-[260px] flex items-center justify-center"
              >
                <div className="w-full px-6 py-4">
                  <Speedometer 
                    value={selectedResidence.riskScore} 
                    label={currentRiskLevel.level}
                    uniqueId={`expanded-${selectedResidence.id}`}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            key="vulnerability-thermometer"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="col-span-2"
          >
            <ThermometerDisplay
              title="¿Qué tan vulnerable soy?"
              level={selectedResidence.vulnerabilityLevel}
              description="Conocer qué amenazas hay en el entorno nos brinda la oportunidad de revisar nuestros controles."
              delay={0.7}
              animationKey="expanded-vulnerability"
              height="h-[600px]"
              size="large"
            />
          </motion.div>
        </div>
      </section>

      {/* SECCIÓN 3: Barra de Riesgo y KPIs (placeholder) */}
      <section className="min-h-screen snap-start flex flex-col justify-center p-12 bg-slate-900">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <RiskLevelBar riskScore={selectedResidence.riskScore} />
        </motion.div>

        {/* Placeholder para KPIs futuros */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 grid grid-cols-4 gap-6"
        >
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">--</div>
            <div className="text-sm text-slate-300">KPI 1</div>
          </div>
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">--</div>
            <div className="text-sm text-slate-300">KPI 2</div>
          </div>
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 text-center">
            <div className="text-4xl font-bold text-yellow-400 mb-2">--</div>
            <div className="text-sm text-slate-300">KPI 3</div>
          </div>
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">--</div>
            <div className="text-sm text-slate-300">KPI 4</div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
