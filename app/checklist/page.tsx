'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckSquare, Square, AlertCircle, Download, Trash2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import residencesData from '@/data/residences.json';

// Disable static generation
export const dynamic = 'force-dynamic';

interface ChecklistItem {
  id: string;
  category: string;
  description: string;
  checked: boolean;
  notes?: string;
}

interface ChecklistData {
  residenceId: string;
  date: string;
  lastUpdated: string;
  items: ChecklistItem[];
  completionPercentage: number;
}

const CHECKLIST_TEMPLATE: Omit<ChecklistItem, 'checked' | 'notes'>[] = [
  // Accesos
  { id: 'acc-1', category: 'Accesos', description: 'Control de acceso vehicular operativo' },
  { id: 'acc-2', category: 'Accesos', description: 'Control de acceso peatonal operativo' },
  { id: 'acc-3', category: 'Accesos', description: 'Registro de visitantes actualizado' },
  { id: 'acc-4', category: 'Accesos', description: 'Cerraduras en buen estado' },
  
  // Perímetro
  { id: 'per-1', category: 'Perímetro', description: 'Cerco perimetral sin daños' },
  { id: 'per-2', category: 'Perímetro', description: 'Puertas y portones en buen estado' },
  { id: 'per-3', category: 'Perímetro', description: 'Ausencia de puntos ciegos' },
  
  // Iluminación
  { id: 'ilu-1', category: 'Iluminación', description: 'Iluminación exterior funcional' },
  { id: 'ilu-2', category: 'Iluminación', description: 'Iluminación de emergencia operativa' },
  { id: 'ilu-3', category: 'Iluminación', description: 'Sensores de movimiento funcionando' },
  
  // Medios de Protección
  { id: 'pro-1', category: 'Protección', description: 'Extintores con carga vigente' },
  { id: 'pro-2', category: 'Protección', description: 'Detectores de humo operativos' },
  { id: 'pro-3', category: 'Protección', description: 'Alarma contra incendios funcional' },
  { id: 'pro-4', category: 'Protección', description: 'Botiquín completo y vigente' },
  
  // Medios Tecnológicos
  { id: 'tec-1', category: 'Tecnología', description: 'Cámaras de seguridad operativas' },
  { id: 'tec-2', category: 'Tecnología', description: 'Sistema de grabación funcional' },
  { id: 'tec-3', category: 'Tecnología', description: 'Alarma de seguridad activa' },
  { id: 'tec-4', category: 'Tecnología', description: 'Panel de control sin fallas' },
  
  // Entorno
  { id: 'ent-1', category: 'Entorno', description: 'Entorno sin actividad sospechosa' },
  { id: 'ent-2', category: 'Entorno', description: 'Iluminación pública funcional' },
  { id: 'ent-3', category: 'Entorno', description: 'Presencia policial en zona' },
];

export default function ChecklistPage() {
  const router = useRouter();
  const [selectedResidence, setSelectedResidence] = useState<string>(residencesData.residences[0].id);
  const [checklist, setChecklist] = useState<ChecklistData | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load checklist from localStorage
  useEffect(() => {
    setMounted(true);
    loadChecklist(selectedResidence);
  }, [selectedResidence]);

  const loadChecklist = (residenceId: string) => {
    if (typeof window === 'undefined') return;
    
    const key = `checklist_${residenceId}`;
    const saved = localStorage.getItem(key);
    
    if (saved) {
      setChecklist(JSON.parse(saved));
    } else {
      // Create new checklist
      const newChecklist: ChecklistData = {
        residenceId,
        date: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        items: CHECKLIST_TEMPLATE.map(item => ({
          ...item,
          checked: false,
        })),
        completionPercentage: 0,
      };
      setChecklist(newChecklist);
    }
  };

  const saveChecklist = () => {
    if (!checklist || typeof window === 'undefined') return;
    
    const key = `checklist_${checklist.residenceId}`;
    const updatedChecklist = {
      ...checklist,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(updatedChecklist));
    setChecklist(updatedChecklist);
  };

  const clearChecklist = () => {
    if (!checklist || typeof window === 'undefined') return;
    if (!confirm('¿Está seguro de que desea limpiar este checklist?')) return;
    
    const key = `checklist_${checklist.residenceId}`;
    localStorage.removeItem(key);
    loadChecklist(selectedResidence);
  };

  const toggleItem = (itemId: string) => {
    if (!checklist) return;
    
    const updatedItems = checklist.items.map(item =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    
    const completionPercentage = Math.round(
      (updatedItems.filter(i => i.checked).length / updatedItems.length) * 100
    );
    
    setChecklist({
      ...checklist,
      items: updatedItems,
      completionPercentage,
    });
  };

  const updateNotes = (itemId: string, notes: string) => {
    if (!checklist) return;
    
    const updatedItems = checklist.items.map(item =>
      item.id === itemId ? { ...item, notes } : item
    );
    
    setChecklist({
      ...checklist,
      items: updatedItems,
    });
  };

  const exportToText = () => {
    if (!checklist) return;
    
    const residence = residencesData.residences.find(r => r.id === selectedResidence);
    let text = `CHECKLIST DE SEGURIDAD\n`;
    text += `Residencia: ${residence?.id} - ${residence?.name}\n`;
    text += `Fecha: ${new Date(checklist.date).toLocaleDateString()}\n`;
    text += `Última actualización: ${new Date(checklist.lastUpdated).toLocaleDateString()}\n`;
    text += `Completado: ${checklist.completionPercentage}%\n\n`;
    
    const categories = [...new Set(checklist.items.map(i => i.category))];
    categories.forEach(category => {
      text += `\n${category.toUpperCase()}\n`;
      text += '='.repeat(category.length) + '\n';
      
      checklist.items
        .filter(i => i.category === category)
        .forEach(item => {
          text += `[${item.checked ? 'X' : ' '}] ${item.description}\n`;
          if (item.notes) {
            text += `    Notas: ${item.notes}\n`;
          }
        });
    });
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `checklist_${selectedResidence}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!mounted || !checklist) {
    return <div className="min-h-screen bg-slate-900 dark:bg-slate-900 light:bg-gray-50" />;
  }

  const residence = residencesData.residences.find(r => r.id === selectedResidence);
  const categories = [...new Set(checklist.items.map(i => i.category))];

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
                <CheckSquare className="w-6 h-6" />
                Checklist de Seguridad
              </h1>
              <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
                Verificación de controles y medidas de seguridad
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Controls */}
        <div className="mt-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Residence Selector */}
          <div className="flex-1 w-full md:w-auto">
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

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={saveChecklist}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              Guardar
            </button>
            <button
              onClick={exportToText}
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold text-sm flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
            <button
              onClick={clearChecklist}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-sm flex items-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Limpiar
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-200 dark:text-slate-200 light:text-[#003B7A]">
                {residence?.id} - {residence?.name}
              </h2>
              <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
                Última actualización: {new Date(checklist.lastUpdated).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-blue-400 dark:text-blue-400 light:text-[#003B7A]">
                {checklist.completionPercentage}%
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-500 light:text-slate-600">
                {checklist.items.filter(i => i.checked).length} de {checklist.items.length}
              </div>
            </div>
          </div>
          
          <div className="h-4 bg-slate-700 dark:bg-slate-700 light:bg-blue-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${checklist.completionPercentage}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full rounded-full ${
                checklist.completionPercentage >= 80 ? 'bg-green-500' :
                checklist.completionPercentage >= 50 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
            />
          </div>
        </motion.div>

        {/* Checklist Items by Category */}
        {categories.map((category, categoryIndex) => {
          const categoryItems = checklist.items.filter(i => i.category === category);
          const categoryCompletion = Math.round(
            (categoryItems.filter(i => i.checked).length / categoryItems.length) * 100
          );

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * categoryIndex }}
              className="bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-xl p-6 mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-blue-400 dark:text-blue-400 light:text-[#003B7A]">
                  {category}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  categoryCompletion >= 80 
                    ? 'bg-green-500/20 text-green-400 dark:bg-green-500/20 dark:text-green-400 light:bg-green-100 light:text-green-700'
                    : categoryCompletion >= 50
                    ? 'bg-yellow-500/20 text-yellow-400 dark:bg-yellow-500/20 dark:text-yellow-400 light:bg-yellow-100 light:text-yellow-700'
                    : 'bg-red-500/20 text-red-400 dark:bg-red-500/20 dark:text-red-400 light:bg-red-100 light:text-red-700'
                }`}>
                  {categoryCompletion}%
                </span>
              </div>

              <div className="space-y-4">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-lg p-4 hover:bg-slate-700/20 dark:hover:bg-slate-700/20 light:hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="mt-1 flex-shrink-0 text-blue-400 dark:text-blue-400 light:text-[#0066CC] hover:text-blue-300 dark:hover:text-blue-300 light:hover:text-[#003B7A] transition-colors"
                      >
                        {item.checked ? (
                          <CheckSquare className="w-6 h-6" />
                        ) : (
                          <Square className="w-6 h-6" />
                        )}
                      </button>
                      <div className="flex-1">
                        <p className={`text-sm font-medium mb-2 ${
                          item.checked 
                            ? 'text-slate-500 dark:text-slate-500 light:text-slate-500 line-through' 
                            : 'text-slate-200 dark:text-slate-200 light:text-slate-900'
                        }`}>
                          {item.description}
                        </p>
                        <input
                          type="text"
                          placeholder="Agregar notas..."
                          value={item.notes || ''}
                          onChange={(e) => updateNotes(item.id, e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-slate-700 dark:bg-slate-700 light:bg-white border border-slate-600 dark:border-slate-600 light:border-blue-200 text-slate-200 dark:text-slate-200 light:text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}

        {/* Warning */}
        {checklist.completionPercentage < 80 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-yellow-500/10 dark:bg-yellow-500/10 light:bg-yellow-50 border border-yellow-500/30 dark:border-yellow-500/30 light:border-yellow-200 rounded-xl p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-yellow-300 dark:text-yellow-300 light:text-yellow-700 mb-1">
                Checklist Incompleto
              </p>
              <p className="text-sm text-yellow-400 dark:text-yellow-400 light:text-yellow-600">
                Se recomienda completar al menos el 80% de los items para garantizar un nivel óptimo de seguridad.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
