export interface Producto {
  nombre: string;
  precio: number;
  img: string;
  codigo: string;
  categoria: 'camisetas' | 'stickers' | 'posters';
}