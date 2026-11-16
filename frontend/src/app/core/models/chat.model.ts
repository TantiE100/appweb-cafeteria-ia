import { Servicio } from './servicio.model';
import { Especialidad } from './especialidad.model';
import { CategoriaPrecios, Producto } from './precio.model';

export interface MensajeChat {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatPeticion {
  mensaje: string;
  historial: MensajeChat[];
}

export interface ProductoCategoria extends Producto {
  categoria: string;
}

export interface ItemPedido {
  producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  detalle?: string | null;
}

export interface PedidoChat {
  id: number;
  codigo: string;
  cliente: string;
  estado: string;
  total: number;
  creado_en: string;
  items: ItemPedido[];
}

export interface ReservaChat {
  id: number;
  codigo: string;
  nombre: string;
  fecha: string;
  hora: string;
  personas: number;
  estado: string;
}

export interface InfoChat {
  direccion: string;
  telefono: string;
  horario: string;
  email: string;
}

export interface OpcionCafe {
  id: number;
  nombre: string;
  precio_extra: number;
}

export interface OpcionesCafe {
  tamanos: OpcionCafe[];
  bases: OpcionCafe[];
  leches: OpcionCafe[];
  extras: OpcionCafe[];
  endulzantes?: OpcionCafe[];
}

export type AccionChat =
  | { herramienta: string; tipo: 'menu'; datos: CategoriaPrecios[] }
  | { herramienta: string; tipo: 'productos'; datos: ProductoCategoria[] }
  | { herramienta: string; tipo: 'especialidades'; datos: Especialidad[] }
  | { herramienta: string; tipo: 'pedido'; datos: PedidoChat }
  | { herramienta: string; tipo: 'reserva'; datos: ReservaChat }
  | { herramienta: string; tipo: 'info'; datos: InfoChat }
  | { herramienta: string; tipo: 'servicios'; datos: Servicio[] }
  | { herramienta: string; tipo: 'opciones'; datos: OpcionesCafe };

export interface ChatRespuesta {
  respuesta: string;
  acciones?: { herramienta: string; tipo: string; datos: unknown }[];
}

export interface MensajeVista extends MensajeChat {
  acciones: AccionChat[];
}

export const TIPOS_ACCION = [
  'menu',
  'productos',
  'especialidades',
  'pedido',
  'reserva',
  'info',
  'servicios',
  'opciones',
] as const;
