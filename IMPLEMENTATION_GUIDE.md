# Guía de Implementación - Nuevas Funcionalidades

## 📋 Índice de Funcionalidades

1. [Mapa General de Todas las Residencias](#1-mapa-general-de-todas-las-residencias)
2. [Comparativa de Residencias](#2-comparativa-de-residencias)
3. [Panel de Estadísticas Globales](#3-panel-de-estadísticas-globales)
4. [Calculadora de Tiempo de Respuesta](#4-calculadora-de-tiempo-de-respuesta)
5. [Reportes Descargables](#5-reportes-descargables)
6. [Sistema de Búsqueda y Filtros](#6-sistema-de-búsqueda-y-filtros)
7. [Checklist de Medidas de Seguridad](#7-checklist-de-medidas-de-seguridad)
8. [Dashboard Ejecutivo](#8-dashboard-ejecutivo)
9. [Modo Nocturno/Claro](#9-modo-nocturno-claro)

---

## 1. Mapa General de Todas las Residencias

### Objetivo
Vista unificada de las 11 residencias en un solo mapa con marcadores de colores según nivel de riesgo.

### Componentes a Crear
- `components/MapaGeneral.tsx` - Componente principal del mapa
- `utils/mapHelpers.ts` - Funciones auxiliares para marcadores

### Datos Necesarios
- `data/residences.json` - Ya existente
- `data/coordinates.ts` - Ya existente

### Implementación
```typescript
// Estructura del componente
- Mapa Leaflet con todas las residencias
- Marcadores personalizados por nivel de riesgo:
  * Verde: riesgo bajo (0-33%)
  * Amarillo: riesgo medio (34-66%)
  * Rojo: riesgo alto (67-100%)
- Popup al hacer click: nombre, dirección, risk score
- Botón para centrar en todas las residencias
- Leyenda de colores
```

### Integración
- Agregar nueva opción en sidebar: "Mapa General"
- Nueva ruta en dashboard: `/dashboard?view=mapGeneral`

### Responsive
- Sidebar colapsable en mobile
- Controles de zoom accesibles en táctil

---

## 2. Comparativa de Residencias

### Objetivo
Visualización comparativa de risk scores, amenaza y vulnerabilidad entre todas las residencias.

### Componentes a Crear
- `components/ComparativaResidencias.tsx` - Vista principal
- `components/charts/BarrasComparativas.tsx` - Gráfico de barras
- `components/charts/TablaRanking.tsx` - Tabla ordenable

### Datos Necesarios
- `data/residences.json` - Ya existente
- Calcular promedios y rankings en tiempo real

### Implementación
```typescript
// Secciones del componente
1. Gráfico de barras horizontal:
   - Risk Score por residencia
   - Amenaza por residencia
   - Vulnerabilidad por residencia
   - Selector para cambiar métrica

2. Tabla de ranking:
   - Columnas: ID, Nombre, Distrito, Risk Score, Amenaza, Vulnerabilidad
   - Ordenable por cualquier columna
   - Color de fila según nivel de riesgo

3. Filtros:
   - Por distrito
   - Por rango de risk score
   - Búsqueda por nombre/ID
```

### Librería
- Usar `recharts` (ya instalado) para gráficos

### Integración
- Nueva opción en sidebar: "Comparativa"
- Accesible desde vista principal con botón "Comparar Residencias"

---

## 3. Panel de Estadísticas Globales

### Objetivo
Dashboard con KPIs agregados de todas las residencias.

### Componentes a Crear
- `components/EstadisticasGlobales.tsx` - Panel principal
- `components/stats/KPICard.tsx` - Tarjeta de KPI individual
- `components/charts/DistribucionChart.tsx` - Gráfico de distribución

### Datos a Calcular
```typescript
interface GlobalStats {
  totalResidencias: number;
  promedioRiesgo: number;
  residenciasAltoRiesgo: number;
  residenciasMedioRiesgo: number;
  residenciasBajoRiesgo: number;
  promedioAmenaza: number;
  promedioVulnerabilidad: number;
  distritoMasSeguro: string;
  distritoMenosSeguro: string;
}
```

### Implementación
```typescript
// Layout del componente
1. Fila de KPIs principales (tarjetas grandes):
   - Total Residencias
   - Promedio de Riesgo General
   - Residencias que Requieren Atención (alto riesgo)
   - Distrito con Mayor Riesgo

2. Gráficos:
   - Donut: Distribución por nivel de riesgo
   - Barras: Promedio por distrito
   - Barras horizontales: Top 5 residencias con mayor riesgo

3. Alertas:
   - Lista de residencias críticas (>80% riesgo)
   - Recomendaciones automáticas
```

### Integración
- Nueva sección en vista "Principal" del dashboard
- O nueva vista independiente "Estadísticas Globales"

---

## 4. Calculadora de Tiempo de Respuesta

### Objetivo
Calcular y mostrar tiempos de respuesta de emergencias para cada residencia.

### Componentes a Crear
- `components/TiemposRespuesta.tsx` - Vista principal
- `components/MapaTiempos.tsx` - Mapa con isocronas
- `utils/routingCalculator.ts` - Cálculos de rutas

### Datos Necesarios
- `data/coordinates.ts` - Ya existente
- `data/emergencias.json` - Ya existente
- API de routing (OSRM) - Ya integrado

### Implementación
```typescript
// Funcionalidad
1. Por cada residencia, calcular:
   - Tiempo a clínica más cercana
   - Tiempo a comisaría más cercana
   - Tiempo a serenazgo más cercano
   - Identificar cuál es el más crítico

2. Visualización:
   - Tabla con todas las residencias y sus tiempos
   - Semáforo de color:
     * Verde: < 5 min
     * Amarillo: 5-10 min
     * Rojo: > 10 min
   - Mapa con círculos de tiempo (isocronas)

3. Filtros y ordenamiento:
   - Por tipo de servicio
   - Por tiempo de respuesta
   - Por distrito

4. Recomendaciones:
   - Identificar residencias con tiempos críticos
   - Sugerir servicios alternativos
```

### Integración
- Nueva opción en sidebar: "Tiempos de Respuesta"
- Link desde vista de Rutas

---

## 5. Reportes Descargables

### Objetivo
Generar PDFs con el assessment completo de cada residencia.

### Librerías a Instalar
```bash
npm install jspdf jspdf-autotable html2canvas
```

### Componentes a Crear
- `components/GeneradorReportes.tsx` - UI para generar reporte
- `utils/pdfGenerator.ts` - Lógica de generación de PDF
- `components/VistaPrevia.tsx` - Preview antes de descargar

### Estructura del PDF
```typescript
// Secciones del reporte
1. Portada:
   - Logo Pluspetrol
   - Nombre de residencia
   - Fecha del reporte
   - ID de residencia

2. Resumen Ejecutivo:
   - Risk Score destacado
   - Nivel de Amenaza
   - Nivel de Vulnerabilidad
   - Clasificación de riesgo

3. Gráficos:
   - Velocímetro de riesgo (captura)
   - Termómetros (capturas)
   - Donut charts (capturas)

4. Mapa:
   - Ubicación de la residencia
   - Servicios cercanos marcados

5. Datos Detallados:
   - Tabla con todos los indicadores
   - Dirección completa
   - Distrito
   - Teléfonos de emergencia

6. Recomendaciones:
   - Basadas en nivel de riesgo
   - Acciones prioritarias
```

### Implementación
```typescript
// Función principal
async function generarReportePDF(residenceId: string) {
  // 1. Capturar gráficos como imágenes con html2canvas
  // 2. Crear documento jsPDF
  // 3. Agregar todas las secciones
  // 4. Generar y descargar
}
```

### Integración
- Botón "Descargar Reporte" en cada vista de residencia
- Opción para generar reportes múltiples (todas las residencias)

---

## 6. Sistema de Búsqueda y Filtros

### Objetivo
Interfaz para buscar y filtrar residencias fácilmente.

### Componentes a Crear
- `components/BuscadorResidencias.tsx` - Barra de búsqueda
- `components/FiltrosAvanzados.tsx` - Panel de filtros
- `components/ResultadosBusqueda.tsx` - Grid/lista de resultados
- `hooks/useResidenceSearch.ts` - Lógica de búsqueda

### Funcionalidad de Búsqueda
```typescript
interface SearchFilters {
  searchTerm: string; // Busca en ID, nombre, dirección
  distrito: string | null;
  riskLevel: 'bajo' | 'medio' | 'alto' | null;
  riskScoreMin: number;
  riskScoreMax: number;
  threatLevelMin: number;
  threatLevelMax: number;
  vulnerabilityLevelMin: number;
  vulnerabilityLevelMax: number;
}
```

### Implementación
```typescript
// UI del componente
1. Barra de búsqueda principal:
   - Input con icono de búsqueda
   - Búsqueda en tiempo real
   - Sugerencias mientras escribe

2. Filtros laterales:
   - Dropdown de distritos
   - Chips de nivel de riesgo
   - Sliders para rangos numéricos
   - Botón "Limpiar filtros"

3. Resultados:
   - Vista de tarjetas (grid)
   - Vista de lista (tabla)
   - Toggle para cambiar vista
   - Contador de resultados
   - Sin resultados: mensaje amigable

4. Ordenamiento:
   - Por relevancia
   - Por risk score (asc/desc)
   - Por nombre (A-Z)
   - Por distrito
```

### Integración
- Reemplazar selector simple en topbar con componente de búsqueda avanzada
- O crear nueva vista "Explorar Residencias"

---

## 7. Checklist de Medidas de Seguridad

### Objetivo
Sistema para verificar controles de seguridad implementados en cada residencia.

### Componentes a Crear
- `components/ChecklistSeguridad.tsx` - Vista principal
- `components/checklist/CategoriaChecklist.tsx` - Grupo de items
- `components/checklist/ItemChecklist.tsx` - Item individual
- `data/checklistTemplate.json` - Template de checklist

### Estructura de Datos
```typescript
interface ChecklistItem {
  id: string;
  categoria: 'accesos' | 'entorno' | 'iluminacion' | 'perimetro' | 'proteccion' | 'tecnologia';
  descripcion: string;
  implementado: boolean;
  prioridad: 'alta' | 'media' | 'baja';
  notas?: string;
}

interface ChecklistResidencia {
  residenceId: string;
  items: ChecklistItem[];
  porcentajeCompletado: number;
  ultimaActualizacion: Date;
}
```

### Template de Checklist (checklistTemplate.json)
```json
{
  "accesos": [
    "Control de acceso con guardia 24/7",
    "Sistema de registro de visitantes",
    "Cámaras en todos los accesos",
    "Puertas con cerradura de seguridad",
    "Intercomunicador funcionando"
  ],
  "perimetro": [
    "Muro perimetral en buen estado",
    "Rejas sin daños o espacios",
    "Alambre de púas o concertina",
    "Sistema de detección perimetral"
  ],
  // ... continuar para todas las categorías
}
```

### Implementación
```typescript
// Vista del componente
1. Header:
   - Nombre de residencia
   - Progreso global (barra de porcentaje)
   - Última actualización
   - Botón "Guardar cambios"

2. Categorías expandibles (acordeón):
   - Cada categoría (6 en total)
   - Mostrar progreso de la categoría
   - Items con checkbox
   - Campo de notas por item
   - Indicador de prioridad

3. Resumen:
   - Items completados / total
   - Items prioritarios pendientes
   - Próximas acciones recomendadas

4. Exportar:
   - Generar PDF del checklist
   - Exportar a Excel
```

### Storage
- Usar localStorage para desarrollo
- Preparar estructura para futura integración con BD

### Integración
- Nueva opción en sidebar: "Checklist Seguridad"
- Accesible desde vista de cada residencia con botón "Ver Checklist"

---

## 8. Dashboard Ejecutivo

### Objetivo
Vista simplificada para gerencia con solo información crítica.

### Componentes a Crear
- `components/DashboardEjecutivo.tsx` - Vista principal
- `components/executive/MetricCard.tsx` - Métrica ejecutiva
- `components/executive/AlertCard.tsx` - Alerta crítica

### Diseño y Contenido
```typescript
// Layout simple y claro
1. KPIs Principales (3-4 tarjetas grandes):
   - Estado Global de Seguridad (promedio)
   - Residencias en Alerta Roja (cantidad)
   - Mejora vs. Período Anterior (si hay datos históricos)
   - Inversión Requerida (placeholder)

2. Mapa Ejecutivo:
   - Solo residencias críticas marcadas
   - Vista simplificada sin detalles
   - Click para ir a detalle

3. Top 5 Prioridades:
   - Lista de residencias que necesitan atención
   - Risk score y acción recomendada
   - Botón directo a cada residencia

4. Resumen por Distrito:
   - Tabla compacta
   - Solo promedios por distrito
   - Semáforo visual

5. Sin gráficos complejos:
   - Solo información accionable
   - Números grandes y claros
   - Colores de alerta obvios
```

### Características Especiales
- Modo de solo lectura (no permite ediciones)
- Actualización automática cada X segundos
- Modo presentación (fullscreen)
- Imprimible en formato ejecutivo

### Integración
- Nueva opción en sidebar: "Vista Ejecutiva"
- Posible página de inicio alternativa para ejecutivos

---

## 9. Modo Nocturno/Claro

### Objetivo
Toggle para cambiar entre tema oscuro y claro.

### Implementación

#### 1. Context Provider
```typescript
// contexts/ThemeContext.tsx
interface ThemeContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}
```

#### 2. Actualizar Tailwind Config
```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // Ya está configurado
  theme: {
    extend: {
      colors: {
        light: {
          background: '#ffffff',
          foreground: '#000000',
          // ... más colores
        },
        dark: {
          background: '#0f172a', // slate-900
          foreground: '#ffffff',
          // ... más colores (ya existentes)
        }
      }
    }
  }
}
```

#### 3. Variables CSS
```css
/* globals.css - agregar tema claro */
.light {
  --background: 255 255 255;
  --foreground: 0 0 0;
  --primary: 37 99 235; /* blue-600 */
  --secondary: 71 85 105; /* slate-600 */
  --accent: 234 179 8; /* yellow-500 */
  --border: 226 232 240; /* slate-200 */
  --card: 248 250 252; /* slate-50 */
}

.dark {
  /* Ya existente, validar que esté completo */
}
```

#### 4. Componente Toggle
```typescript
// components/ThemeToggle.tsx
- Icono de sol/luna
- Animación de transición
- Guardar preferencia en localStorage
```

#### 5. Actualizar Todos los Componentes
```typescript
// Patrón a seguir:
className="bg-slate-900 dark:bg-slate-900 light:bg-white"
className="text-white dark:text-white light:text-slate-900"
```

### Integración
- Toggle en topbar (esquina superior derecha)
- Toggle en sidebar
- Detectar preferencia del sistema al inicio

### Componentes a Actualizar
- Layout principal
- Sidebar
- Topbar
- Todas las tarjetas
- Gráficos (ajustar colores)
- Mapas (estilo de mapa claro/oscuro)
- Modales

---

## 🚀 Orden de Implementación Recomendado

### Fase 1: Fundamentos (Día 1)
1. **Modo Nocturno/Claro** - Base para todos los demás componentes
2. **Sistema de Búsqueda y Filtros** - Mejora inmediata de UX

### Fase 2: Visualización (Día 2)
3. **Mapa General** - Alta visibilidad
4. **Comparativa de Residencias** - Insights inmediatos
5. **Panel de Estadísticas Globales** - Complementa comparativa

### Fase 3: Funcionalidad Avanzada (Día 3)
6. **Calculadora de Tiempo de Respuesta** - Valor estratégico
7. **Dashboard Ejecutivo** - Simplifica acceso para gerencia

### Fase 4: Documentación y Seguimiento (Día 4)
8. **Checklist de Medidas** - Operativo importante
9. **Reportes Descargables** - Cierre profesional

---

## 📦 Dependencias Adicionales Necesarias

```bash
# Para reportes PDF
npm install jspdf jspdf-autotable html2canvas

# Para exportar a Excel (opcional en checklist)
npm install xlsx

# Para búsqueda avanzada (opcional)
npm install fuse.js
```

---

## 🎨 Consideraciones de Diseño

### Consistencia
- Mantener el sistema de colores actual (azul, slate)
- Usar mismos componentes de motion (framer-motion)
- Iconografía consistente (lucide-react)

### Responsive
- Todas las nuevas vistas deben ser mobile-first
- Usar breakpoints de Tailwind: sm, md, lg, xl
- Priorizar una columna en mobile

### Accesibilidad
- Contraste adecuado en modo claro
- Labels en todos los controles
- Navegación por teclado

### Performance
- Lazy loading de componentes grandes
- Memoización de cálculos pesados
- Virtual scrolling si hay muchas residencias

---

## 📝 Testing

### Por cada funcionalidad:
1. Verificar en mobile y desktop
2. Probar con todos los datos de residencias
3. Verificar modo claro y oscuro
4. Probar casos límite (sin datos, errores)

### Checklist de QA:
- [ ] Build pasa sin errores
- [ ] No hay errores de TypeScript
- [ ] Responsive funciona correctamente
- [ ] Performance aceptable
- [ ] Navegación fluida entre vistas
- [ ] Datos se muestran correctamente

---

## 🔄 Flujo de Commits

Para cada funcionalidad:
```bash
git add .
git commit -m "feat: Add [funcionalidad] - [descripción breve]"
```

Al final de cada fase:
```bash
git add .
git commit -m "chore: Complete Phase [número] - [lista de funcionalidades]"
```

---

¿Listo para comenzar la implementación? 🚀
