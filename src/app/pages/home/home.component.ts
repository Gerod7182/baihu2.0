import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  textos: any = {};
  notificacionVisible = false;
  notificacionMensaje = '';

  // --- 1. DATOS DE PRODUCTOS (Arrays) ---
  
  camisetas = [
    { codigo: 'prod-cam-vi',     img: 'assets/img/1.jpg',   precio: 50000 },
    { codigo: 'prod-cam-tigre',  img: 'assets/img/2.jpg',   precio: 50000 },
    { codigo: 'prod-cam-dragon', img: 'assets/img/3.jpg',   precio: 50000 },
    { codigo: 'prod-cam-cobra',  img: 'assets/img/4.jpg',   precio: 50000 },
    { codigo: 'prod-cam-yugioh', img: 'assets/img/5.png',   precio: 50000 }
  ];

  stickers = [
    { codigo: 'prod-stick-fenix',   img: 'assets/img/stickerfenix.png',      precio: 5000 },
    { codigo: 'prod-stick-thunder', img: 'assets/img/dragon sticker-01.png', precio: 5000 },
    { codigo: 'prod-stick-iron',    img: 'assets/img/sticker tigre.png',     precio: 5000 },
    { codigo: 'prod-stick-stone',   img: 'assets/img/sticker cobra.png',     precio: 5000 }
  ];

  posters = [
    { codigo: 'prod-post-burst',  img: 'assets/img/burstinatrix.png', precio: 20000 },
    { codigo: 'prod-post-vi',     img: 'assets/img/VI.png',           precio: 20000 },
    { codigo: 'prod-post-vader',  img: 'assets/img/vader.png',        precio: 20000 },
    { codigo: 'prod-post-hallo',  img: 'assets/img/Myers.png',        precio: 20000 },
    { codigo: 'prod-post-cobra',  img: 'assets/img/HEBI.png',         precio: 20000 },
    { codigo: 'prod-post-tigre',  img: 'assets/img/BAIHU.png',        precio: 20000 },
    { codigo: 'prod-post-dragon', img: 'assets/img/dragonsword.png',  precio: 20000 },
    { codigo: 'prod-post-fenix',  img: 'assets/img/fenghua.png',      precio: 20000 }
  ];

  constructor(
    private translationService: TranslationService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.translationService.idioma$.subscribe(idioma => {
      this.textos = this.translationService.obtenerTextos(idioma);
    });
  }

  agregarAlCarrito(codigoProducto: string, img: string, precio: number) {
    this.cartService.agregarItem(codigoProducto, img, precio);
    const nombreTraducido = this.textos[codigoProducto] || codigoProducto;
    const accion = this.textos['noti-agregado'] || 'agregado al carrito';
    this.mostrarNotificacion(`"${nombreTraducido}" ${accion}`);
  }

  mostrarNotificacion(mensaje: string) {
    this.notificacionMensaje = mensaje;
    this.notificacionVisible = true;
    setTimeout(() => this.notificacionVisible = false, 3000);
  }
}