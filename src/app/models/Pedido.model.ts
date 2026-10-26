export interface ItemPedido {
  productoId: string;
  nombre: string;
  img: string;
  precio: number;
  cantidad: number;
}

export interface Pedido {
  id?: string;
  usuarioId: string;
  usuarioEmail: string;
  fecha: string; // ISO, igual que la app móvil
  estado: 'pendiente' | 'entregado' | 'cancelado';
  total: number;
  items: ItemPedido[];
}