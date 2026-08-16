import { Component, OnInit } from '@angular/core';
import { TranslationService } from './services/translation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  toastVisible = false;
  toastMensaje = '';

  textos: any = {};

  constructor(private translationService: TranslationService) {}

  ngOnInit() {

    // 🔥 escuchar idioma
    this.translationService.idioma$.subscribe(idioma => {
      this.textos = this.translationService.obtenerTextos(idioma);
    });

    // 🔥 escuchar carrito
    window.addEventListener('cartUpdated', (e: any) => {

      const codigo = e.detail;
      const nombre = this.textos[codigo] || codigo;

      this.mostrarToast(`🔥 ${nombre} agregado al carrito`);
    });
  }

  mostrarToast(mensaje: string) {
    this.toastMensaje = mensaje;
    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
    }, 2000);
  }
}
