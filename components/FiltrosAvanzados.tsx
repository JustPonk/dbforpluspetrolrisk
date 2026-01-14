'use client';

import { Filter, X } from 'lucide-react';
import { SearchFilters } from '@/hooks/useResidenceSearch';

interface FiltrosAvanzadosProps {
  filters: SearchFilters;
  districts: string[];
  onFilterChange: (filters: Partial<SearchFilters>) => void;
  onClearFilters: () => void;
}

export default function FiltrosAvanzados({ 
  filters, 
  districts, 
  onFilterChange, 
  onClearFilters 
}: FiltrosAvanzadosProps) {
  const hasActiveFilters = 
    filters.distrito !== null || 
    filters.riskLevel !== null || 
    filters.riskScoreMin !== 0 || 
    filters.riskScoreMax !== 100;

  return (
    <div className="bg-slate-800 dark:bg-slate-800 light:bg-white rounded-lg p-4 shadow-lg border border-slate-700 dark:border-slate-700 light:border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-400 dark:text-blue-400 light:text-blue-600" />
          <h3 className="font-semibold text-slate-100 dark:text-slate-100 light:text-slate-900">Filtros</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-blue-400 dark:hover:text-blue-400 light:hover:text-blue-600 flex items-center gap-1 transition-colors"
          >
            <X className="w-4 h-4" />
            Limpiar
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Distrito Filter */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 mb-2">
            Distrito
          </label>
          <select
            value={filters.distrito || ''}
            onChange={(e) => onFilterChange({ distrito: e.target.value || null })}
            className="w-full px-3 py-2 bg-slate-700 dark:bg-slate-700 light:bg-slate-100 border-2 border-slate-600 dark:border-slate-600 light:border-slate-300 rounded-lg text-slate-100 dark:text-slate-100 light:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="">Todos los distritos</option>
            {districts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>

        {/* Risk Level Filter */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 mb-2">
            Nivel de Riesgo
          </label>
          <div className="flex gap-2">
            {['bajo', 'medio', 'alto'].map((level) => (
              <button
                key={level}
                onClick={() => onFilterChange({ 
                  riskLevel: filters.riskLevel === level ? null : level as any 
                })}
                className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm border-2 transition-all ${
                  filters.riskLevel === level
                    ? level === 'bajo'
                      ? 'bg-green-500 text-white border-green-600'
                      : level === 'medio'
                      ? 'bg-yellow-500 text-white border-yellow-600'
                      : 'bg-red-500 text-white border-red-600'
                    : 'bg-slate-700 dark:bg-slate-700 light:bg-slate-100 text-slate-300 dark:text-slate-300 light:text-slate-700 border-slate-600 dark:border-slate-600 light:border-slate-300 hover:border-blue-500'
                }`}
              >
                {level.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Risk Score Range */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 mb-2">
            Rango de Riesgo: {filters.riskScoreMin} - {filters.riskScoreMax}
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="100"
              value={filters.riskScoreMin}
              onChange={(e) => onFilterChange({ riskScoreMin: parseInt(e.target.value) })}
              className="w-full h-2 bg-slate-700 dark:bg-slate-700 light:bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={filters.riskScoreMax}
              onChange={(e) => onFilterChange({ riskScoreMax: parseInt(e.target.value) })}
              className="w-full h-2 bg-slate-700 dark:bg-slate-700 light:bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
