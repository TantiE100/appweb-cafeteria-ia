export interface ItemCarrito {
  id: number;
  producto_id: number;
  nombre: string;
  precio_unitario: number;
  cantidad: number;
  detalle?: string | null;
  subtotal: number;
}

export interface Carrito {
  id: number;
  items: ItemCarrito[];
  cantidad: number;
  total: number;
}

export type Modalidad = 'mesa' | 'llevar' | 'delivery';
export type MetodoPago = 'tarjeta' | 'qr' | 'efectivo';

export interface CheckoutPeticion {
  cliente: string;
  telefono?: string;
  modalidad: Modalidad;
  metodo_pago: MetodoPago;
  tarjeta?: { numero: string; vencimiento: string; cvv: string };
}

export interface ItemPedido {
  producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  detalle?: string | null;
}

export interface Pedido {
  id: number;
  codigo: string;
  cliente: string;
  modalidad: string;
  estado: string;
  total: number;
  metodo_pago: string;
  pago_estado: string;
  creado_en: string;
  items: ItemPedido[];
}

export interface MenuRespuesta {
  categoria: string | null;
  categorias: string[];
  pagina: number;
  por_pagina: number;
  total: number;
  total_paginas: number;
  productos: { id: number; nombre: string; descripcion: string; precio: number; categoria: string }[];
}
