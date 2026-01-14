'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, MapPin, AlertCircle, CheckCircle, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import residencesData from '@/data/residences.json';
import emergenciasData from '@/data/emergencias.json';
import telefonosEmergencias from '@/data/telefonos_emergencias_por_distrito.json';

// Disable static generation
export const dynamic = 'force-dynamic';

interface ETAResult {
  residenceId: string;
  residenceName: string;
  distrito: string;
  serviceType: string;
  serviceName: string;
  estimatedTime: number; // minutes
  distance: number; // km
  status: 'excellent' | 'good' | 'acceptable' | 'critical';
}

export default function TiemposRespuestaPage() {
  const router = useRouter();
  const [selectedResidence, setSelectedResidence] = useState<string>(residencesData.residences[0].id);
  const [serviceType, setServiceType] = useState<'all' | 'policia' | 'bomberos' | 'ambulancia'>('all');

  const residence = residencesData.residences.find(r => r.id === selectedResidence);
  
  // Get district from address
  const distrito = residence?.address.split(',').pop()?.trim().toUpperCase() || 'DESCONOCIDO';

  // Calculate ETA (simplified calculation based on proximity)
  const calculateETA = (): ETAResult[] => {
    if (!residence) return [];

    const results: ETAResult[] = [];

    // Get emergency services for this district
    const normalizedDistrito = distrito.replace(/\s+/g, '_').toUpperCase();
    const districtServices = (telefonosEmergencias as any)[normalizedDistrito];

    if (!districtServices) return [];

    // Police
    if (serviceType === 'all' || serviceType === 'policia') {
      const comisarias = districtServices.comisarias || [];
      comisarias.forEach((service: string, index: number) => {
        const distance = 1.5 + (index * 0.8); // Simulated distance in km
        const estimatedTime = Math.round((distance / 40) * 60); // 40 km/h average speed in city
        results.push({
          residenceId: residence.id,
          residenceName: residence.name,
          distrito,
          serviceType: 'Policía',
          serviceName: service.split(/\s{2,}/)[0] || service, // Extract name before multiple spaces
          estimatedTime,
          distance,
          status: estimatedTime <= 5 ? 'excellent' : estimatedTime <= 10 ? 'good' : estimatedTime <= 15 ? 'acceptable' : 'critical'
        });
      });
    }

    // Fire department
    if (serviceType === 'all' || serviceType === 'bomberos') {
      const bomberos = districtServices.bomberos || [];
      bomberos.forEach((service: string, index: number) => {
        const distance = 2.0 + (index * 1.2);
        const estimatedTime = Math.round((distance / 45) * 60); // 45 km/h for fire trucks
        results.push({
          residenceId: residence.id,
          residenceName: residence.name,
          distrito,
          serviceType: 'Bomberos',
          serviceName: service || `Bomberos ${index + 1}`,
          estimatedTime,
          distance,
          status: estimatedTime <= 6 ? 'excellent' : estimatedTime <= 12 ? 'good' : estimatedTime <= 18 ? 'acceptable' : 'critical'
        });
      });
    }

    // Ambulance
    if (serviceType === 'all' || serviceType === 'ambulancia') {
      const clinicas = districtServices.clinicas || [];
      clinicas.forEach((service: string, index: number) => {
        if (service === '-' || !service) return; // Skip empty entries
        const distance = 1.8 + (index * 0.9);
        const estimatedTime = Math.round((distance / 42) * 60); // 42 km/h average
        results.push({
          residenceId: residence.id,
          residenceName: residence.name,
          distrito,
          serviceType: 'Ambulancia',
          serviceName: service.split('-')[0].trim() || service, // Extract name before dash
          estimatedTime,
          distance,
          status: estimatedTime <= 5 ? 'excellent' : estimatedTime <= 10 ? 'good' : estimatedTime <= 15 ? 'acceptable' : 'critical'
        });
      });
    }

    return results.sort((a, b) => a.estimatedTime - b.estimatedTime);
  };

  const etaResults = calculateETA();

  // Calculate statistics
  const stats = {
    avgTime: etaResults.length > 0 ? Math.round(etaResults.reduce((acc, r) => acc + r.estimatedTime, 0) / etaResults.length) : 0,
    fastest: etaResults.length > 0 ? Math.min(...etaResults.map(r => r.estimatedTime)) : 0,
    slowest: etaResults.length > 0 ? Math.max(...etaResults.map(r => r.estimatedTime)) : 0,
    critical: etaResults.filter(r => r.status === 'critical').length,
    excellent: etaResults.filter(r => r.status === 'excellent').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-blue-400';
      case 'acceptable': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500/20 border-green-500/30 dark:bg-green-500/20 dark:border-green-500/30 light:bg-green-100 light:border-green-200';
      case 'good': return 'bg-blue-500/20 border-blue-500/30 dark:bg-blue-500/20 dark:border-blue-500/30 light:bg-blue-100 light:border-blue-200';
      case 'acceptable': return 'bg-yellow-500/20 border-yellow-500/30 dark:bg-yellow-500/20 dark:border-yellow-500/30 light:bg-yellow-100 light:border-yellow-200';
      case 'critical': return 'bg-red-500/20 border-red-500/30 dark:bg-red-500/20 dark:border-red-500/30 light:bg-red-100 light:border-red-200';
      default: return 'bg-slate-700/20 border-slate-700/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Bueno';
      case 'acceptable': return 'Aceptable';
      case 'critical': return 'Crítico';
      default: return 'Desconocido';
    }
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
                <Clock className="w-6 h-6" />
                Calculadora de Tiempo de Respuesta
              </h1>
              <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
                Estimación de tiempos de llegada de servicios de emergencia
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-col md:flex-row gap-4">
          {/* Residence Selector */}
          <div className="flex-1">
            <label className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 uppercase font-semibold mb-2 block">
              Residencia
            </label>
            <select
              value={selectedResidence}
              onChange={(e) => setSelectedResidence(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 dark:bg-slate-700 light:bg-white border border-slate-600 dark:border-slate-600 light:border-blue-200 text-slate-200 dark:text-slate-200 light:text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {residencesData.residences.map(r => (
                <option key={r.id} value={r.id}>
                  {r.id} - {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Service Type Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setServiceType('all')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                serviceType === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 dark:bg-slate-700 light:bg-blue-100 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-slate-600 dark:hover:bg-slate-600 light:hover:bg-blue-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setServiceType('policia')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                serviceType === 'policia'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 dark:bg-slate-700 light:bg-blue-100 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-slate-600 dark:hover:bg-slate-600 light:hover:bg-blue-200'
              }`}
            >
              Policía
            </button>
            <button
              onClick={() => setServiceType('bomberos')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                serviceType === 'bomberos'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 dark:bg-slate-700 light:bg-blue-100 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-slate-600 dark:hover:bg-slate-600 light:hover:bg-blue-200'
              }`}
            >
              Bomberos
            </button>
            <button
              onClick={() => setServiceType('ambulancia')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                serviceType === 'ambulancia'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 dark:bg-slate-700 light:bg-blue-100 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-slate-600 dark:hover:bg-slate-600 light:hover:bg-blue-200'
              }`}
            >
              Ambulancia
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-xl p-4"
          >
            <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mb-1 uppercase font-semibold">Servicios</div>
            <div className="text-3xl font-bold text-blue-400 dark:text-blue-400 light:text-[#003B7A]">{etaResults.length}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-xl p-4"
          >
            <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mb-1 uppercase font-semibold">Promedio</div>
            <div className="text-3xl font-bold text-yellow-400">{stats.avgTime}<span className="text-lg">min</span></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-xl p-4"
          >
            <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mb-1 uppercase font-semibold">Más Rápido</div>
            <div className="text-3xl font-bold text-green-400">{stats.fastest}<span className="text-lg">min</span></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-xl p-4"
          >
            <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mb-1 uppercase font-semibold">Más Lento</div>
            <div className="text-3xl font-bold text-red-400">{stats.slowest}<span className="text-lg">min</span></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-xl p-4"
          >
            <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mb-1 uppercase font-semibold flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Críticos
            </div>
            <div className="text-3xl font-bold text-red-400">{stats.critical}</div>
          </motion.div>
        </div>

        {/* Current Residence Info */}
        {residence && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-xl p-6 mb-8"
          >
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-blue-400 dark:text-blue-400 light:text-[#0066CC] mt-1" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-blue-400 dark:text-blue-400 light:text-[#003B7A] mb-1">
                  {residence.id} - {residence.name}
                </h2>
                <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 mb-2">
                  {residence.address}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    residence.riskLevel === 'bajo' 
                      ? 'bg-green-500/20 text-green-400 dark:bg-green-500/20 dark:text-green-400 light:bg-green-100 light:text-green-700'
                      : residence.riskLevel === 'moderado'
                      ? 'bg-yellow-500/20 text-yellow-400 dark:bg-yellow-500/20 dark:text-yellow-400 light:bg-yellow-100 light:text-yellow-700'
                      : 'bg-red-500/20 text-red-400 dark:bg-red-500/20 dark:text-red-400 light:bg-red-100 light:text-red-700'
                  }`}>
                    Riesgo: {residence.riskLevel}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 dark:bg-blue-500/20 dark:text-blue-400 light:bg-blue-100 light:text-[#0066CC]">
                    Distrito: {distrito}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ETA Results */}
        <div className="space-y-3">
          {etaResults.length === 0 ? (
            <div className="bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-xl p-12 text-center">
              <AlertCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 dark:text-slate-400 light:text-slate-600">
                No hay servicios de emergencia disponibles para este distrito
              </p>
            </div>
          ) : (
            etaResults.map((result, index) => (
              <motion.div
                key={`${result.serviceType}-${result.serviceName}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className={`border rounded-xl p-5 ${getStatusBg(result.status)} hover:scale-[1.01] transition-transform`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase bg-slate-800/50 dark:bg-slate-800/50 light:bg-white/50 ${getStatusColor(result.status)}`}>
                        {result.serviceType}
                      </span>
                      {result.status === 'excellent' && <CheckCircle className="w-5 h-5 text-green-400" />}
                      {result.status === 'critical' && <AlertCircle className="w-5 h-5 text-red-400" />}
                    </div>
                    <h3 className="text-lg font-bold text-slate-200 dark:text-slate-200 light:text-slate-900 mb-1">
                      {result.serviceName}
                    </h3>
                    <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
                      Distancia estimada: {result.distance.toFixed(1)} km
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-4xl font-bold ${getStatusColor(result.status)}`}>
                      {result.estimatedTime}
                      <span className="text-lg">min</span>
                    </div>
                    <div className={`text-sm font-semibold mt-1 ${getStatusColor(result.status)}`}>
                      {getStatusLabel(result.status)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-xl p-6"
        >
          <h3 className="text-sm font-bold text-slate-400 dark:text-slate-400 light:text-slate-600 uppercase mb-3">
            Criterios de Evaluación
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-semibold text-green-400">Excelente</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-500 light:text-slate-600">≤ 5-6 minutos</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm font-semibold text-blue-400">Bueno</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-500 light:text-slate-600">6-12 minutos</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm font-semibold text-yellow-400">Aceptable</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-500 light:text-slate-600">12-18 minutos</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm font-semibold text-red-400">Crítico</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-500 light:text-slate-600">&gt; 18 minutos</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
