import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { CartService } from '../../services/cart.service';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-ofertas',
  templateUrl: './ofertas.component.html',
  styleUrls: ['./ofertas.component.css']
})
export class OfertasComponent implements OnInit {
  
  textos: any = {};
  notificacionVisible = false;
  notificacionMensaje = '';

  // --- Ahora las ofertas viven 100% en Firestore (ver botón de migración en /admin) ---
  listaOfertas: any[] = [];

  constructor(
    private translationService: TranslationService,
    private cartService: CartService,
    private firestore: Firestore
  ) {}

 ngOnInit(): void {
  this.translationService.idioma$.subscribe(idioma => {
    this.textos = this.translationService.obtenerTextos(idioma);
  });

  // 🔥 Traer ofertas agregadas desde /admin y sumarlas a las fijas
  const ofertasRef = collection(this.firestore, 'ofertas');
  const ofertas$ = collectionData(ofertasRef, { idField: 'id' }) as Observable<any[]>;

  ofertas$.subscribe(items => {
    this.listaOfertas = [...this.listaOfertas, ...items];
  });
}

  obtenerNombre(oferta: any): string {
    return oferta.nombre || this.textos[oferta.codigo] || '';
  }

  agregarAlCarrito(oferta: any) {
    const nombre = this.obtenerNombre(oferta);
    this.cartService.agregarItem(oferta.id || oferta.codigo, oferta.img, oferta.precioAhora);
    const accion = this.textos['noti-agregado'] || 'agregado al carrito';
    this.mostrarNotificacion(`"${nombre}" ${accion}`);
  }

  mostrarNotificacion(mensaje: string) {
    this.notificacionMensaje = mensaje;
    this.notificacionVisible = true;
    setTimeout(() => this.notificacionVisible = false, 3000);
  }
}