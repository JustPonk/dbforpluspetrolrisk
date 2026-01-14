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
        className="fixed top-0 left-0 right-0 z-50 bg-slate-800/95 dark:bg-slate-800/95 light:bg-white/95 backdrop-blur-sm border-b border-slate-700 dark:border-slate-700 light:border-blue-200 shadow-lg"
      >
        <div className="px-4 md:px-8 py-3 md:py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0">
          {/* Dirección de la residencia */}
          <div className="flex flex-col w-full md:w-auto">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-400 light:text-slate-600 uppercase tracking-wider">Dirección</span>
            <span className="text-sm font-semibold text-slate-100 dark:text-slate-100 light:text-slate-900">{residenceAddress}</span>
          </div>

          {/* Selector de residencias */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 w-full md:w-auto">
            <label className="text-xs md:text-sm font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700">
              Cambiar residencia:
            </label>
            <div className="relative w-full md:w-auto flex items-center gap-2">
              <select
                value={selectedResidence.id}
                onChange={(e) => onResidenceChange(e.target.value)}
                className="px-3 md:px-4 py-2 pr-8 md:pr-10 bg-slate-700 dark:bg-slate-700 light:bg-white border-2 border-slate-600 dark:border-slate-600 light:border-blue-200 rounded-lg appearance-none cursor-pointer font-semibold text-slate-100 dark:text-slate-100 light:text-slate-900 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-full md:min-w-[300px] text-sm"
              >
                {allResidences.map((residence) => (
                  <option key={residence.id} value={residence.id}>
                    {residence.id} - {residence.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-400 dark:text-slate-400 light:text-slate-600 pointer-events-none" />

              {/* Botón cerrar */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 md:w-5 md:h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* SECCIÓN 1: Título, Botones y Donut Charts */}
      <section className="min-h-screen snap-start flex flex-col justify-center px-4 md:px-8 lg:px-12 pt-24 md:pt-28 pb-8 bg-slate-900 dark:bg-slate-900 light:bg-gray-50">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 md:mb-8"
        >
          <InfoButtons onOpenModal={onOpenModal} variant="standalone" />
        </motion.div>

        <motion.div
          key="expanded-header"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-pink-500 to-pink-600 text-white text-center py-4 md:py-6 rounded-lg mb-8 md:mb-12 shadow-lg"
        >
          <h3 className="text-lg md:text-2xl lg:text-3xl font-bold px-4 md:px-8">
            A 3 - LOS INDICADORES CLAVE RELACIONADOS CON MI SEGURIDAD PERSONAL
          </h3>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
          {chartData.map((data, index) => (
            <DonutChart key={index} data={data} index={index} isExpanded={true} />
          ))}
        </div>
      </section>

      {/* SECCIÓN 2: Termómetros, Imagen y Speedometer */}
      <section className="min-h-screen snap-start flex items-center p-4 md:p-8 lg:p-12 bg-slate-900 dark:bg-slate-900 light:bg-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 w-full">
          {/* Termómetro de Amenaza */}
          <motion.div
            key="threat-thermometer"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 order-1"
          >
            <ThermometerDisplay
              title="¿Qué tan amenazado estoy?"
              level={selectedResidence.threatLevel}
              description="Esta dimensión evalúa el grado en el que las condiciones de entorno podrían tornarse adversas."
              delay={0.5}
              animationKey="expanded-threat"
              height="h-[400px] md:h-[500px] lg:h-[600px]"
              size="large"
            />
          </motion.div>

          {/* Contenido Central */}
          <motion.div
            key="center-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-8 order-2"
          >
            <div className="space-y-4 md:space-y-6">
              {/* Imagen */}
              <div className="bg-slate-800 dark:bg-slate-800 light:bg-white rounded-xl shadow-xl border border-slate-700 dark:border-slate-700 light:border-blue-200">
                <div className="h-[200px] md:h-[250px] lg:h-[300px] bg-gradient-to-br from-slate-700 to-slate-600 dark:from-slate-700 dark:to-slate-600 light:from-blue-100 light:to-blue-200 rounded-lg flex items-center justify-center overflow-hidden">
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

              {/* Speedometer */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-slate-800 dark:bg-slate-800 light:bg-white rounded-xl shadow-xl border border-slate-700 dark:border-slate-700 light:border-blue-200 min-h-[200px] md:min-h-[260px] flex items-center justify-center"
              >
                <div className="w-full px-4 md:px-6 py-4">
                  <Speedometer 
                    value={selectedResidence.riskScore} 
                    label={currentRiskLevel.level}
                    uniqueId={`expanded-${selectedResidence.id}`}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Termómetro de Vulnerabilidad */}
          <motion.div
            key="vulnerability-thermometer"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="lg:col-span-2 order-3"
          >
            <ThermometerDisplay
              title="¿Qué tan vulnerable soy?"
              level={selectedResidence.vulnerabilityLevel}
              description="Conocer qué amenazas hay en el entorno nos brinda la oportunidad de revisar nuestros controles."
              delay={0.7}
              animationKey="expanded-vulnerability"
              height="h-[400px] md:h-[500px] lg:h-[600px]"
              size="large"
            />
          </motion.div>
        </div>
      </section>

      {/* SECCIÓN 3: Barra de Riesgo y Tarjetas de Recomendación */}
      <section className="min-h-screen snap-start flex flex-col justify-center p-4 md:p-8 lg:p-12 bg-slate-900 dark:bg-slate-900 light:bg-gray-50">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <RiskLevelBar riskScore={selectedResidence.riskScore} />
        </motion.div>

        {/* Tarjetas de Recomendación */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6"
        >
          {/* BAJO */}
          <div className={`rounded-xl p-6 transition-all duration-300 ${
            currentRiskLevel.level === 'BAJO' 
              ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-2xl scale-105' 
              : 'bg-slate-800/40 opacity-40'
          }`}>
            <h3 className="text-xl font-bold text-white mb-3 text-center">BAJO</h3>
            <p className="text-sm text-white mb-4 leading-relaxed">
              Exposición mínima a amenazas y vulnerabilidades. Controles sólidos y entorno estable.
            </p>
            <div className="border-t border-white/30 pt-4">
              <p className="text-xs font-semibold text-white mb-2">RECOMENDACIÓN</p>
              <p className="text-sm text-white">
                Mantenimiento preventivo. Revisión periódica.
              </p>
            </div>
          </div>

          {/* MODERADO */}
          <div className={`rounded-xl p-6 transition-all duration-300 ${
            currentRiskLevel.level === 'MODERADO' 
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-2xl scale-105' 
              : 'bg-slate-800/40 opacity-40'
          }`}>
            <h3 className="text-xl font-bold text-white mb-3 text-center">MODERADO</h3>
            <p className="text-sm text-white mb-4 leading-relaxed">
              Riesgos latentes. Algunas brechas detectables. Entorno con potencial de cambio.
            </p>
            <div className="border-t border-white/30 pt-4">
              <p className="text-xs font-semibold text-white mb-2">RECOMENDACIÓN</p>
              <p className="text-sm text-white">
                Refuerzo de controles. Monitoreo activo.
              </p>
            </div>
          </div>

          {/* MEDIO */}
          <div className={`rounded-xl p-6 transition-all duration-300 ${
            currentRiskLevel.level === 'MEDIO' 
              ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-2xl scale-105' 
              : 'bg-slate-800/40 opacity-40'
          }`}>
            <h3 className="text-xl font-bold text-white mb-3 text-center">MEDIO</h3>
            <p className="text-sm text-white mb-4 leading-relaxed">
              Presencia de amenazas identificadas y vulnerabilidades relevantes. Riesgo de incidentes.
            </p>
            <div className="border-t border-white/30 pt-4">
              <p className="text-xs font-semibold text-white mb-2">RECOMENDACIÓN</p>
              <p className="text-sm text-white">
                Implementación urgente de mejoras. Evaluación técnica integral.
              </p>
            </div>
          </div>

          {/* ALTO */}
          <div className={`rounded-xl p-6 transition-all duration-300 ${
            currentRiskLevel.level === 'ALTO' 
              ? 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-2xl scale-105' 
              : 'bg-slate-800/40 opacity-40'
          }`}>
            <h3 className="text-xl font-bold text-white mb-3 text-center">ALTO</h3>
            <p className="text-sm text-white mb-4 leading-relaxed">
              Riesgo elevado. Múltiples brechas. Entorno hostil o cambiante.
            </p>
            <div className="border-t border-white/30 pt-4">
              <p className="text-xs font-semibold text-white mb-2">RECOMENDACIÓN</p>
              <p className="text-sm text-white">
                Intervención inmediata. Plan de contingencia.
              </p>
            </div>
          </div>

          {/* EXTREMO */}
          <div className={`rounded-xl p-6 transition-all duration-300 ${
            currentRiskLevel.level === 'EXTREMO' 
              ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-2xl scale-105' 
              : 'bg-slate-800/40 opacity-40'
          }`}>
            <h3 className="text-xl font-bold text-white mb-3 text-center">EXTREMO</h3>
            <p className="text-sm text-white mb-4 leading-relaxed">
              Riesgo crítico. Amenaza inminente. Vulnerabilidad estructural.
            </p>
            <div className="border-t border-white/30 pt-4">
              <p className="text-xs font-semibold text-white mb-2">RECOMENDACIÓN</p>
              <p className="text-sm text-white">
                Reubicación, protección especializada, medidas de emergencia.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
