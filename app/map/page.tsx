'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import residencesData from '@/data/residences.json';
import { residenceCoordinates } from '@/data/coordinates';
import 'leaflet/dist/leaflet.css';

// Disable static generation
export const dynamic = 'force-dynamic';

export default function MapaGeneralPage() {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [selectedResidence, setSelectedResidence] = useState<string | null>(null);
  const [filterRiskLevel, setFilterRiskLevel] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapRef.current || mapInstanceRef.current) return;

      try {
        const L = await import('leaflet');

        // Initialize map centered on Lima, Peru
        const map = L.map(mapRef.current, {
          center: [-12.0464, -77.0428],
          zoom: 12,
          zoomControl: true,
        });

        if (!isMounted) {
          map.remove();
          return;
        }

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);

        // Create custom icon based on risk level
        const createCustomIcon = (riskLevel: string) => {
          const color = 
            riskLevel === 'bajo' ? '#22c55e' : 
            riskLevel === 'medio' ? '#eab308' : 
            '#ef4444';

          return L.divIcon({
            className: 'custom-marker',
            html: `
              <div style="
                background-color: ${color};
                width: 32px;
                height: 32px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                border: 3px solid white;
                box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <div style="
                  transform: rotate(45deg);
                  color: white;
                  font-weight: bold;
                  font-size: 16px;
                ">📍</div>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
          });
        };

        // Add markers for all residences
        const markers: any[] = [];
        const bounds: any[] = [];

        residencesData.residences.forEach((residence) => {
          const coords = residenceCoordinates[residence.id];
          if (!coords) return;

          const marker = L.marker(coords.coords, {
            icon: createCustomIcon(residence.riskLevel),
          }).addTo(map);

          bounds.push(coords.coords);

          // Create popup content
          const popupContent = `
            <div style="min-width: 200px; font-family: system-ui, -apple-system, sans-serif;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: #003B7A;">
                  ${residence.id}
                </h3>
                <span style="
                  padding: 4px 8px;
                  border-radius: 9999px;
                  font-size: 10px;
                  font-weight: bold;
                  text-transform: uppercase;
                  ${residence.riskLevel === 'bajo' ? 'background: #dcfce7; color: #166534;' : 
                    residence.riskLevel === 'medio' ? 'background: #fef9c3; color: #854d0e;' : 
                    'background: #fee2e2; color: #991b1b;'}
                ">
                  ${residence.riskLevel}
                </span>
              </div>
              <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #1e293b;">
                ${residence.name}
              </p>
              <p style="margin: 0 0 12px 0; font-size: 12px; color: #64748b;">
                ${residence.address}
              </p>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 12px;">
                <div>
                  <div style="font-size: 10px; color: #64748b; margin-bottom: 2px;">Riesgo</div>
                  <div style="font-size: 16px; font-weight: bold; color: #0066CC;">${residence.riskScore}</div>
                </div>
                <div>
                  <div style="font-size: 10px; color: #64748b; margin-bottom: 2px;">Amenaza</div>
                  <div style="font-size: 16px; font-weight: bold; color: #ef4444;">${residence.threatLevel}</div>
                </div>
              </div>
              <button 
                onclick="window.selectResidenceFromMap('${residence.id}')"
                style="
                  width: 100%;
                  padding: 8px;
                  background: #003B7A;
                  color: white;
                  border: none;
                  border-radius: 6px;
                  font-size: 12px;
                  font-weight: 600;
                  cursor: pointer;
                  transition: background 0.2s;
                "
                onmouseover="this.style.background='#0066CC'"
                onmouseout="this.style.background='#003B7A'"
              >
                Ver Detalles
              </button>
            </div>
          `;

          marker.bindPopup(popupContent, {
            maxWidth: 250,
            className: 'custom-popup',
          });

          markers.push({ marker, residence });
        });

        // Fit map to show all markers
        if (bounds.length > 0) {
          map.fitBounds(bounds, { padding: [50, 50] });
        }

        mapInstanceRef.current = { map, markers };

        // Global function to handle residence selection from popup
        (window as any).selectResidenceFromMap = (residenceId: string) => {
          sessionStorage.setItem('selectedResidenceId', residenceId);
          router.push('/dashboard');
        };

      } catch (error) {
        console.error('Error initializing map:', error);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current?.map) {
        mapInstanceRef.current.map.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [router]);

  // Filter markers by risk level
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const { markers } = mapInstanceRef.current;
    markers.forEach(({ marker, residence }: any) => {
      if (filterRiskLevel === null || residence.riskLevel === filterRiskLevel) {
        marker.setOpacity(1);
      } else {
        marker.setOpacity(0.2);
      }
    });
  }, [filterRiskLevel]);

  const stats = {
    total: residencesData.residences.length,
    bajo: residencesData.residences.filter(r => r.riskLevel === 'bajo').length,
    medio: residencesData.residences.filter(r => r.riskLevel === 'medio').length,
    alto: residencesData.residences.filter(r => r.riskLevel === 'alto').length,
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900 dark:bg-slate-900 light:bg-gray-50">
      {/* Header */}
      <div className="bg-slate-800 dark:bg-slate-800 light:bg-white border-b border-slate-700 dark:border-slate-700 light:border-blue-200 px-4 md:px-8 py-4 shadow-lg z-10">
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
                <MapPin className="w-6 h-6" />
                Mapa General de Residencias
              </h1>
              <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
                Vista de todas las residencias con indicadores de riesgo
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Stats and Filters */}
        <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Stats */}
          <div className="flex gap-2 md:gap-4">
            <button
              onClick={() => setFilterRiskLevel(null)}
              className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                filterRiskLevel === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 dark:bg-slate-700 light:bg-blue-100 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-slate-600 dark:hover:bg-slate-600 light:hover:bg-blue-200'
              }`}
            >
              Todas ({stats.total})
            </button>
            <button
              onClick={() => setFilterRiskLevel('bajo')}
              className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                filterRiskLevel === 'bajo'
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-700 dark:bg-slate-700 light:bg-blue-100 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-green-500 hover:text-white'
              }`}
            >
              Bajo ({stats.bajo})
            </button>
            <button
              onClick={() => setFilterRiskLevel('medio')}
              className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                filterRiskLevel === 'medio'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-slate-700 dark:bg-slate-700 light:bg-blue-100 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-yellow-500 hover:text-white'
              }`}
            >
              Medio ({stats.medio})
            </button>
            <button
              onClick={() => setFilterRiskLevel('alto')}
              className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                filterRiskLevel === 'alto'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-700 dark:bg-slate-700 light:bg-blue-100 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-red-500 hover:text-white'
              }`}
            >
              Alto ({stats.alto})
            </button>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs md:text-sm text-slate-300 dark:text-slate-300 light:text-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Riesgo Bajo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Riesgo Medio</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Riesgo Alto</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="absolute inset-0 z-0" />
      </div>
    </div>
  );
}
