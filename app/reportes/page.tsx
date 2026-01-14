'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Download, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import residencesData from '@/data/residences.json';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Disable static generation
export const dynamic = 'force-dynamic';

export default function ReportesPage() {
  const router = useRouter();
  const [selectedResidence, setSelectedResidence] = useState<string>(residencesData.residences[0].id);
  const [generating, setGenerating] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const residence = residencesData.residences.find(r => r.id === selectedResidence);

  const generatePDF = async () => {
    if (!reportRef.current || !residence) return;

    setGenerating(true);

    try {
      // Temporarily show the report for rendering
      reportRef.current.style.display = 'block';

      // Wait for images to load
      await new Promise(resolve => setTimeout(resolve, 500));

      // Capture the report as canvas
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      // Hide report again
      reportRef.current.style.display = 'none';

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297; // A4 height in mm

      // Add additional pages if content is longer
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      // Save PDF
      const filename = `reporte_${residence.id}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(filename);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF. Por favor intente nuevamente.');
    } finally {
      setGenerating(false);
    }
  };

  const exportAsText = () => {
    if (!residence) return;

    let text = `REPORTE DE EVALUACIÓN DE SEGURIDAD\n`;
    text += `=`.repeat(50) + `\n\n`;
    text += `Código: ${residence.id}\n`;
    text += `Nombre: ${residence.name}\n`;
    text += `Dirección: ${residence.address}\n`;
    text += `Fecha de Evaluación: ${residence.evaluationDate}\n\n`;
    
    text += `CALIFICACIÓN GENERAL\n`;
    text += `-`.repeat(50) + `\n`;
    text += `Nivel de Riesgo: ${residence.riskLevel.toUpperCase()}\n`;
    text += `Puntaje de Riesgo: ${residence.riskScore}/10\n`;
    text += `Nivel de Amenaza: ${residence.threatLevel}/10\n`;
    text += `Nivel de Vulnerabilidad: ${residence.vulnerabilityLevel}/10\n\n`;
    
    text += `DETALLE DE VULNERABILIDADES\n`;
    text += `-`.repeat(50) + `\n`;
    text += `Accesos: ${residence.accesos}%\n`;
    text += `Entorno: ${residence.entorno}%\n`;
    text += `Iluminación: ${residence.iluminacion}%\n`;
    text += `Perímetro: ${residence.perimetro}%\n`;
    text += `Medios de Protección: ${residence.mediosProteccion}%\n`;
    text += `Medios Tecnológicos: ${residence.mediosTecnologicos}%\n\n`;
    
    text += `CONTACTOS DE EMERGENCIA\n`;
    text += `-`.repeat(50) + `\n`;
    text += `Policía: ${residence.emergencyContacts.police}\n`;
    text += `Bomberos: ${residence.emergencyContacts.fire}\n`;
    text += `Ambulancia: ${residence.emergencyContacts.ambulance}\n\n`;
    
    text += `Reporte generado el ${new Date().toLocaleString()}\n`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_${residence.id}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!residence) return null;

  const getRiskColor = (score: number) => {
    if (score >= 7) return 'text-red-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getRiskBgColor = (score: number) => {
    if (score >= 7) return 'bg-red-100';
    if (score >= 5) return 'bg-yellow-100';
    return 'bg-green-100';
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
                <FileText className="w-6 h-6" />
                Reportes Descargables
              </h1>
              <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
                Generar reportes en PDF o TXT de evaluaciones de seguridad
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Controls */}
        <div className="mt-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 w-full md:w-auto">
            <label className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 uppercase font-semibold mb-2 block">
              Seleccionar Residencia
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

          <div className="flex gap-2">
            <button
              onClick={generatePDF}
              disabled={generating}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white font-semibold text-sm flex items-center gap-2 transition-colors"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Descargar PDF
                </>
              )}
            </button>
            <button
              onClick={exportAsText}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center gap-2 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Exportar TXT
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        {/* Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-xl p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-slate-200 dark:text-slate-200 light:text-[#003B7A] mb-4">
            Vista Previa del Reporte
          </h2>
          <div className="bg-slate-700/30 dark:bg-slate-700/30 light:bg-blue-50 rounded-lg p-6 space-y-4">
            <div>
              <div className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 mb-1">Residencia</div>
              <div className="text-lg font-bold text-slate-200 dark:text-slate-200 light:text-slate-900">
                {residence.id} - {residence.name}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 mb-1">Dirección</div>
              <div className="text-slate-300 dark:text-slate-300 light:text-slate-700">
                {residence.address}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 mb-1">Nivel de Riesgo</div>
                <div className={`text-2xl font-bold ${getRiskColor(residence.riskScore)}`}>
                  {residence.riskScore}/10
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 mb-1">Amenaza</div>
                <div className={`text-2xl font-bold ${getRiskColor(residence.threatLevel)}`}>
                  {residence.threatLevel}/10
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 mb-1">Vulnerabilidad</div>
                <div className={`text-2xl font-bold ${getRiskColor(residence.vulnerabilityLevel)}`}>
                  {residence.vulnerabilityLevel}/10
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info */}
        <div className="bg-blue-500/10 dark:bg-blue-500/10 light:bg-blue-50 border border-blue-500/30 dark:border-blue-500/30 light:border-blue-200 rounded-xl p-4 text-sm text-blue-300 dark:text-blue-300 light:text-blue-700">
          <p className="font-semibold mb-2">Información sobre los reportes:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-400 dark:text-blue-400 light:text-blue-600">
            <li>El PDF incluye toda la información de evaluación y gráficos</li>
            <li>El archivo TXT contiene un resumen en formato texto plano</li>
            <li>Los reportes se generan con la fecha actual</li>
            <li>Puede generar reportes para cualquier residencia del sistema</li>
          </ul>
        </div>
      </div>

      {/* Hidden Report Template for PDF Generation */}
      <div ref={reportRef} style={{ display: 'none', width: '210mm', backgroundColor: 'white', padding: '20mm' }}>
        <div style={{ fontFamily: 'Arial, sans-serif', color: '#000' }}>
          {/* Header */}
          <div style={{ borderBottom: '3px solid #003B7A', paddingBottom: '10px', marginBottom: '20px' }}>
            <h1 style={{ color: '#003B7A', fontSize: '24px', margin: 0 }}>
              REPORTE DE EVALUACIÓN DE SEGURIDAD
            </h1>
            <p style={{ color: '#666', fontSize: '12px', margin: '5px 0 0 0' }}>
              Generado el {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Residence Info */}
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ color: '#003B7A', fontSize: '18px', marginBottom: '10px' }}>
              Información de la Residencia
            </h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '8px', backgroundColor: '#f5f5f5', fontWeight: 'bold', width: '30%' }}>Código:</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{residence.id}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Nombre:</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{residence.name}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Dirección:</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{residence.address}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Fecha de Evaluación:</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{residence.evaluationDate}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Risk Assessment */}
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ color: '#003B7A', fontSize: '18px', marginBottom: '10px' }}>
              Calificación General
            </h2>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <div style={{ flex: 1, padding: '15px', backgroundColor: getRiskBgColor(residence.riskScore), borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Riesgo</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: getRiskColor(residence.riskScore).replace('text-', '') }}>
                  {residence.riskScore}
                </div>
              </div>
              <div style={{ flex: 1, padding: '15px', backgroundColor: getRiskBgColor(residence.threatLevel), borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Amenaza</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: getRiskColor(residence.threatLevel).replace('text-', '') }}>
                  {residence.threatLevel}
                </div>
              </div>
              <div style={{ flex: 1, padding: '15px', backgroundColor: getRiskBgColor(residence.vulnerabilityLevel), borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Vulnerabilidad</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: getRiskColor(residence.vulnerabilityLevel).replace('text-', '') }}>
                  {residence.vulnerabilityLevel}
                </div>
              </div>
            </div>
          </div>

          {/* Vulnerabilities Detail */}
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ color: '#003B7A', fontSize: '18px', marginBottom: '10px' }}>
              Detalle de Vulnerabilidades
            </h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#003B7A', color: 'white' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Categoría</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Porcentaje</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>Accesos</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontWeight: 'bold' }}>
                    {residence.accesos}%
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>Entorno</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontWeight: 'bold' }}>
                    {residence.entorno}%
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>Iluminación</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontWeight: 'bold' }}>
                    {residence.iluminacion}%
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>Perímetro</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontWeight: 'bold' }}>
                    {residence.perimetro}%
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>Medios de Protección</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontWeight: 'bold' }}>
                    {residence.mediosProteccion}%
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>Medios Tecnológicos</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontWeight: 'bold' }}>
                    {residence.mediosTecnologicos}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Emergency Contacts */}
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ color: '#003B7A', fontSize: '18px', marginBottom: '10px' }}>
              Contactos de Emergencia
            </h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '8px', backgroundColor: '#f5f5f5', fontWeight: 'bold', width: '30%' }}>Policía:</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{residence.emergencyContacts.police}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Bomberos:</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{residence.emergencyContacts.fire}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Ambulancia:</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{residence.emergencyContacts.ambulance}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '2px solid #003B7A', fontSize: '10px', color: '#666', textAlign: 'center' }}>
            <p>Este reporte fue generado automáticamente por el Sistema de Evaluación de Seguridad</p>
            <p>Pluspetrol - Dashboard de Seguridad Residencial</p>
          </div>
        </div>
      </div>
    </div>
  );
}
