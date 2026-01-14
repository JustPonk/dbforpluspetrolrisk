'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import residencesData from '@/data/residences.json';

interface QuickSearchProps {
  currentResidenceId: string;
  onSelectResidence: (residenceId: string) => void;
}

export default function QuickSearch({ currentResidenceId, onSelectResidence }: QuickSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredResidences, setFilteredResidences] = useState(residencesData.residences);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter residences based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = residencesData.residences.filter(residence =>
        residence.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        residence.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        residence.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredResidences(filtered);
    } else {
      setFilteredResidences(residencesData.residences);
    }
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (residenceId: string) => {
    onSelectResidence(residenceId);
    setSearchTerm('');
    setIsOpen(false);
  };

  const currentResidence = residencesData.residences.find(r => r.id === currentResidenceId);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'bajo': return 'text-green-500';
      case 'medio': return 'text-yellow-500';
      case 'alto': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-md">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-400 light:text-slate-500 w-4 h-4" />
        <input
          type="text"
          placeholder={`Buscar residencia... (Actual: ${currentResidence?.id})`}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-10 py-2 bg-slate-700 dark:bg-slate-700 light:bg-blue-50 border-2 border-slate-600 dark:border-slate-600 light:border-blue-200 rounded-lg text-slate-100 dark:text-slate-100 light:text-slate-900 placeholder-slate-400 dark:placeholder-slate-400 light:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-full bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto custom-scrollbar"
          >
            {filteredResidences.length > 0 ? (
              <div className="py-2">
                {filteredResidences.map((residence) => (
                  <button
                    key={residence.id}
                    onClick={() => handleSelect(residence.id)}
                    className={`w-full px-4 py-3 text-left hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-blue-50 transition-all border-l-4 ${
                      residence.id === currentResidenceId
                        ? 'border-blue-500 bg-slate-700/50 dark:bg-slate-700/50 light:bg-blue-50'
                        : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-blue-400 dark:text-blue-400 light:text-blue-600">
                            {residence.id}
                          </span>
                          <span className={`text-xs font-semibold uppercase ${getRiskColor(residence.riskLevel)}`}>
                            {residence.riskLevel}
                          </span>
                        </div>
                        <p className="text-sm text-slate-100 dark:text-slate-100 light:text-slate-900 truncate">
                          {residence.name}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 truncate">
                          {residence.address}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">Riesgo</div>
                        <div className="text-lg font-bold text-blue-400 dark:text-blue-400 light:text-blue-600">
                          {residence.riskScore}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-slate-400 dark:text-slate-400 light:text-slate-600">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No se encontraron residencias</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
