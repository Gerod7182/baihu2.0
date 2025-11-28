import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-ofertas',
  templateUrl: './ofertas.component.html',
  styleUrls: ['./ofertas.component.css']
})
export class OfertasComponent implements OnInit {
  
  textos: any = {};
  notificacionVisible = false;
  notificacionMensaje = '';

  // --- DATOS LIMPIOS: Solo cambias esto para agregar ofertas ---
  listaOfertas = [
    { 
      codigo: 'oferta1-nombre', 
      img: 'assets/img/camiseta1.jpg', 
      precioAntes: 40000, 
      precioAhora: 25000 
    },
    { 
      codigo: 'oferta2-nombre', 
      img: 'assets/img/phonecase1.jpg', 
      precioAntes: 50000, 
      precioAhora: 45000 
    },
    { 
      codigo: 'oferta3-nombre', 
      img: 'assets/img/hoodie1.jpg', 
      precioAntes: 145000, 
      precioAhora: 115000 
    }
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

  agregarAlCarrito(codigoNombre: string, img: string, precio: number) {
    this.cartService.agregarItem(codigoNombre, img, precio);
    const nombreTraducido = this.textos[codigoNombre] || codigoNombre;
    const accion = this.textos['noti-agregado'] || 'agregado al carrito';
    this.mostrarNotificacion(`"${nombreTraducido}" ${accion}`);
  }

  mostrarNotificacion(mensaje: string) {
    this.notificacionMensaje = mensaje;
    this.notificacionVisible = true;
    setTimeout(() => this.notificacionVisible = false, 3000);
  }
}