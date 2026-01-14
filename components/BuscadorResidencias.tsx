'use client';

import { Search } from 'lucide-react';
import { SearchFilters } from '@/hooks/useResidenceSearch';

interface BuscadorResidenciasProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  resultCount: number;
  totalCount: number;
}

export default function BuscadorResidencias({ 
  searchTerm, 
  onSearchChange, 
  resultCount,
  totalCount
}: BuscadorResidenciasProps) {
  return (
    <div className="bg-slate-800 dark:bg-slate-800 light:bg-white rounded-lg p-4 shadow-lg border border-slate-700 dark:border-slate-700 light:border-slate-200">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-400 light:text-slate-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar por ID, nombre o dirección..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-700 dark:bg-slate-700 light:bg-slate-100 border-2 border-slate-600 dark:border-slate-600 light:border-slate-300 rounded-lg text-slate-100 dark:text-slate-100 light:text-slate-900 placeholder-slate-400 dark:placeholder-slate-400 light:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>
      {searchTerm && (
        <p className="mt-2 text-sm text-slate-300 dark:text-slate-300 light:text-slate-600">
          Mostrando <span className="font-bold text-blue-400 dark:text-blue-400 light:text-blue-600">{resultCount}</span> de {totalCount} residencias
        </p>
      )}
    </div>
  );
}
