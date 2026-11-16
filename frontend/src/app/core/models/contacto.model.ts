export interface ContactoPeticion {
  nombre: string;
  email: string;
  telefono?: string;
  mensaje: string;
}

export interface ContactoRespuesta {
  id: number;
  mensaje: string;
}
