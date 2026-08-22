import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.css']
})
export class GaleriaComponent implements OnInit {
  
  textos: any = {};
  filtroActivo: string = 'todos';

  // Variables del Modal
  modalAbierto: boolean = false;
  imagenSeleccionada: string = '';
  tituloSeleccionado: string = '';
  descSeleccionada: string = '';

  // --- Ahora la galería vive 100% en Firestore (ver botón de migración en /admin) ---
  itemsGaleria: any[] = [];

  constructor(
    private translationService: TranslationService,
    private firestore: Firestore
  ) { }

  ngOnInit(): void {
    this.translationService.idioma$.subscribe(idioma => {
      this.textos = this.translationService.obtenerTextos(idioma);
    });

    // 🔥 Traer imágenes agregadas desde /admin y sumarlas a las fijas
    const galeriaRef = collection(this.firestore, 'galeria');
    const galeria$ = collectionData(galeriaRef, { idField: 'id' }) as Observable<any[]>;

    galeria$.subscribe(items => {
      this.itemsGaleria = [...this.itemsGaleria, ...items];
    });
  }

  filtrar(categoria: string) {
    this.filtroActivo = categoria;
  }

  mostrarItem(categoriaItem: string): boolean {
    return this.filtroActivo === 'todos' || this.filtroActivo === categoriaItem;
  }

  // Ahora acepta tanto los textos traducidos (tituloKey) como los directos (titulo) de Firestore
  obtenerTitulo(item: any): string {
    return item.titulo || this.textos[item.tituloKey] || '';
  }

  obtenerDescripcion(item: any): string {
    return item.descripcion || this.textos[item.descKey] || '';
  }

  abrirModal(item: any) {
    this.imagenSeleccionada = item.img;
    this.tituloSeleccionado = this.obtenerTitulo(item);
    this.descSeleccionada = this.obtenerDescripcion(item);
    this.modalAbierto = true;
    document.body.style.overflow = 'hidden';
  }

  cerrarModal() {
    this.modalAbierto = false;
    document.body.style.overflow = '';
  }
}