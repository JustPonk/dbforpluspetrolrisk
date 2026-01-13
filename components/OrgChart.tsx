'use client';

import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { useState } from 'react';

interface Service {
  id: string;
  name: string;
  phone: string;
  address: string;
  nearResidences: string[];
}

interface OrgChartProps {
  serviceType: 'clinic' | 'police' | 'serenazgo';
  services: Service[];
}

export default function OrgChart({ serviceType, services }: OrgChartProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const getColor = () => {
    switch (serviceType) {
      case 'clinic': return 'bg-red-500';
      case 'police': return 'bg-blue-600';
      case 'serenazgo': return 'bg-green-600';
    }
  };

  const getTitle = () => {
    switch (serviceType) {
      case 'clinic': return 'Clínicas';
      case 'police': return 'Comisarías';
      case 'serenazgo': return 'Serenazgo';
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-6 mt-4">
      <h4 className={`font-bold text-white ${getColor()} px-4 py-2 rounded-lg mb-4`}>
        {getTitle()} Cercanas
      </h4>

      {/* Horizontal Org Chart */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedService(selectedService?.id === service.id ? null : service)}
              className={`min-w-[200px] p-4 rounded-lg border-2 transition-all ${
                selectedService?.id === service.id
                  ? `${getColor()} text-white border-transparent`
                  : 'bg-slate-700 text-slate-200 border-slate-600 hover:border-slate-500'
              }`}
            >
              <div className="font-semibold text-sm">{service.name}</div>
              <div className="text-xs mt-2 opacity-80">Click para ver detalles</div>
            </motion.button>

            {/* Connection line */}
            {index < services.length - 1 && (
              <div className="absolute top-1/2 -right-4 w-4 h-0.5 bg-gray-300" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Details Panel */}
      {selectedService && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-slate-700 rounded-lg border-2 border-slate-600"
        >
          <h5 className="font-bold text-lg text-slate-100 mb-3">{selectedService.name}</h5>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-blue-400 mt-0.5" />
              <div>
                <span className="font-semibold">Teléfono: </span>
                <span className="text-blue-400 font-bold">{selectedService.phone}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-blue-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <span className="font-semibold">Dirección: </span>
                <span>{selectedService.address}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
