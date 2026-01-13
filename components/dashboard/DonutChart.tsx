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

export default function DonutChart({ data, index, isExpanded }: DonutChartProps) {
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
              <Cell fill={data.color} />
              <Cell fill="#E5E7EB" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-slate-100">{data.value}%</span>
        </div>
      </div>
      <div className="mt-2 py-2 rounded text-center text-xs font-bold text-white" style={{ backgroundColor: data.color }}>
        {data.label}
      </div>
    </motion.div>
  );
}
