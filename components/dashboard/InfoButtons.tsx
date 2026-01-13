import { Info } from 'lucide-react';

interface InfoButtonsProps {
  onOpenModal: (type: 'donut' | 'speedometer' | 'thermometer') => void;
  variant?: 'standalone' | 'inline';
}

export default function InfoButtons({ onOpenModal, variant = 'standalone' }: InfoButtonsProps) {
  if (variant === 'inline') {
    return (
      <div className="flex-1 flex justify-end gap-3">
        <button
          onClick={() => onOpenModal('donut')}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
          title="Información sobre Gráficos de Dona"
        >
          <Info className="w-4 h-4" />
          <span className="text-sm">Donut</span>
        </button>
        <button
          onClick={() => onOpenModal('speedometer')}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
          title="Información sobre Velocímetro"
        >
          <Info className="w-4 h-4" />
          <span className="text-sm">Velocímetro</span>
        </button>
        <button
          onClick={() => onOpenModal('thermometer')}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
          title="Información sobre Termómetros"
        >
          <Info className="w-4 h-4" />
          <span className="text-sm">Termómetros</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-4 mb-8">
      <button
        onClick={() => onOpenModal('donut')}
        className="flex items-center gap-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white px-6 py-4 rounded-lg hover:shadow-lg transition-all font-semibold"
      >
        <Info className="w-5 h-5" />
        <span>Información Donut Charts</span>
      </button>
      <button
        onClick={() => onOpenModal('speedometer')}
        className="flex items-center gap-2 bg-gradient-to-br from-purple-500 to-purple-600 text-white px-6 py-4 rounded-lg hover:shadow-lg transition-all font-semibold"
      >
        <Info className="w-5 h-5" />
        <span>Información Velocímetro</span>
      </button>
      <button
        onClick={() => onOpenModal('thermometer')}
        className="flex items-center gap-2 bg-gradient-to-br from-pink-500 to-pink-600 text-white px-6 py-4 rounded-lg hover:shadow-lg transition-all font-semibold"
      >
        <Info className="w-5 h-5" />
        <span>Información Termómetros</span>
      </button>
    </div>
  );
}
