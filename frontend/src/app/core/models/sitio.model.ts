export interface SitioCafeteria {
  nombre: string;
  eslogan: string;
  titulo: string;
  titulo_destacado: string;
  ciudad: string;
  historia: string;
  direccion: string;
  telefono: string;
  email: string;
  horario: string;
  video: string;
}

export interface EnlaceNavegacion {
  etiqueta: string;
  ruta: string;
  icono: string;
}

export interface Sugerencia {
  texto: string;
  icono: string;
}

export interface Agente {
  nombre: string;
  rol: string;
}

export interface Sitio {
  cafeteria: SitioCafeteria;
  textos: Record<string, string>;
  navegacion: EnlaceNavegacion[];
  sugerencias: Sugerencia[];
  agente: Agente;
}
