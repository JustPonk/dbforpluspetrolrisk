'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, BarChart3, Map } from 'lucide-react';
import residencesData from '@/data/residences.json';
import RoutesViewDesktop from '@/components/RoutesViewDesktop';
import CompactView from '@/components/dashboard/CompactView';
import ExpandedView from '@/components/dashboard/ExpandedView';
import InfoModal from '@/components/dashboard/InfoModal';
import ThemeToggle from '@/components/ThemeToggle';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const [selectedResidence, setSelectedResidence] = useState(residencesData.residences[0]);
  const [currentView, setCurrentView] = useState<'main' | 'risk' | 'routes'>('main');
  const [isExpanded, setIsExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'donut' | 'speedometer' | 'thermometer' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkWidth = () => setIsDesktop(window.innerWidth >= 768);
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'bajo': return 'bg-green-100 text-green-800 border-green-300';
      case 'medio': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'alto': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCurrentRiskLevel = (score: number) => {
    if (score <= 20) return { level: 'BAJO', color: '#22c55e' };
    if (score <= 40) return { level: 'MODERADO', color: '#3b82f6' };
    if (score <= 60) return { level: 'MEDIO', color: '#eab308' };
    if (score <= 80) return { level: 'ALTO', color: '#f97316' };
    return { level: 'EXTREMO', color: '#ef4444' };
  };

  const currentRiskLevel = getCurrentRiskLevel(selectedResidence.riskScore);

  const chartData = [
    { name: 'Accesos', value: 75, color: '#22c55e', label: 'ACCESOS' },
    { name: 'Entorno', value: 60, color: '#3b82f6', label: 'ENTORNO' },
    { name: 'Iluminación', value: 80, color: '#eab308', label: 'ILUMINACIÓN' },
    { name: 'Perímetro', value: 70, color: '#f97316', label: 'PERÍMETRO' },
    { name: 'Medios de Protección', value: 65, color: '#ef4444', label: 'MEDIOS DE PROTECCIÓN' },
    { name: 'Medios Tecnológicos', value: 55, color: '#8b5cf6', label: 'MEDIOS TECNOLÓGICOS' },
  ];

  const handleOpenModal = (type: 'donut' | 'speedometer' | 'thermometer') => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalType(null);
  };

  const handleResidenceChange = (residenceId: string) => {
    const residence = residencesData.residences.find(r => r.id === residenceId);
    if (residence) setSelectedResidence(residence);
  };

  const menuItems = [
    { id: 'main' as const, label: 'Principal', icon: Home },
    { id: 'risk' as const, label: 'Dashboard Riesgos', icon: BarChart3 },
    { id: 'routes' as const, label: 'Rutas', icon: Map },
  ];

  return (
    <div className="flex h-screen bg-slate-900 dark:bg-slate-900 light:bg-gray-50">
      {/* Sidebar - Hidden on mobile, visible on desktop, hidden when expanded view is active */}
      {!isExpanded && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: (mobileMenuOpen || isDesktop) ? 0 : -256, opacity: 1 }}
          className="fixed md:relative w-64 h-full bg-gradient-to-b from-slate-800 via-blue-900 to-slate-800 dark:from-slate-800 dark:via-blue-900 dark:to-slate-800 light:from-slate-100 light:via-blue-50 light:to-slate-100 text-white dark:text-white light:text-slate-900 shadow-xl border-r border-slate-700 dark:border-slate-700 light:border-slate-200 z-50"
        >
        <div className="p-4 md:p-6">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h1 className="text-xl md:text-2xl font-bold text-blue-400 dark:text-blue-400 light:text-blue-600">Pluspetrol</h1>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-white dark:text-white light:text-slate-900"
            >
              ✕
            </button>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    currentView === item.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-slate-700/50 dark:bg-slate-700/50 light:bg-slate-200/50 hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-slate-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold">{item.label}</span>
                </motion.button>
              );
            })}
          </nav>
          
          {/* Theme Toggle in Sidebar */}
          <div className="mt-8 pt-8 border-t border-slate-700 dark:border-slate-700 light:border-slate-300">
            <ThemeToggle />
          </div>
        </div>
      </motion.div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Menu Button - Hidden when expanded */}
        {!isExpanded && (
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden fixed top-4 left-4 z-40 bg-blue-600 text-white p-2 rounded-lg shadow-lg"
          >
            ☰
          </button>
        )}

        {/* Top Bar - Hidden when dark:bg-slate-800 light:bg-white border-b border-slate-700 dark:border-slate-700 light:border-slate-200 px-4 md:px-8 py-3 md:py-4 shadow-sm"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
            <label className="text-xs md:text-sm font-semibold text-slate-200 dark:text-slate-200 light:text-slate-700">
              Residencia:
            </label>
            <select
              value={selectedResidence.id}
              onChange={(e) => {
                const residence = residencesData.residences.find(r => r.id === e.target.value);
                if (residence) setSelectedResidence(residence);
              }}
              className="w-full md:w-auto px-3 md:px-4 py-1.5 md:py-2 pr-8 md:pr-10 bg-slate-700 dark:bg-slate-700 light:bg-slate-100 border-2 border-slate-600 dark:border-slate-600 light:border-slate-300 rounded-lg cursor-pointer font-semibold text-xs md:text-sm text-slate-100 dark:text-slate-100 light:text-slate-900 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              {residencesData.residences.map((residence) => (
                <option key={residence.id} value={residence.id}>
                  {residence.id} - {residence.name}
                </option>
              ))}
            </select>
            
            <div className="md:ml-auto flex items-center gap-3">
              <div className="text-xs md:text-sm text-slate-300 dark:text-slate-300 light:text-slate-600 truncate">
                <span className="font-semibold">{selectedResidence.address}</span>
              </div>
              <div className="hidden md:block">
                <ThemeToggle />
              </div
              ))}
            </select>dark:bg-slate-900 light:bg-gray-50 
            
            <div className="md:ml-auto text-xs md:text-sm text-slate-300 truncate max-w-full md:max-w-none">
              <span className="font-semibold">{selectedResidence.address}</span>
            </div>
          </div>
        </motion.div>
        )}

        {/* Content Area */}
        <div className={`flex-1 overflow-auto bg-slate-900 dark:bg-slate-900 light:bg-gray-50 ${currentView === 'routes' ? '' : 'p-4 md:p-8'}`}>
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={currentView === 'routes' ? 'h-full' : ''}
          >
            {currentView === 'main' && (
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-6">
                  {/* Tarjeta Principal */}
                  <div className="lg:col-span-7 bg-slate-800 dark:bg-slate-800 light:bg-white rounded-xl shadow-xl border border-slate-700 dark:border-slate-700 light:border-slate-200 p-4 md:p-6">
                    <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-600 dark:from-slate-700 dark:to-slate-600 light:from-slate-200 light:to-slate-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                      <img
                        src={selectedResidence.image}
                        alt={selectedResidence.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.innerHTML = '<div class="text-slate-400 dark:text-slate-400 light:text-slate-600 text-center">Imagen no disponible</div>';
                          }
                        }}
                      />
                    </div>

                    <h2 className="text-xl md:text-2xl font-bold text-blue-400 dark:text-blue-400 light:text-blue-600 mb-2">
                      {selectedResidence.name}
                    </h2>

                    <div className="flex items-center gap-2 text-slate-300 dark:text-slate-300 light:text-slate-600 mb-3">
                      <span className="text-xs md:text-sm">{selectedResidence.address}</span>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs md:text-sm font-semibold text-slate-200 dark:text-slate-200 light:text-slate-700">Nivel de Riesgo:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 uppercase ${getRiskColor(selectedResidence.riskLevel)}`}>
                        {selectedResidence.riskLevel}
                      </span>
                    </div>

                    <div className="bg-slate-700 dark:bg-slate-700 light:bg-slate-100 rounded-lg p-4 border-2 border-slate-600 dark:border-slate-600 light:border-slate-300">
                      <h3 className="font-bold text-blue-400 dark:text-blue-400 light:text-blue-600 mb-3">Teléfonos de Emergencia</h3>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="text-center">
                          <div className="font-semibold text-slate-300 dark:text-slate-300 light:text-slate-600">Policía</div>
                          <div className="text-lg font-bold text-blue-400 dark:text-blue-400 light:text-blue-600">{selectedResidence.emergencyContacts.police}</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-slate-300 dark:text-slate-300 light:text-slate-600">Bomberos</div>
                          <div className="text-lg font-bold text-blue-400 dark:text-blue-400 light:text-blue-600">{selectedResidence.emergencyContacts.fire}</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-slate-300 dark:text-slate-300 light:text-slate-600">Ambulancia</div>
                          <div className="text-lg font-bold text-blue-400 dark:text-blue-400 light:text-blue-600">{selectedResidence.emergencyContacts.ambulance}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Panel de Estadísticas */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-slate-800 dark:bg-slate-800 light:bg-white rounded-xl shadow-xl border border-slate-700 dark:border-slate-700 light:border-slate-200 p-4 md:p-6">
                      <h3 className="text-lg md:text-xl font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 mb-4">Evaluación de Seguridad</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-300 dark:text-slate-300 light:text-slate-600">Riesgo General</span>
                            <span className="text-blue-400 dark:text-blue-400 light:text-blue-600 font-bold">{selectedResidence.riskScore}/100</span>
                          </div>
                          <div className="w-full bg-slate-700 dark:bg-slate-700 light:bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${selectedResidence.riskScore}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-300 dark:text-slate-300 light:text-slate-600">Amenaza</span>
                            <span className="text-red-400 dark:text-red-400 light:text-red-600 font-bold">{selectedResidence.threatLevel}/100</span>
                          </div>
                          <div className="w-full bg-slate-700 dark:bg-slate-700 light:bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${selectedResidence.threatLevel}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-300 dark:text-slate-300 light:text-slate-600">Vulnerabilidad</span>
                            <span className="text-yellow-400 dark:text-yellow-400 light:text-yellow-600 font-bold">{selectedResidence.vulnerabilityLevel}/100</span>
                          </div>
                          <div className="w-full bg-slate-700 dark:bg-slate-700 light:bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${selectedResidence.vulnerabilityLevel}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentView === 'risk' && !isExpanded && (
              <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-white dark:text-white light:text-slate-900">Dashboard de Riesgos</h2>
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    Vista Expandida
                  </button>
                </div>
                <CompactView 
                  selectedResidence={selectedResidence}
                  currentRiskLevel={currentRiskLevel}
                />
              </div>
            )}

            {currentView === 'risk' && isExpanded && (
              <div className="fixed inset-0 z-40 bg-slate-900 dark:bg-slate-900 light:bg-gray-50 overflow-y-auto snap-y snap-mandatory">
                <ExpandedView
                  selectedResidence={selectedResidence}
                  currentRiskLevel={currentRiskLevel}
                  chartData={chartData}
                  onOpenModal={handleOpenModal}
                  onClose={() => setIsExpanded(false)}
                  residenceName={selectedResidence.name}
                  residenceAddress={selectedResidence.address}
                  allResidences={residencesData.residences}
                  onResidenceChange={handleResidenceChange}
                />
              </div>
            )}

            {currentView === 'routes' && (
              <RoutesViewDesktop 
                residenceId={selectedResidence.id}
                residenceName={selectedResidence.name}
                residenceAddress={selectedResidence.address}
              />
            )}
          </motion.div>
        </div>
      </div>

      {/* Modal de información */}
      <InfoModal 
        isOpen={modalOpen}
        type={modalType}
        onClose={handleCloseModal}
      />
    </div>
  );
}
