'use client';

import GaugeChart from 'react-gauge-chart';

interface SpeedometerProps {
  value: number; // 0-100
  label: string;
  uniqueId?: string;
}

const Speedometer: React.FC<SpeedometerProps> = ({ value, label, uniqueId = 'default' }) => {
  // Normalize value to 0-1 range for GaugeChart
  const normalizedValue = value / 100;

  // Determine risk level color based on ranges
  const getRiskColor = () => {
    if (value <= 20) return '#22c55e'; // Verde - BAJO
    if (value <= 40) return '#3b82f6'; // Azul - MODERADO
    if (value <= 60) return '#eab308'; // Amarillo - MEDIO
    if (value <= 80) return '#f97316'; // Naranja - ALTO
    return '#ef4444'; // Rojo - EXTREMO
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full py-4">
      <div className="w-full max-w-[400px] mx-auto">
        <GaugeChart
          id={`risk-gauge-${uniqueId}`}
          nrOfLevels={5}
          colors={['#22c55e', '#3b82f6', '#eab308', '#f97316', '#ef4444']}
          arcWidth={0.3}
          percent={normalizedValue}
          textColor="#f1f5f9"
          needleColor="#f1f5f9"
          needleBaseColor="#cbd5e1"
          hideText={false}
          formatTextValue={() => `${value}`}
          animate={true}
          animDelay={500}
          animateDuration={5500}
          arcsLength={[0.2, 0.2, 0.2, 0.2, 0.2]}
          cornerRadius={0}
        />
      </div>
      
      {/* Risk level label */}
      <div 
        className="text-sm font-semibold px-4 py-1.5 rounded -mt-4"
        style={{ 
          backgroundColor: getRiskColor(),
          color: 'white'
        }}
      >
        {label}
      </div>
    </div>
  );
};

export default Speedometer;
