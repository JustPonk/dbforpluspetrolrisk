import { useState, useMemo } from 'react';
import residencesData from '@/data/residences.json';

export interface SearchFilters {
  searchTerm: string;
  distrito: string | null;
  riskLevel: 'bajo' | 'medio' | 'alto' | null;
  riskScoreMin: number;
  riskScoreMax: number;
}

const residences = residencesData.residences;

export function useResidenceSearch() {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    distrito: null,
    riskLevel: null,
    riskScoreMin: 0,
    riskScoreMax: 100,
  });

  // Get unique districts
  const districts = useMemo(() => {
    const uniqueDistricts = new Set(residences.map(r => r.address.split(',').pop()?.trim() || ''));
    return Array.from(uniqueDistricts).sort();
  }, []);

  // Filter residences based on current filters
  const filteredResidences = useMemo(() => {
    return residences.filter(residence => {
      // Search term (searches in ID, name, and address)
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          residence.id.toLowerCase().includes(searchLower) ||
          residence.name.toLowerCase().includes(searchLower) ||
          residence.address.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // District filter
      if (filters.distrito) {
        const residenceDistrict = residence.address.split(',').pop()?.trim() || '';
        if (residenceDistrict !== filters.distrito) return false;
      }

      // Risk level filter
      if (filters.riskLevel && residence.riskLevel !== filters.riskLevel) {
        return false;
      }

      // Risk score range filter
      if (residence.riskScore < filters.riskScoreMin || residence.riskScore > filters.riskScoreMax) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      distrito: null,
      riskLevel: null,
      riskScoreMin: 0,
      riskScoreMax: 100,
    });
  };

  return {
    filters,
    filteredResidences,
    updateFilters,
    clearFilters,
    districts,
    totalCount: residences.length,
    filteredCount: filteredResidences.length,
  };
}
