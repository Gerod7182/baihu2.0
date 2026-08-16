import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  cartCount = 0;
  textos: any = {};
  nombreUsuario = '';
  mostrarLogout = false;

  idioma: string = 'es';

  // 🔥 NUEVO: control del menú de idioma
  menuAbierto = false;

  constructor(
    private translationService: TranslationService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {

    // 🔥 idioma reactivo
    this.translationService.idioma$.subscribe(idioma => {
      this.idioma = idioma;
      this.textos = this.translationService.obtenerTextos(idioma);
    });

    // 🔥 carrito en tiempo real
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });

    // 🔥 usuario
    this.cargarUsuario();
  }

  // =========================
  // 🌐 IDIOMA (NUEVO SISTEMA)
  // =========================

  toggleLangMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  seleccionarIdioma(id: string): void {
    this.translationService.cambiarIdioma(id);
    this.menuAbierto = false;
  }

  // =========================
  // 👤 USUARIO
  // =========================

  cargarUsuario(): void {
    const usuarioGuardado = localStorage.getItem('usuario');

    if (!usuarioGuardado) {
      this.nombreUsuario = '';
      this.mostrarLogout = false;
      return;
    }

    try {
      const usuario = JSON.parse(usuarioGuardado);
      this.nombreUsuario = usuario?.nombre ?? '';
      this.mostrarLogout = !!this.nombreUsuario;
    } catch {
      this.nombreUsuario = '';
      this.mostrarLogout = false;
    }
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuario');
    window.location.reload();
  }
}