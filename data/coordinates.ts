// Coordenadas exactas verificadas de las residencias
export const residenceCoordinates: { [key: string]: { coords: [number, number], distrito: string } } = {
  'PPLJF01-2025': { coords: [-12.1133984, -76.9799156], distrito: 'SANTIAGO DE SURCO' },
  'PPAAM02-2025': { coords: [-12.0694812, -77.0955874], distrito: 'SAN MIGUEL' },
  'PPECS03-2025': { coords: [-12.0876258, -76.9690655], distrito: 'SANTIAGO DE SURCO' },
  'PPLJS04-2025': { coords: [-12.1004511, -77.0387511], distrito: 'SAN ISIDRO' },
  'PPGCO05-2025': { coords: [-12.1003531, -77.0393026], distrito: 'SAN ISIDRO' },
  'PPJSF06-2025': { coords: [-12.0966654, -77.0492029], distrito: 'SAN ISIDRO' },
  'PPNGM07-2025': { coords: [-12.1162545, -77.0473377], distrito: 'MIRAFLORES' },
  'PPDAA08-2025': { coords: [-12.1111686, -77.0411392], distrito: 'MIRAFLORES' },
  'PPRMB09-2025': { coords: [-12.0763349, -76.9309249], distrito: 'LA MOLINA' },
  'PPGV10-2025': { coords: [-12.1089155, -77.0421144], distrito: 'SAN ISIDRO' },
  'PPVBM11-2025': { coords: [-12.1087597, -77.0448224], distrito: 'SAN ISIDRO' },
};

// Coordenadas de servicios cercanos verificadas
export const serviceCoordinatesMap: { [distrito: string]: { [tipo: string]: [number, number][] } } = {
  'SANTIAGO DE SURCO': {
    clinicas: [
      [-12.10406, -76.97292], // Clínica Internacional
      [-12.10000, -76.97194], // Clínica San Pablo
      [-12.10650, -76.96950], // Clinical Monterrico
      [-12.10326, -76.97298], // Clínica Montesur
      [-12.10280, -76.97350], // Clínica Morillas
    ],
    comisarias: [
      [-12.1089, -77.0243],   // Comisaría Surco
      [-12.0700, -77.0900],   // Comisaría Ate Vitarte
      [-12.0750, -77.0900],   // Comisaría PNP El Sol
    ],
    serenazgo: [[-12.0998, -77.0213]],
  },
  'SAN ISIDRO': {
    clinicas: [
      [-12.0985, -77.0375],   // Centro médico
      [-12.1012, -77.0400],   // Clínica local
      [-12.0990, -77.0390],   // Centro de salud
    ],
    comisarias: [
      [-12.0940, -77.0440],   // Comisaría Jesús María
      [-12.1050, -77.0250],   // Comisaría Lince
      [-12.1030, -77.0260],   // Comisaría San Isidro
    ],
    serenazgo: [[-12.0963, -77.0358]],
  },
  'MIRAFLORES': {
    clinicas: [
      [-12.1150, -77.0460],   // Centro de salud
      [-12.1175, -77.0480],   // Clínica local
      [-12.1140, -77.0500],   // Centro médico
    ],
    comisarias: [
      [-12.1220, -77.0340],   // Comisaría Miraflores
      [-12.1090, -77.0220],   // Comisaría Surquillo
      [-12.1480, -77.0200],   // Comisaría Barranco
    ],
    serenazgo: [[-12.1195, -77.0295]],
  },
  'LA MOLINA': {
    clinicas: [
      [-12.0780, -76.9290],   // Centro de salud
      [-12.0750, -76.9330],   // Clínica local
      [-12.0800, -76.9315],   // Consultorio
    ],
    comisarias: [
      [-12.0970, -76.9950],   // Comisaría San Borja Norte
      [-12.1090, -77.0220],   // Comisaría Surquillo
    ],
    serenazgo: [[-12.0765, -76.9493]],
  },
  'SAN MIGUEL': {
    clinicas: [
      [-12.06999, -77.09585], // Polyclinic Precursors
      [-12.06850, -77.09600], // Clínica Providencia
      [-12.06350, -77.09850], // San Gabriel Clinic
      [-12.06500, -77.09800], // Municipal Polyclinic
    ],
    comisarias: [
      [-12.06980, -77.09590], // Comisaria Maranga
      [-12.06750, -77.09950], // COMISARIA PNP SECTORIAL
      [-12.06600, -77.09500], // San Miguel Police Station
    ],
    serenazgo: [[-12.06900, -77.09700]],
  },
};
