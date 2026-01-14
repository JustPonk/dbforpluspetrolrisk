'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useResidenceSearch } from '@/hooks/useResidenceSearch';
import BuscadorResidencias from '@/components/BuscadorResidencias';
import FiltrosAvanzados from '@/components/FiltrosAvanzados';
import ResultadosBusqueda from '@/components/ResultadosBusqueda';
import ThemeToggle from '@/components/ThemeToggle';

// Disable static generation
export const dynamic = 'force-dynamic';

export default function SearchPage() {
  const router = useRouter();
  const {
    filters,
    filteredResidences,
    updateFilters,
    clearFilters,
    districts,
    totalCount,
    filteredCount,
  } = useResidenceSearch();

  const handleSelectResidence = (residenceId: string) => {
    // Store in sessionStorage so dashboard can pick it up
    sessionStorage.setItem('selectedResidenceId', residenceId);
    router.push(`/dashboard`);
  };

  return (
    <div className="min-h-screen bg-slate-900 dark:bg-slate-900 light:bg-gray-50">
      {/* Header */}
      <div className="bg-slate-800 dark:bg-slate-800 light:bg-white border-b border-slate-700 dark:border-slate-700 light:border-slate-200 px-4 md:px-8 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 rounded-lg bg-slate-700 dark:bg-slate-700 light:bg-slate-200 hover:bg-slate-600 dark:hover:bg-slate-600 light:hover:bg-slate-300 text-slate-300 dark:text-slate-300 light:text-slate-700 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-blue-400 dark:text-blue-400 light:text-blue-600">Buscar Residencias</h1>
              <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">Encuentra y filtra residencias por múltiples criterios</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <BuscadorResidencias
              searchTerm={filters.searchTerm}
              onSearchChange={(term) => updateFilters({ searchTerm: term })}
              resultCount={filteredCount}
              totalCount={totalCount}
            />
            <FiltrosAvanzados
              filters={filters}
              districts={districts}
              onFilterChange={updateFilters}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <ResultadosBusqueda
              residences={filteredResidences}
              onSelectResidence={handleSelectResidence}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
