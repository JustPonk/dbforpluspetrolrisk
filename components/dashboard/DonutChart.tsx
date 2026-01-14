import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface DonutChartProps {
  data: {
    name: string;
    value: number;
    color: string;
    label: string;
  };
  index: number;
  isExpanded: boolean;
}

// Función para obtener color basado en el valor del porcentaje
function getColorByValue(value: number): string {
  if (value <= 20) {
    return '#22c55e'; // verde
  } else if (value <= 40) {
    return '#3b82f6'; // azul
  } else if (value <= 60) {
    return '#eab308'; // amarillo
  } else if (value <= 80) {
    return '#f97316'; // naranja
  } else {
    return '#ef4444'; // rojo
  }
}

export default function DonutChart({ data, index, isExpanded }: DonutChartProps) {
  // Usar color dinámico solo en expanded view, en compact view usar el color original
  const displayColor = isExpanded ? getColorByValue(data.value) : data.color;
  
  return (
    <motion.div
      key={`donut-${data.name}-${isExpanded}`}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-slate-800 rounded-xl shadow-xl border border-slate-700"
    >
      <div className="relative">
        <ResponsiveContainer width="100%" height={isExpanded ? 180 : 140}>
          <PieChart>
            <Pie
              data={[
                { value: data.value },
                { value: 100 - data.value }
              ]}
              cx="50%"
              cy="50%"
              innerRadius={isExpanded ? 50 : 40}
              outerRadius={isExpanded ? 70 : 55}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
            >
              <Cell fill={displayColor} />
              <Cell fill="#E5E7EB" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-slate-100">{data.value}%</span>
        </div>
      </div>
      <div className="mt-2 py-2 rounded text-center text-xs font-bold text-white" style={{ backgroundColor: displayColor }}>
        {data.label}
      </div>
    </motion.div>
  );
}
