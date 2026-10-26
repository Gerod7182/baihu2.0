import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { PedidoService } from '../../services/pedido.service';
import { ItemPedido, Pedido } from '../../models/Pedido.model';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  carrito: any[] = [];
  total: number = 0;
  textos: any = {};
  procesandoCompra = false;
  mensajeError = '';

  constructor(
    private readonly translationService: TranslationService,
    private readonly cartService: CartService,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    this.cargarCarrito();

    this.translationService.idioma$.subscribe(idioma => {
      this.textos = this.translationService.obtenerTextos(idioma);
    });
  }

  cargarCarrito() {
    this.carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.carrito.reduce(
      (acc, item) => acc + (item.precio * item.cantidad),
      0
    );
  }

  get unidades(): number {
    return this.carrito.reduce((acc, item) => acc + item.cantidad, 0);
  }

  nombreDe(item: any): string {
    return item.nombre || this.textos[item.id] || item.id;
  }

  precio(valor: number): string {
    return valor.toLocaleString('es-CO');
  }

  trackItem(_: number, item: any): string {
    return item.id;
  }

  cambiarCantidad(id: string, delta: number) {
    this.cartService.cambiarCantidad(id, delta);
    this.cargarCarrito();
  }

  eliminarItem(id: string) {
    this.cartService.eliminarItem(id);
    this.cargarCarrito();
  }

  vaciarCarrito() {
    this.cartService.vaciarCarrito();
    this.carrito = [];
    this.total = 0;
  }

  // FINALIZAR COMPRA: guarda el pedido real en Firestore
  async finalizarCompra() {

    if (this.carrito.length === 0 || this.procesandoCompra) return;

    const usuario = await this.authService.obtenerUsuarioActual();

    // Sin sesión: mandamos a login. El carrito sigue en localStorage.
    if (!usuario) {
      this.router.navigate(['/login']);
      return;
    }

    this.procesandoCompra = true;
    this.mensajeError = '';

    const items: ItemPedido[] = this.carrito.map(item => ({
      productoId: item.id,
      nombre: this.nombreDe(item),   // nunca undefined (Firestore lo rechazaría)
      img: item.img ?? '',
      precio: item.precio,
      cantidad: item.cantidad
    }));

    const pedido: Pedido = {
      usuarioId: usuario.uid,
      usuarioEmail: usuario.email ?? '',
      fecha: new Date().toISOString(),
      estado: 'pendiente',
      total: this.total,
      items: items
    };

    try {
      await this.pedidoService.crearPedido(pedido);

      // Vaciar el carrito solo si el pedido se guardó bien
      this.cartService.vaciarCarrito();

      this.router.navigate(['/gracias']);
    } catch (error) {
      console.error('Error al finalizar la compra:', error);
      this.mensajeError = 'No se pudo procesar tu compra. Intenta de nuevo.';
    } finally {
      this.procesandoCompra = false;
    }
  }
}