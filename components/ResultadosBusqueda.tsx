'use client';

import { motion } from 'framer-motion';
import { Grid, List } from 'lucide-react';
import { useState } from 'react';

interface Residence {
  id: string;
  name: string;
  address: string;
  riskLevel: string;
  riskScore: number;
  threatLevel: number;
  vulnerabilityLevel: number;
  image: string;
}

interface ResultadosBusquedaProps {
  residences: Residence[];
  onSelectResidence: (residenceId: string) => void;
}

export default function ResultadosBusqueda({ 
  residences, 
  onSelectResidence 
}: ResultadosBusquedaProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'bajo': return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700 light:bg-green-100 light:text-green-800 light:border-green-300';
      case 'medio': return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700 light:bg-yellow-100 light:text-yellow-800 light:border-yellow-300';
      case 'alto': return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700 light:bg-red-100 light:text-red-800 light:border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-700 light:bg-gray-100 light:text-gray-800 light:border-gray-300';
    }
  };

  if (residences.length === 0) {
    return (
      <div className="bg-slate-800 dark:bg-slate-800 light:bg-white rounded-lg p-12 shadow-lg border border-slate-700 dark:border-slate-700 light:border-slate-200 text-center">
        <div className="text-slate-400 dark:text-slate-400 light:text-slate-500">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-xl font-semibold mb-2 text-slate-300 dark:text-slate-300 light:text-slate-600">No se encontraron residencias</h3>
          <p className="text-slate-400 dark:text-slate-400 light:text-slate-500">Intenta ajustar los filtros de búsqueda</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* View Mode Toggle */}
      <div className="flex justify-between items-center">
        <p className="text-slate-300 dark:text-slate-300 light:text-slate-600 font-semibold">
          {residences.length} {residences.length === 1 ? 'residencia encontrada' : 'residencias encontradas'}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 dark:bg-slate-700 light:bg-slate-200 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-slate-600 dark:hover:bg-slate-600 light:hover:bg-slate-300'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 dark:bg-slate-700 light:bg-slate-200 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-slate-600 dark:hover:bg-slate-600 light:hover:bg-slate-300'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {residences.map((residence, index) => (
            <motion.div
              key={residence.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => onSelectResidence(residence.id)}
              className="bg-slate-800 dark:bg-slate-800 light:bg-white rounded-lg shadow-lg border border-slate-700 dark:border-slate-700 light:border-slate-200 overflow-hidden cursor-pointer hover:shadow-xl hover:border-blue-500 transition-all"
            >
              <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-600 dark:from-slate-700 dark:to-slate-600 light:from-slate-200 light:to-slate-100 flex items-center justify-center overflow-hidden">
                <img
                  src={residence.image}
                  alt={residence.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-blue-400 dark:text-blue-400 light:text-blue-600">{residence.id}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold border-2 uppercase ${getRiskColor(residence.riskLevel)}`}>
                    {residence.riskLevel}
                  </span>
                </div>
                <h4 className="font-semibold text-slate-100 dark:text-slate-100 light:text-slate-900 mb-1">{residence.name}</h4>
                <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mb-3 truncate">{residence.address}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 dark:text-slate-400 light:text-slate-600">Riesgo</span>
                    <span className="text-blue-400 dark:text-blue-400 light:text-blue-600 font-bold">{residence.riskScore}</span>
                  </div>
                  <div className="w-full bg-slate-700 dark:bg-slate-700 light:bg-slate-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-500 h-1.5 rounded-full"
                      style={{ width: `${residence.riskScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-2">
          {residences.map((residence, index) => (
            <motion.div
              key={residence.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              onClick={() => onSelectResidence(residence.id)}
              className="bg-slate-800 dark:bg-slate-800 light:bg-white rounded-lg shadow-lg border border-slate-700 dark:border-slate-700 light:border-slate-200 p-4 cursor-pointer hover:shadow-xl hover:border-blue-500 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-24 h-16 bg-gradient-to-br from-slate-700 to-slate-600 dark:from-slate-700 dark:to-slate-600 light:from-slate-200 light:to-slate-100 rounded flex-shrink-0 overflow-hidden">
                  <img
                    src={residence.image}
                    alt={residence.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-blue-400 dark:text-blue-400 light:text-blue-600">{residence.id}</h3>
                    <h4 className="font-semibold text-slate-100 dark:text-slate-100 light:text-slate-900 truncate">{residence.name}</h4>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 truncate mb-2">{residence.address}</p>
                  <div className="flex gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 dark:text-slate-400 light:text-slate-600">Riesgo: </span>
                      <span className="text-blue-400 dark:text-blue-400 light:text-blue-600 font-bold">{residence.riskScore}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 dark:text-slate-400 light:text-slate-600">Amenaza: </span>
                      <span className="text-red-400 dark:text-red-400 light:text-red-600 font-bold">{residence.threatLevel}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 dark:text-slate-400 light:text-slate-600">Vulnerabilidad: </span>
                      <span className="text-yellow-400 dark:text-yellow-400 light:text-yellow-600 font-bold">{residence.vulnerabilityLevel}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 uppercase flex-shrink-0 ${getRiskColor(residence.riskLevel)}`}>
                  {residence.riskLevel}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
