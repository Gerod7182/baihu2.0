import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

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

  // --- DATOS ESTRUCTURADOS DE LA GALERÍA ---
  // Agregar una imagen nueva es tan fácil como agregar una línea aquí.
  itemsGaleria = [
    { 
      img: 'assets/img/BAIHU.png', 
      categoria: 'espiritual', 
      tituloKey: 'tit-baihu', 
      descKey: 'desc-baihu' 
    },
    { 
      img: 'assets/img/HEBI.png', 
      categoria: 'espiritual', 
      tituloKey: 'tit-hebi', 
      descKey: 'desc-hebi' 
    },
    { 
      img: 'assets/img/fenghua.png', 
      categoria: 'espiritual', 
      tituloKey: 'tit-fenix', 
      descKey: 'desc-fenix' 
    },
    { 
      img: 'assets/img/burstinatrix.png', 
      categoria: 'anime', 
      tituloKey: 'tit-burst', 
      descKey: 'desc-burst' 
    },
    { 
      img: 'assets/img/Myers.png', 
      categoria: 'pop', 
      tituloKey: 'tit-hallo', 
      descKey: 'desc-hallo' 
    },
    { 
      img: 'assets/img/vader.png', 
      categoria: 'pop', 
      tituloKey: 'tit-vader', 
      descKey: 'desc-vader' 
    },
    { 
      img: 'assets/img/VI.png', 
      categoria: 'pop', 
      tituloKey: 'tit-vi', 
      descKey: 'desc-vi' 
    },
    { 
      img: 'assets/img/dragonsword.png', 
      categoria: 'espiritual', 
      tituloKey: 'tit-dragon', 
      descKey: 'desc-dragon' 
    },
    { 
      img: 'assets/img/zoro.png', 
      categoria: 'anime', 
      tituloKey: 'tit-zoro', 
      descKey: 'desc-zoro' 
    },
    { 
      img: 'assets/img/sanji.png', 
      categoria: 'anime', 
      tituloKey: 'tit-sanji', 
      descKey: 'desc-sanji' 
    },
    { 
      img: 'assets/img/jason.png', 
      categoria: 'pop', 
      tituloKey: 'tit-jason', 
      descKey: 'desc-jason' 
    },
    { 
      img: 'assets/img/cheetara.png', 
      categoria: 'pop', 
      tituloKey: 'tit-cheetara', 
      descKey: 'desc-cheetara' 
    }
  ];

  constructor(private translationService: TranslationService) { }

ngOnInit(): void {
  this.translationService.idioma$.subscribe(idioma => {
    this.textos = this.translationService.obtenerTextos(idioma);
  });
}
  filtrar(categoria: string) {
    this.filtroActivo = categoria;
  }

  // Esta función decide si mostrar el item en el bucle
  mostrarItem(categoriaItem: string): boolean {
    return this.filtroActivo === 'todos' || this.filtroActivo === categoriaItem;
  }

  abrirModal(img: string, titulo: string, desc: string) {
    this.imagenSeleccionada = img;
    this.tituloSeleccionado = titulo;
    this.descSeleccionada = desc;
    this.modalAbierto = true;
    document.body.style.overflow = 'hidden';
  }

  cerrarModal() {
    this.modalAbierto = false;
    document.body.style.overflow = '';
  }
}