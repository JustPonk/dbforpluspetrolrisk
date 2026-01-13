import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  type: 'donut' | 'speedometer' | 'thermometer' | null;
  onClose: () => void;
}

export default function InfoModal({ isOpen, type, onClose }: InfoModalProps) {
  return (
    <AnimatePresence>
      {isOpen && type && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-8 border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-8 h-8 text-blue-400" />
                <h2 className="text-3xl font-bold text-blue-400">
                  {type === 'donut' && 'Gráficos de Dona (Donut Charts)'}
                  {type === 'speedometer' && 'Velocímetro de Riesgo'}
                  {type === 'thermometer' && 'Termómetros de Amenaza y Vulnerabilidad'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 text-slate-300 leading-relaxed">
              {type === 'donut' && (
                <>
                  <p className="text-lg">
                    Los <strong>gráficos de dona</strong> representan visualmente el porcentaje de cumplimiento
                    o nivel de riesgo de cada indicador clave de seguridad personal.
                  </p>
                  <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
                    <h3 className="font-bold text-blue-400 mb-2">Indicadores evaluados:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>Accesos:</strong> Control de entradas y salidas de la residencia</li>
                      <li><strong>Entorno:</strong> Seguridad del área circundante</li>
                      <li><strong>Iluminación:</strong> Niveles de iluminación perimetral y accesos</li>
                      <li><strong>Perímetro:</strong> Estado de muros, rejas y barreras físicas</li>
                      <li><strong>Medios de Protección:</strong> Sistemas de alarma, candados, cerraduras</li>
                      <li><strong>Medios Tecnológicos:</strong> Cámaras, sensores y tecnología de seguridad</li>
                    </ul>
                  </div>
                  <p>
                    Un porcentaje más alto indica mejor cumplimiento de las medidas de seguridad en esa categoría.
                  </p>
                </>
              )}

              {type === 'speedometer' && (
                <>
                  <p className="text-lg">
                    El <strong>velocímetro de riesgo</strong> muestra el nivel general de riesgo de seguridad
                    de la residencia en una escala de 0 a 100.
                  </p>
                  <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
                    <h3 className="font-bold text-slate-100 mb-2">Niveles de riesgo:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <strong>0-20: BAJO</strong> - Riesgo mínimo, controles adecuados
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <strong>21-40: MODERADO</strong> - Riesgo controlado, mejoras recomendadas
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                        <strong>41-60: MEDIO</strong> - Atención requerida, implementar controles
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-orange-500 rounded"></div>
                        <strong>61-80: ALTO</strong> - Acción inmediata necesaria
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <strong>81-100: EXTREMO</strong> - Riesgo crítico, intervención urgente
                      </li>
                    </ul>
                  </div>
                  <p>
                    La aguja del velocímetro indica la posición exacta del nivel de riesgo calculado.
                  </p>
                </>
              )}

              {type === 'thermometer' && (
                <>
                  <p className="text-lg">
                    Los <strong>termómetros</strong> miden dos dimensiones críticas de la seguridad:
                    amenaza y vulnerabilidad.
                  </p>
                  <div className="grid grid-cols-2 gap-4 my-4">
                    <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
                      <h3 className="font-bold text-red-400 mb-2">¿Qué tan amenazado estoy?</h3>
                      <p className="text-sm">
                        Evalúa el nivel de amenazas externas presentes en el entorno de la residencia,
                        como criminalidad del sector, incidentes previos, y factores de riesgo externos.
                      </p>
                    </div>
                    <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
                      <h3 className="font-bold text-orange-400 mb-2">¿Qué tan vulnerable soy?</h3>
                      <p className="text-sm">
                        Mide las debilidades internas de la residencia, como falta de controles de seguridad,
                        accesos sin protección, o ausencia de sistemas de alarma.
                      </p>
                    </div>
                  </div>
                  <p>
                    Un nivel más alto en el termómetro indica mayor amenaza o vulnerabilidad.
                    La combinación de ambos factores determina el nivel de riesgo general.
                  </p>
                  <div className="bg-slate-700 p-3 rounded-lg mt-4 border border-slate-600">
                    <p className="text-sm font-semibold text-blue-400">
                      💡 Conocer ambas dimensiones permite implementar controles específicos y reducir
                      efectivamente el riesgo de seguridad.
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-semibold"
              >
                Entendido
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
