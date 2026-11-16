export interface MensajeChat {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatPeticion {
  mensaje: string;
  historial: MensajeChat[];
}

export interface AccionChat {
  herramienta: string;
  tipo: string;
  datos: any;
}

export interface ChatRespuesta {
  respuesta: string;
  acciones?: AccionChat[];
}

export interface MensajeVista extends MensajeChat {
  acciones: AccionChat[];
}

export const TIPOS_ACCION = [
  'menu',
  'productos',
  'especialidades',
  'servicios',
  'info',
  'opciones',
  'carrito',
  'checkout',
  'pedido',
  'reserva',
] as const;
