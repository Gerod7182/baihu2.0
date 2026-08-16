import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { CartService } from '../../services/cart.service';
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

  camisetas = [
    { id: 'prod-cam-vi', img: 'assets/img/1.jpg', precio: 50000 },
    { id: 'prod-cam-tigre', img: 'assets/img/2.jpg', precio: 50000 },
    { id: 'prod-cam-dragon', img: 'assets/img/3.jpg', precio: 50000 },
    { id: 'prod-cam-cobra', img: 'assets/img/4.jpg', precio: 50000 },
    { id: 'prod-cam-yugioh', img: 'assets/img/5.png', precio: 50000 }
  ];

  stickers = [
    { id: 'prod-stick-fenix', img: 'assets/img/stickerfenix.png', precio: 5000 },
    { id: 'prod-stick-thunder', img: 'assets/img/dragon sticker-01.png', precio: 5000 },
    { id: 'prod-stick-iron', img: 'assets/img/sticker tigre.png', precio: 5000 },
    { id: 'prod-stick-stone', img: 'assets/img/sticker cobra.png', precio: 5000 }
  ];

  posters = [
    { id: 'prod-post-burst', img: 'assets/img/burstinatrix.png', precio: 20000 },
    { id: 'prod-post-vi', img: 'assets/img/VI.png', precio: 20000 },
    { id: 'prod-post-vader', img: 'assets/img/vader.png', precio: 20000 },
    { id: 'prod-post-hallo', img: 'assets/img/Myers.png', precio: 20000 },
    { id: 'prod-post-cobra', img: 'assets/img/HEBI.png', precio: 20000 },
    { id: 'prod-post-tigre', img: 'assets/img/BAIHU.png', precio: 20000 },
    { id: 'prod-post-dragon', img: 'assets/img/dragonsword.png', precio: 20000 },
    { id: 'prod-post-fenix', img: 'assets/img/fenghua.png', precio: 20000 }
  ];

  constructor(
    private translationService: TranslationService,
    private cartService: CartService
  ) {}

 ngOnInit(): void {

  this.translationService.idioma$.subscribe(idioma => {
    this.textos = this.translationService.obtenerTextos(idioma);
  });

  window.addEventListener('cartUpdated', () => {
    this.mostrarNotificacion("Producto agregado 🔥");
  });
}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
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