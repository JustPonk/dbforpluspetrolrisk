'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, AlertTriangle, Shield, MapPin, Activity, PieChart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import residencesData from '@/data/residences.json';

// Disable static generation
export const dynamic = 'force-dynamic';

export default function EstadisticasPage() {
  const router = useRouter();

  // Calculate global statistics
  const residences = residencesData.residences;
  
  const stats = {
    total: residences.length,
    riesgoAlto: residences.filter(r => r.riskLevel === 'alto').length,
    riesgoMedio: residences.filter(r => r.riskLevel === 'moderado').length,
    riesgoBajo: residences.filter(r => r.riskLevel === 'bajo').length,
    avgRisk: (residences.reduce((acc, r) => acc + r.riskScore, 0) / residences.length).toFixed(1),
    avgThreat: (residences.reduce((acc, r) => acc + r.threatLevel, 0) / residences.length).toFixed(1),
    avgVulnerability: (residences.reduce((acc, r) => acc + r.vulnerabilityLevel, 0) / residences.length).toFixed(1),
    maxRisk: Math.max(...residences.map(r => r.riskScore)),
    minRisk: Math.min(...residences.map(r => r.riskScore)),
    criticalCount: residences.filter(r => r.riskScore >= 7).length,
    avgAccesos: (residences.reduce((acc, r) => acc + r.accesos, 0) / residences.length).toFixed(0),
    avgEntorno: (residences.reduce((acc, r) => acc + r.entorno, 0) / residences.length).toFixed(0),
    avgIluminacion: (residences.reduce((acc, r) => acc + r.iluminacion, 0) / residences.length).toFixed(0),
    avgPerimetro: (residences.reduce((acc, r) => acc + r.perimetro, 0) / residences.length).toFixed(0),
    avgMediosProteccion: (residences.reduce((acc, r) => acc + r.mediosProteccion, 0) / residences.length).toFixed(0),
    avgMediosTecnologicos: (residences.reduce((acc, r) => acc + r.mediosTecnologicos, 0) / residences.length).toFixed(0),
  };

  // Get district distribution
  const districtMap = new Map<string, number>();
  residences.forEach(r => {
    const distrito = r.address.split(',').pop()?.trim().toUpperCase() || 'DESCONOCIDO';
    districtMap.set(distrito, (districtMap.get(distrito) || 0) + 1);
  });
  const districtStats = Array.from(districtMap.entries()).sort((a, b) => b[1] - a[1]);

  // Alerts - residences that need attention
  const alerts = [
    ...residences.filter(r => r.riskScore >= 7).map(r => ({
      residence: r,
      message: `Nivel de riesgo crítico: ${r.riskScore}`,
      severity: 'high' as const,
    })),
    ...residences.filter(r => r.iluminacion >= 60).map(r => ({
      residence: r,
      message: `Iluminación deficiente: ${r.iluminacion}%`,
      severity: 'medium' as const,
    })),
    ...residences.filter(r => r.mediosTecnologicos >= 60).map(r => ({
      residence: r,
      message: `Medios tecnológicos insuficientes: ${r.mediosTecnologicos}%`,
      severity: 'medium' as const,
    })),
  ].slice(0, 6); // Limit to 6 alerts

  return (
    <div className="min-h-screen bg-slate-900 dark:bg-slate-900 light:bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-slate-800 dark:bg-slate-800 light:bg-white border-b border-slate-700 dark:border-slate-700 light:border-blue-200 px-4 md:px-8 py-4 shadow-lg sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 rounded-lg bg-slate-700 dark:bg-slate-700 light:bg-blue-100 hover:bg-slate-600 dark:hover:bg-slate-600 light:hover:bg-blue-200 text-slate-300 dark:text-slate-300 light:text-[#003B7A] transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-blue-400 dark:text-blue-400 light:text-[#003B7A] flex items-center gap-2">
                <Activity className="w-6 h-6" />
                Estadísticas Globales
              </h1>
              <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
                Panel de métricas y KPIs consolidados
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-xl p-4"
          >
            <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mb-1 uppercase font-semibold">Total</div>
            <div className="text-3xl font-bold text-blue-400 dark:text-blue-400 light:text-[#003B7A]">{stats.total}</div>
            <div className="text-xs text-slate-500 dark:text-slate-500 light:text-slate-500 mt-1">residencias</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-xl p-4"
          >
            <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mb-1 uppercase font-semibold">Riesgo Alto</div>
            <div className="text-3xl font-bold text-red-400">{stats.riesgoAlto}</div>
            <div className="text-xs text-slate-500 dark:text-slate-500 light:text-slate-500 mt-1">
              {((stats.riesgoAlto / stats.total) * 100).toFixed(0)}%
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-xl p-4"
          >
            <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mb-1 uppercase font-semibold">Riesgo Medio</div>
            <div className="text-3xl font-bold text-yellow-400">{stats.riesgoMedio}</div>
            <div className="text-xs text-slate-500 dark:text-slate-500 light:text-slate-500 mt-1">
              {((stats.riesgoMedio / stats.total) * 100).toFixed(0)}%
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-xl p-4"
          >
            <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mb-1 uppercase font-semibold">Riesgo Bajo</div>
            <div className="text-3xl font-bold text-green-400">{stats.riesgoBajo}</div>
            <div className="text-xs text-slate-500 dark:text-slate-500 light:text-slate-500 mt-1">
              {((stats.riesgoBajo / stats.total) * 100).toFixed(0)}%
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-xl p-4"
          >
            <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mb-1 uppercase font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Prom. Riesgo
            </div>
            <div className="text-3xl font-bold text-orange-400">{stats.avgRisk}</div>
            <div className="text-xs text-slate-500 dark:text-slate-500 light:text-slate-500 mt-1">
              rango: {stats.minRisk}-{stats.maxRisk}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-xl p-4"
          >
            <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mb-1 uppercase font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Críticas
            </div>
            <div className="text-3xl font-bold text-red-400">{stats.criticalCount}</div>
            <div className="text-xs text-slate-500 dark:text-slate-500 light:text-slate-500 mt-1">
              riesgo ≥ 7
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Distribution Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Risk Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-xl p-6"
            >
              <h2 className="text-lg font-bold text-slate-200 dark:text-slate-200 light:text-[#003B7A] mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Distribución por Nivel de Riesgo
              </h2>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-green-400">Riesgo Bajo</span>
                    <span className="text-sm font-bold text-green-400">{stats.riesgoBajo} ({((stats.riesgoBajo / stats.total) * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="h-3 bg-slate-700 dark:bg-slate-700 light:bg-blue-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats.riesgoBajo / stats.total) * 100}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-green-500 rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-yellow-400">Riesgo Moderado</span>
                    <span className="text-sm font-bold text-yellow-400">{stats.riesgoMedio} ({((stats.riesgoMedio / stats.total) * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="h-3 bg-slate-700 dark:bg-slate-700 light:bg-blue-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats.riesgoMedio / stats.total) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="h-full bg-yellow-500 rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-red-400">Riesgo Alto</span>
                    <span className="text-sm font-bold text-red-400">{stats.riesgoAlto} ({((stats.riesgoAlto / stats.total) * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="h-3 bg-slate-700 dark:bg-slate-700 light:bg-blue-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats.riesgoAlto / stats.total) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full bg-red-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* District Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-xl p-6"
            >
              <h2 className="text-lg font-bold text-slate-200 dark:text-slate-200 light:text-[#003B7A] mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Distribución por Distrito
              </h2>
              <div className="space-y-3">
                {districtStats.map(([distrito, count], index) => (
                  <div key={distrito}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-blue-400 dark:text-blue-400 light:text-[#0066CC]">{distrito}</span>
                      <span className="text-sm font-bold text-slate-300 dark:text-slate-300 light:text-slate-700">{count} ({((count / stats.total) * 100).toFixed(0)}%)</span>
                    </div>
                    <div className="h-2.5 bg-slate-700 dark:bg-slate-700 light:bg-blue-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / stats.total) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                        className="h-full bg-blue-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Average Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-xl p-6"
            >
              <h2 className="text-lg font-bold text-slate-200 dark:text-slate-200 light:text-[#003B7A] mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Promedios de Vulnerabilidades
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mb-1">Accesos</div>
                  <div className="text-2xl font-bold text-slate-200 dark:text-slate-200 light:text-slate-900">{stats.avgAccesos}%</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mb-1">Entorno</div>
                  <div className="text-2xl font-bold text-slate-200 dark:text-slate-200 light:text-slate-900">{stats.avgEntorno}%</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mb-1">Iluminación</div>
                  <div className="text-2xl font-bold text-slate-200 dark:text-slate-200 light:text-slate-900">{stats.avgIluminacion}%</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mb-1">Perímetro</div>
                  <div className="text-2xl font-bold text-slate-200 dark:text-slate-200 light:text-slate-900">{stats.avgPerimetro}%</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mb-1">Protección</div>
                  <div className="text-2xl font-bold text-slate-200 dark:text-slate-200 light:text-slate-900">{stats.avgMediosProteccion}%</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mb-1">Tecnología</div>
                  <div className="text-2xl font-bold text-slate-200 dark:text-slate-200 light:text-slate-900">{stats.avgMediosTecnologicos}%</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Alerts */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
              className="bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-xl p-6 sticky top-24"
            >
              <h2 className="text-lg font-bold text-slate-200 dark:text-slate-200 light:text-[#003B7A] mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Alertas Automáticas
              </h2>
              {alerts.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
                    No hay alertas críticas
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert, index) => (
                    <motion.div
                      key={`${alert.residence.id}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className={`p-3 rounded-lg border cursor-pointer hover:scale-[1.02] transition-transform ${
                        alert.severity === 'high'
                          ? 'bg-red-500/10 border-red-500/30 dark:bg-red-500/10 dark:border-red-500/30 light:bg-red-50 light:border-red-200'
                          : 'bg-yellow-500/10 border-yellow-500/30 dark:bg-yellow-500/10 dark:border-yellow-500/30 light:bg-yellow-50 light:border-yellow-200'
                      }`}
                      onClick={() => {
                        sessionStorage.setItem('selectedResidenceId', alert.residence.id);
                        router.push('/dashboard');
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          alert.severity === 'high' ? 'text-red-400' : 'text-yellow-400'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-blue-400 dark:text-blue-400 light:text-[#0066CC] mb-1">
                            {alert.residence.id}
                          </div>
                          <div className={`text-sm ${
                            alert.severity === 'high' 
                              ? 'text-red-300 dark:text-red-300 light:text-red-700' 
                              : 'text-yellow-300 dark:text-yellow-300 light:text-yellow-700'
                          }`}>
                            {alert.message}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
