export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
}

export interface CategoriaPrecios {
  categoria: string;
  productos: Producto[];
}
