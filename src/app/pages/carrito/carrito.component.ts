import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { CartService } from '../../services/cart.service'; // <--- 1. Importar

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
    private cartService: CartService // <--- 2. Inyectar
  ) {}

  ngOnInit(): void {
    this.cargarCarrito();

    this.translationService.idioma$.subscribe(idioma => {
      this.textos = this.translationService.obtenerTextos(idioma);
    });
  }

  cargarCarrito() {
    // Podemos leerlo directo del localStorage para mostrarlo
    this.carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  }

  eliminarItem(id: number) {
    // 3. Usar el servicio para eliminar (esto actualiza la bolita roja)
    this.cartService.eliminarItem(id);
    
    // Recargamos la lista local para que desaparezca de la pantalla
    this.cargarCarrito();
  }

  vaciarCarrito() {
    // 4. Usar el servicio para vaciar
    this.cartService.vaciarCarrito();
    
    // Limpiamos la vista
    this.carrito = [];
    this.total = 0;
  }
}