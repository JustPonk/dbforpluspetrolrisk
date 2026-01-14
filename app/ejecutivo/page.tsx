'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, AlertTriangle, Shield, CheckCircle, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import residencesData from '@/data/residences.json';

// Disable static generation
export const dynamic = 'force-dynamic';

export default function DashboardEjecutivoPage() {
  const router = useRouter();

  // Calculate executive-level statistics
  const residences = residencesData.residences;
  
  const stats = {
    total: residences.length,
    riesgoAlto: residences.filter(r => r.riskLevel === 'alto').length,
    riesgoMedio: residences.filter(r => r.riskLevel === 'moderado').length,
    riesgoBajo: residences.filter(r => r.riskLevel === 'bajo').length,
    avgRisk: (residences.reduce((acc, r) => acc + r.riskScore, 0) / residences.length).toFixed(1),
    critical: residences.filter(r => r.riskScore >= 7).length,
    needsAttention: residences.filter(r => r.riskScore >= 5).length,
    compliant: residences.filter(r => r.riskScore < 5).length,
  };

  // Top 3 highest risk
  const topRisk = [...residences]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 3);

  // Critical alerts
  const criticalAlerts = [
    ...residences.filter(r => r.riskScore >= 7).map(r => ({
      residence: r,
      message: `Nivel de riesgo crítico: ${r.riskScore}`,
      priority: 'high' as const,
    })),
    ...residences.filter(r => r.iluminacion >= 60).map(r => ({
      residence: r,
      message: `Iluminación deficiente: ${r.iluminacion}%`,
      priority: 'medium' as const,
    })),
  ].slice(0, 5);

  // Get district summary
  const districtMap = new Map<string, { count: number; avgRisk: number; residences: typeof residences }>();
  residences.forEach(r => {
    const distrito = r.address.split(',').pop()?.trim().toUpperCase() || 'DESCONOCIDO';
    const current = districtMap.get(distrito) || { count: 0, avgRisk: 0, residences: [] };
    current.count++;
    current.residences.push(r);
    districtMap.set(distrito, current);
  });

  // Calculate avg risk per district
  districtMap.forEach((value, key) => {
    value.avgRisk = value.residences.reduce((acc, r) => acc + r.riskScore, 0) / value.count;
  });

  const districtSummary = Array.from(districtMap.entries())
    .map(([distrito, data]) => ({ distrito, ...data }))
    .sort((a, b) => b.avgRisk - a.avgRisk)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-900 dark:bg-slate-900 light:bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 dark:from-blue-900 dark:to-blue-800 light:from-[#003B7A] light:to-[#0066CC] px-4 md:px-8 py-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 rounded-lg bg-blue-800/50 hover:bg-blue-700/50 text-white transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Award className="w-8 h-8" />
                Dashboard Ejecutivo
              </h1>
              <p className="text-blue-200">
                Vista consolidada de KPIs y alertas críticas
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Executive KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
          >
            <div className="text-blue-200 text-sm mb-1 font-semibold uppercase">Total Activos</div>
            <div className="text-4xl font-bold text-white">{stats.total}</div>
            <div className="text-blue-200 text-xs mt-1">residencias bajo gestión</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
          >
            <div className="text-blue-200 text-sm mb-1 font-semibold uppercase">Riesgo Promedio</div>
            <div className="text-4xl font-bold text-white">{stats.avgRisk}</div>
            <div className="text-blue-200 text-xs mt-1">escala 0-10</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-red-500/20 backdrop-blur-sm rounded-xl p-4 border border-red-400/30"
          >
            <div className="text-red-200 text-sm mb-1 font-semibold uppercase flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              Críticas
            </div>
            <div className="text-4xl font-bold text-white">{stats.critical}</div>
            <div className="text-red-200 text-xs mt-1">requieren acción inmediata</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-green-500/20 backdrop-blur-sm rounded-xl p-4 border border-green-400/30"
          >
            <div className="text-green-200 text-sm mb-1 font-semibold uppercase flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Conformes
            </div>
            <div className="text-4xl font-bold text-white">{stats.compliant}</div>
            <div className="text-green-200 text-xs mt-1">{((stats.compliant / stats.total) * 100).toFixed(0)}% del total</div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Alerts & Top Risk */}
          <div className="lg:col-span-2 space-y-6">
            {/* Critical Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-200 dark:text-slate-200 light:text-[#003B7A] flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Alertas Críticas
                </h2>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 dark:bg-red-500/20 dark:text-red-400 light:bg-red-100 light:text-red-700">
                  {criticalAlerts.length} activas
                </span>
              </div>

              {criticalAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <p className="text-slate-400 dark:text-slate-400 light:text-slate-600">
                    No hay alertas críticas en este momento
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {criticalAlerts.map((alert, index) => (
                    <motion.div
                      key={`${alert.residence.id}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + index * 0.05 }}
                      className={`p-4 rounded-lg border cursor-pointer hover:scale-[1.01] transition-transform ${
                        alert.priority === 'high'
                          ? 'bg-red-500/10 border-red-500/30 dark:bg-red-500/10 dark:border-red-500/30 light:bg-red-50 light:border-red-200'
                          : 'bg-yellow-500/10 border-yellow-500/30 dark:bg-yellow-500/10 dark:border-yellow-500/30 light:bg-yellow-50 light:border-yellow-200'
                      }`}
                      onClick={() => {
                        sessionStorage.setItem('selectedResidenceId', alert.residence.id);
                        router.push('/dashboard');
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold text-blue-400 dark:text-blue-400 light:text-[#0066CC]">
                              {alert.residence.id}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-500 light:text-slate-600">
                              {alert.residence.name}
                            </span>
                          </div>
                          <p className={`text-sm font-semibold ${
                            alert.priority === 'high' 
                              ? 'text-red-300 dark:text-red-300 light:text-red-700' 
                              : 'text-yellow-300 dark:text-yellow-300 light:text-yellow-700'
                          }`}>
                            {alert.message}
                          </p>
                        </div>
                        <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${
                          alert.priority === 'high' ? 'text-red-400' : 'text-yellow-400'
                        }`} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Top 3 Highest Risk */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-slate-200 dark:text-slate-200 light:text-[#003B7A] mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Top 3 Mayor Riesgo
              </h2>
              <div className="space-y-3">
                {topRisk.map((residence, index) => (
                  <motion.div
                    key={residence.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + index * 0.05 }}
                    className="p-4 rounded-lg bg-slate-700/30 dark:bg-slate-700/30 light:bg-blue-50 border border-slate-600 dark:border-slate-600 light:border-blue-200 hover:bg-slate-700/50 dark:hover:bg-slate-700/50 light:hover:bg-blue-100 transition-colors cursor-pointer"
                    onClick={() => {
                      sessionStorage.setItem('selectedResidenceId', residence.id);
                      router.push('/dashboard');
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                          <span className="text-lg font-bold text-white">#{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-bold text-blue-400 dark:text-blue-400 light:text-[#0066CC] mb-1">
                            {residence.id}
                          </div>
                          <div className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
                            {residence.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-400">
                          {residence.riskScore}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-500 light:text-slate-600">
                          riesgo
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* District Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-slate-200 dark:text-slate-200 light:text-[#003B7A] mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Resumen por Distrito
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700 dark:border-slate-700 light:border-blue-200">
                      <th className="text-left py-3 px-2 text-xs font-semibold text-slate-400 dark:text-slate-400 light:text-slate-600 uppercase">
                        Distrito
                      </th>
                      <th className="text-center py-3 px-2 text-xs font-semibold text-slate-400 dark:text-slate-400 light:text-slate-600 uppercase">
                        Residencias
                      </th>
                      <th className="text-right py-3 px-2 text-xs font-semibold text-slate-400 dark:text-slate-400 light:text-slate-600 uppercase">
                        Riesgo Prom.
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {districtSummary.map((district, index) => (
                      <tr
                        key={district.distrito}
                        className="border-b border-slate-700/50 dark:border-slate-700/50 light:border-blue-100 hover:bg-slate-700/20 dark:hover:bg-slate-700/20 light:hover:bg-blue-50 transition-colors"
                      >
                        <td className="py-3 px-2 text-sm font-semibold text-blue-400 dark:text-blue-400 light:text-[#0066CC]">
                          {district.distrito}
                        </td>
                        <td className="py-3 px-2 text-center text-sm text-slate-300 dark:text-slate-300 light:text-slate-700">
                          {district.count}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <span className={`text-sm font-bold ${
                            district.avgRisk >= 7 ? 'text-red-400' :
                            district.avgRisk >= 5 ? 'text-yellow-400' :
                            'text-green-400'
                          }`}>
                            {district.avgRisk.toFixed(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Risk Distribution */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
              className="bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-xl p-6 sticky top-24"
            >
              <h2 className="text-lg font-bold text-slate-200 dark:text-slate-200 light:text-[#003B7A] mb-6 text-center">
                Distribución de Riesgo
              </h2>

              {/* Donut Chart */}
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="20"
                    className="text-slate-700 dark:text-slate-700 light:text-blue-100"
                  />
                  
                  {/* Risk segments */}
                  {(() => {
                    const total = stats.total;
                    const circumference = 2 * Math.PI * 40;
                    let offset = 0;
                    
                    const segments = [
                      { count: stats.riesgoBajo, color: '#22c55e', label: 'Bajo' },
                      { count: stats.riesgoMedio, color: '#eab308', label: 'Medio' },
                      { count: stats.riesgoAlto, color: '#ef4444', label: 'Alto' },
                    ];
                    
                    return segments.map((segment, i) => {
                      const percentage = segment.count / total;
                      const strokeDasharray = `${circumference * percentage} ${circumference}`;
                      const strokeDashoffset = -offset * circumference;
                      offset += percentage;
                      
                      return (
                        <circle
                          key={i}
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke={segment.color}
                          strokeWidth="20"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          className="transition-all duration-500"
                        />
                      );
                    });
                  })()}
                </svg>
                
                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-200 dark:text-slate-200 light:text-[#003B7A]">
                      {stats.total}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-500 light:text-slate-600">
                      Total
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 dark:bg-green-500/10 light:bg-green-50">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700">Riesgo Bajo</span>
                  </div>
                  <span className="text-lg font-bold text-green-400">{stats.riesgoBajo}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10 dark:bg-yellow-500/10 light:bg-yellow-50">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700">Riesgo Moderado</span>
                  </div>
                  <span className="text-lg font-bold text-yellow-400">{stats.riesgoMedio}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 dark:bg-red-500/10 light:bg-red-50">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700">Riesgo Alto</span>
                  </div>
                  <span className="text-lg font-bold text-red-400">{stats.riesgoAlto}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-slate-700 dark:border-slate-700 light:border-blue-200">
                <h3 className="text-sm font-bold text-slate-400 dark:text-slate-400 light:text-slate-600 uppercase mb-3">
                  Acciones Rápidas
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => router.push('/comparativa')}
                    className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
                  >
                    Ver Comparativa
                  </button>
                  <button
                    onClick={() => router.push('/estadisticas')}
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 dark:bg-slate-700 light:bg-blue-100 hover:bg-slate-600 dark:hover:bg-slate-600 light:hover:bg-blue-200 text-slate-200 dark:text-slate-200 light:text-[#003B7A] text-sm font-semibold transition-colors"
                  >
                    Panel Completo
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
