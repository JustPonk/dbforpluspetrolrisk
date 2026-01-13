'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Navigation, MapPin, Phone, Building2 } from 'lucide-react';
import emergenciasData from '@/data/emergencias.json';
import { residenceCoordinates, serviceCoordinatesMap } from '@/data/coordinates';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

interface RoutesViewProps {
  residenceId: string;
  residenceName: string;
  residenceAddress: string;
}

type ServiceType = 'clinicas' | 'comisarias' | 'serenazgo';

export default function RoutesView({ residenceId, residenceName, residenceAddress }: RoutesViewProps) {
  const [selectedService, setSelectedService] = useState<ServiceType>('clinicas');
  const [selectedDestination, setSelectedDestination] = useState<any>(null);
  const [routeInfo, setRouteInfo] = useState({ distance: '', time: '' });
  const [isClient, setIsClient] = useState(false);
  const [L, setL] = useState<any>(null);
  
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const routingControlRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [routingMachine, setRoutingMachine] = useState<boolean>(false);

  const residenceData = residenceCoordinates[residenceId] || { 
    coords: [-12.0946, -77.0376], 
    distrito: 'SAN ISIDRO' 
  };
  const residenceCoords = residenceData.coords;
  const distrito = residenceData.distrito;

  useEffect(() => {
    setIsClient(true);
    
    const loadLeaflet = async () => {
      const leaflet = (await import('leaflet')).default;
      
      // Fix default icon issue
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
      
      setL(leaflet);
    };
    
    loadLeaflet();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isClient || !L || !mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView(residenceCoords, 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    // Home icon
    const homeIcon = L.divIcon({
      className: 'custom-home-marker',
      html: `<div style="background-color: #2563eb; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" style="transform: rotate(45deg);">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        </svg>
      </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    const residenceMarker = L.marker(residenceCoords, { icon: homeIcon })
      .addTo(map)
      .bindPopup(`<strong>${residenceName}</strong><br/>${residenceAddress}`);
    
    markersRef.current.push(residenceMarker);

    return () => {
      if (mapRef.current) {
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isClient, L, residenceCoords, residenceName, residenceAddress]);

  // Load routing machine
  useEffect(() => {
    if (!isClient || !L || !mapRef.current || routingMachine) return;

    const loadRoutingMachine = async () => {
      // Import routing machine to extend L object
      await import('leaflet-routing-machine');
      setRoutingMachine(true);
    };

    loadRoutingMachine();
  }, [isClient, L, routingMachine]);

  // Reset on residence or service change
  useEffect(() => {
    setSelectedDestination(null);
    setRouteInfo({ distance: '', time: '' });
  }, [residenceId, selectedService]);

  // Handle destination and routing
  useEffect(() => {
    if (!mapRef.current || !L) return;

    // Remove previous destination marker
    if (markersRef.current.length > 1) {
      markersRef.current[1].remove();
      markersRef.current = [markersRef.current[0]];
    }

    // Remove previous routing
    if (routingControlRef.current) {
      mapRef.current.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }

    if (!selectedDestination) {
      mapRef.current.setView(residenceCoords, 14);
      return;
    }

    // Add destination marker
    const color = 
      selectedService === 'clinicas' ? '#10b981' :
      selectedService === 'comisarias' ? '#ef4444' :
      '#f59e0b';

    const destIcon = L.divIcon({
      className: 'custom-dest-marker',
      html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    const destMarker = L.marker(selectedDestination.coords, { icon: destIcon })
      .addTo(mapRef.current)
      .bindPopup(`<strong>${selectedDestination.nombre}</strong><br/>${selectedDestination.direccion || ''}<br/>📞 ${selectedDestination.telefono || 'No disponible'}`);
    
    markersRef.current.push(destMarker);

    // Fit bounds
    const bounds = L.latLngBounds([residenceCoords, selectedDestination.coords]);
    mapRef.current.fitBounds(bounds, { padding: [80, 80] });

    // Add routing
    if (routingMachine && L) {
      const control = (L as any).Routing.control({
        waypoints: [
          L.latLng(residenceCoords[0], residenceCoords[1]),
          L.latLng(selectedDestination.coords[0], selectedDestination.coords[1]),
        ],
        routeWhileDragging: false,
        showAlternatives: false,
        addWaypoints: false,
        lineOptions: {
          styles: [{ color: '#3b82f6', weight: 6, opacity: 0.8 }],
          extendToWaypoints: true,
          missingRouteTolerance: 0
        },
        createMarker: () => null,
        show: false,
        autoRoute: true,
      }).addTo(mapRef.current);

      routingControlRef.current = control;

      control.on('routesfound', function(e: any) {
        const routes = e.routes;
        if (routes && routes.length > 0) {
          const summary = routes[0].summary;
          const distance = (summary.totalDistance / 1000).toFixed(1) + ' km';
          const time = Math.round(summary.totalTime / 60) + ' min';
          setRouteInfo({ distance, time });
        }
      });

      control.on('routingerror', function() {
        setRouteInfo({ distance: 'No disponible', time: 'No disponible' });
      });
    }
  }, [selectedDestination, routingMachine, residenceCoords, selectedService, L]);

  const getServicesForDistrict = () => {
    const distritoData = emergenciasData.distritos[distrito as keyof typeof emergenciasData.distritos];
    if (!distritoData) return [];

    switch (selectedService) {
      case 'clinicas':
        return distritoData.clinicas || [];
      case 'comisarias':
        return distritoData.comisarias || [];
      case 'serenazgo':
        return distritoData.serenazgo || [];
      default:
        return [];
    }
  };

  const services = getServicesForDistrict();

  const handleServiceSelect = (service: any, index: number) => {
    const coords = serviceCoordinatesMap[distrito]?.[selectedService]?.[index];
    if (coords) {
      setSelectedDestination({ ...service, coords, index });
      setRouteInfo({ distance: '', time: '' });
    }
  };

  const getServiceLabel = () => {
    switch (selectedService) {
      case 'clinicas': return 'Clínicas';
      case 'comisarias': return 'Comisarías';
      case 'serenazgo': return 'Serenazgo';
    }
  };

  if (!isClient || !L) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-900">
        <div className="text-slate-300">Cargando mapa...</div>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-900 flex flex-col md:flex-row">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full md:w-80 bg-slate-800 border-r border-slate-700 overflow-y-auto max-h-[40vh] md:max-h-none"
      >
        <div className="p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 flex items-center gap-2">
            <Navigation className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
            Rutas y Servicios
          </h2>

          {/* Service Type Selector */}
          <div className="mb-4 md:mb-6">
            <label className="text-xs md:text-sm font-semibold text-slate-300 mb-2 block">
              Tipo de Servicio:
            </label>
            <div className="flex gap-1 md:gap-2">
              <button
                onClick={() => {
                  setSelectedService('clinicas');
                  setSelectedDestination(null);
                  setRouteInfo({ distance: '', time: '' });
                }}
                className={`flex-1 px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                  selectedService === 'clinicas'
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Clínicas
              </button>
              <button
                onClick={() => {
                  setSelectedService('comisarias');
                  setSelectedDestination(null);
                  setRouteInfo({ distance: '', time: '' });
                }}
                className={`flex-1 px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                  selectedService === 'comisarias'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Policía
              </button>
              <button
                onClick={() => {
                  setSelectedService('serenazgo');
                  setSelectedDestination(null);
                  setRouteInfo({ distance: '', time: '' });
                }}
                className={`flex-1 px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                  selectedService === 'serenazgo'
                    ? 'bg-orange-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Serenazgo
              </button>
            </div>
          </div>

          {/* Current Location */}
          <div className="mb-4 md:mb-6 p-3 md:p-4 bg-slate-700 rounded-lg">
            <div className="flex items-start gap-2 md:gap-3">
              <MapPin className="w-4 h-4 md:w-5 md:h-5 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xs md:text-sm font-semibold text-slate-200 mb-1">
                  Ubicación Actual
                </h3>
                <p className="text-xs text-slate-400">
                  {residenceAddress}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Distrito: {distrito}
                </p>
              </div>
            </div>
          </div>

          {/* Nearby Services */}
          <div>
            <h3 className="text-xs md:text-sm font-semibold text-slate-300 mb-2 md:mb-3">
              {getServiceLabel()} en {distrito}
            </h3>
            <div className="space-y-2">
              {services.length > 0 ? (
                services.map((service: any, index: number) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleServiceSelect(service, index)}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      selectedDestination?.index === index
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1">
                          {service.nombre}
                        </h4>
                        {service.direccion && (
                          <p className="text-xs opacity-80 mb-2">
                            {service.direccion}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs">
                          <Phone className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{service.telefono || 'No disponible'}</span>
                        </div>
                        {service.telefono_movil && (
                          <div className="flex items-center gap-2 text-xs mt-1">
                            <Phone className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{service.telefono_movil}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))
              ) : (
                <div className="text-center text-slate-400 text-sm py-4">
                  No hay servicios disponibles
                </div>
              )}
            </div>
          </div>

          {/* Route Info */}
          {selectedDestination && routeInfo.distance && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 md:mt-6 p-3 md:p-4 bg-blue-600 rounded-lg"
            >
              <h4 className="text-xs md:text-sm font-semibold text-white mb-2">
                Información de Ruta
              </h4>
              <div className="space-y-1 text-xs md:text-sm text-white">
                <p>📍 Distancia: <strong>{routeInfo.distance}</strong></p>
                <p>⏱️ Tiempo estimado: <strong>{routeInfo.time}</strong></p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Map */}
      <div className="flex-1 relative min-h-[60vh] md:min-h-full">
        <div 
          ref={mapContainerRef} 
          className="w-full h-full"
          style={{ minHeight: '300px' }}
        />
      </div>
    </div>
  );
}
