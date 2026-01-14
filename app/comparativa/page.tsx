'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart3, TrendingUp, TrendingDown, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import residencesData from '@/data/residences.json';

// Disable static generation
export const dynamic = 'force-dynamic';

type SortField = 'riskScore' | 'threatLevel' | 'vulnerabilityLevel';
type SortOrder = 'asc' | 'desc';

export default function ComparativaPage() {
  const router = useRouter();
  const [sortField, setSortField] = useState<SortField>('riskScore');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterDistrito, setFilterDistrito] = useState<string | null>(null);

  // Get unique districts
  const distritos = Array.from(
    new Set(
      residencesData.residences.map(r => 
        r.address.split(',').pop()?.trim().toUpperCase() || 'DESCONOCIDO'
      )
    )
  ).sort();

  // Filter and sort residences
  const filteredResidences = residencesData.residences
    .filter(r => {
      if (!filterDistrito) return true;
      const distrito = r.address.split(',').pop()?.trim().toUpperCase();
      return distrito === filterDistrito;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });

  // Calculate stats
  const stats = {
    total: filteredResidences.length,
    avgRisk: (filteredResidences.reduce((acc, r) => acc + r.riskScore, 0) / filteredResidences.length).toFixed(1),
    avgThreat: (filteredResidences.reduce((acc, r) => acc + r.threatLevel, 0) / filteredResidences.length).toFixed(1),
    avgVuln: (filteredResidences.reduce((acc, r) => acc + r.vulnerabilityLevel, 0) / filteredResidences.length).toFixed(1),
    maxRisk: Math.max(...filteredResidences.map(r => r.riskScore)),
    minRisk: Math.min(...filteredResidences.map(r => r.riskScore)),
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 7) return 'text-red-500';
    if (score >= 5) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getRiskBgColor = (score: number) => {
    if (score >= 7) return 'bg-red-500/20 dark:bg-red-500/20 light:bg-red-100';
    if (score >= 5) return 'bg-yellow-500/20 dark:bg-yellow-500/20 light:bg-yellow-100';
    return 'bg-green-500/20 dark:bg-green-500/20 light:bg-green-100';
  };

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
                <BarChart3 className="w-6 h-6" />
                Comparativa de Residencias
              </h1>
              <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
                Análisis comparativo de riesgos y vulnerabilidades
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Filters */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterDistrito(null)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
              filterDistrito === null
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 dark:bg-slate-700 light:bg-blue-100 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-slate-600 dark:hover:bg-slate-600 light:hover:bg-blue-200'
            }`}
          >
            Todos los Distritos
          </button>
          {distritos.map(distrito => (
            <button
              key={distrito}
              onClick={() => setFilterDistrito(distrito)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
                filterDistrito === distrito
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 dark:bg-slate-700 light:bg-blue-100 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-slate-600 dark:hover:bg-slate-600 light:hover:bg-blue-200'
              }`}
            >
              {distrito}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-xl p-4">
            <div className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 mb-1">Total</div>
            <div className="text-2xl font-bold text-blue-400 dark:text-blue-400 light:text-[#003B7A]">{stats.total}</div>
          </div>
          <div className="bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-xl p-4">
            <div className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 mb-1">Riesgo Prom.</div>
            <div className="text-2xl font-bold text-yellow-400 dark:text-yellow-400 light:text-yellow-600">{stats.avgRisk}</div>
          </div>
          <div className="bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-xl p-4">
            <div className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 mb-1">Amenaza Prom.</div>
            <div className="text-2xl font-bold text-orange-400 dark:text-orange-400 light:text-orange-600">{stats.avgThreat}</div>
          </div>
          <div className="bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-xl p-4">
            <div className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 mb-1">Vuln. Prom.</div>
            <div className="text-2xl font-bold text-purple-400 dark:text-purple-400 light:text-purple-600">{stats.avgVuln}</div>
          </div>
          <div className="bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-xl p-4">
            <div className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 mb-1">Rango</div>
            <div className="text-lg font-bold text-slate-300 dark:text-slate-300 light:text-slate-700">
              {stats.minRisk} - {stats.maxRisk}
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-200 dark:text-slate-200 light:text-[#003B7A] mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Gráfico Comparativo - {sortField === 'riskScore' ? 'Riesgo' : sortField === 'threatLevel' ? 'Amenaza' : 'Vulnerabilidad'}
          </h2>
          <div className="space-y-3">
            {filteredResidences.map((residence, index) => {
              const value = residence[sortField];
              const maxValue = Math.max(...filteredResidences.map(r => r[sortField]));
              const percentage = (value / maxValue) * 100;
              
              return (
                <div key={residence.id} className="group">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="flex items-center gap-2 w-40 flex-shrink-0">
                      {index < 3 && (
                        <Award className={`w-4 h-4 ${
                          index === 0 ? 'text-yellow-400' : 
                          index === 1 ? 'text-gray-400' : 
                          'text-orange-700'
                        }`} />
                      )}
                      <span className="text-sm font-semibold text-blue-400 dark:text-blue-400 light:text-[#0066CC] truncate">
                        {residence.id}
                      </span>
                    </div>
                    <div className="flex-1 relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: index * 0.05 }}
                        className={`h-8 rounded-lg ${getRiskBgColor(value)} flex items-center justify-end px-3 relative overflow-hidden group-hover:shadow-lg transition-shadow`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10"></div>
                        <span className={`text-sm font-bold ${getRiskColor(value)} relative z-10`}>
                          {value.toFixed(1)}
                        </span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ranking Table */}
        <div className="bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-700 dark:border-slate-700 light:border-blue-200">
            <h2 className="text-xl font-bold text-slate-200 dark:text-slate-200 light:text-[#003B7A] flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Tabla de Rankings
            </h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50 dark:bg-slate-700/50 light:bg-blue-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-[#003B7A] uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-[#003B7A] uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-[#003B7A] uppercase tracking-wider">
                    Nombre
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-[#003B7A] uppercase tracking-wider cursor-pointer hover:bg-slate-600/50 dark:hover:bg-slate-600/50 light:hover:bg-blue-100 transition-colors"
                    onClick={() => handleSort('riskScore')}
                  >
                    <div className="flex items-center gap-1">
                      Riesgo
                      {sortField === 'riskScore' && (
                        sortOrder === 'desc' ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-[#003B7A] uppercase tracking-wider cursor-pointer hover:bg-slate-600/50 dark:hover:bg-slate-600/50 light:hover:bg-blue-100 transition-colors"
                    onClick={() => handleSort('threatLevel')}
                  >
                    <div className="flex items-center gap-1">
                      Amenaza
                      {sortField === 'threatLevel' && (
                        sortOrder === 'desc' ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-[#003B7A] uppercase tracking-wider cursor-pointer hover:bg-slate-600/50 dark:hover:bg-slate-600/50 light:hover:bg-blue-100 transition-colors"
                    onClick={() => handleSort('vulnerabilityLevel')}
                  >
                    <div className="flex items-center gap-1">
                      Vulnerabilidad
                      {sortField === 'vulnerabilityLevel' && (
                        sortOrder === 'desc' ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-[#003B7A] uppercase tracking-wider">
                    Nivel
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700 dark:divide-slate-700 light:divide-blue-100">
                {filteredResidences.map((residence, index) => (
                  <motion.tr
                    key={residence.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-700/30 dark:hover:bg-slate-700/30 light:hover:bg-blue-50 transition-colors cursor-pointer"
                    onClick={() => {
                      sessionStorage.setItem('selectedResidenceId', residence.id);
                      router.push('/dashboard');
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-slate-400 dark:text-slate-400 light:text-slate-600">
                          #{index + 1}
                        </span>
                        {index < 3 && (
                          <Award className={`w-5 h-5 ${
                            index === 0 ? 'text-yellow-400' : 
                            index === 1 ? 'text-gray-400' : 
                            'text-orange-700'
                          }`} />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-blue-400 dark:text-blue-400 light:text-[#0066CC]">
                        {residence.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-200 dark:text-slate-200 light:text-slate-900">
                        {residence.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-lg font-bold ${getRiskColor(residence.riskScore)}`}>
                        {residence.riskScore.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-lg font-bold ${getRiskColor(residence.threatLevel)}`}>
                        {residence.threatLevel.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-lg font-bold ${getRiskColor(residence.vulnerabilityLevel)}`}>
                        {residence.vulnerabilityLevel.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        residence.riskLevel === 'bajo' 
                          ? 'bg-green-500/20 text-green-400 dark:bg-green-500/20 dark:text-green-400 light:bg-green-100 light:text-green-700'
                          : residence.riskLevel === 'medio'
                          ? 'bg-yellow-500/20 text-yellow-400 dark:bg-yellow-500/20 dark:text-yellow-400 light:bg-yellow-100 light:text-yellow-700'
                          : 'bg-red-500/20 text-red-400 dark:bg-red-500/20 dark:text-red-400 light:bg-red-100 light:text-red-700'
                      }`}>
                        {residence.riskLevel}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
