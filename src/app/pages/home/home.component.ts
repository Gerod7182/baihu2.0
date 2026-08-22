import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  textos: any = {};
  notificacionVisible = false;
  notificacionMensaje = '';

  private sub!: Subscription;

  camisetas: Product[] = [];

  stickers: Product[] = [];

  posters: Product[] = [];

  constructor(
    private translationService: TranslationService,
    private cartService: CartService,
    private productService: ProductService
  ) {}

 ngOnInit(): void {

  this.translationService.idioma$.subscribe(idioma => {
    this.textos = this.translationService.obtenerTextos(idioma);
  });

  window.addEventListener('cartUpdated', () => {
    this.mostrarNotificacion("Producto agregado 🔥");
  });

  // Traer productos agregados desde el panel /admin y sumarlos
  // a los que ya estaban escritos en el código.
  this.productService.obtenerPorCategoria('camisetas').subscribe(productos => {
    this.camisetas = [...this.camisetas, ...productos];
  });

  this.productService.obtenerPorCategoria('stickers').subscribe(productos => {
    this.stickers = [...this.stickers, ...productos];
  });

  this.productService.obtenerPorCategoria('posters').subscribe(productos => {
    this.posters = [...this.posters, ...productos];
  });
}

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

 agregarAlCarrito(id: string, img: string, precio: number) {
  this.cartService.agregarItem(id, img, precio);

    const nombre = this.textos[id] || id;
  const accion = this.textos['noti-agregado'] || 'agregado al carrito';

    this.mostrarNotificacion(`"${nombre}" ${accion}`);
  }

  mostrarNotificacion(msg: string) {
    this.notificacionMensaje = msg;
    this.notificacionVisible = true;

    setTimeout(() => {
      this.notificacionVisible = false;
    }, 2000);
  }
}