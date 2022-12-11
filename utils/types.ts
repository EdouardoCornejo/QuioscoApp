export interface Categoria {
  id: number;
  nombre: string;
  icono: string;
}

export interface Categorias {
  categorias: Categoria[];
}

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  categoriaId: number;
}

export interface Orden {
  id: number;
  nombre: String;
  fecha: String;
  total: number;
  pedido: String;
}
