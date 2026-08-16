import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router'; // 🔥 IMPORTANTE

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  carrito: any[] = [];
  total: number = 0;
  textos: any = {};

  constructor(
    private translationService: TranslationService,
    private cartService: CartService,
    private router: Router // 🔥 INYECTAMOS ROUTER
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

  eliminarItem(id: number) {
    this.cartService.eliminarItem(id.toString());
    this.cargarCarrito();
  }

  vaciarCarrito() {
    this.cartService.vaciarCarrito();
    this.carrito = [];
    this.total = 0;
  }

  // 🔥 FINALIZAR COMPRA PRO
  finalizarCompra() {

    if (this.carrito.length === 0) return;

    // Guardamos compra simulada
    localStorage.setItem('ultimaCompra', JSON.stringify({
      items: this.carrito,
      total: this.total,
      fecha: new Date()
    }));

    // Vaciar carrito
    this.cartService.vaciarCarrito();

    // 🔥 NAVEGACIÓN CORRECTA ANGULAR
    this.router.navigate(['/gracias']);
  }
}