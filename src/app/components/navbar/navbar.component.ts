import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { SearchService } from '../../services/search.service';

//  mismo correo de admin.guard.ts
const ADMIN_EMAIL = 'g3rm4n7115@gmail.com';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  cartCount = 0;
  textos: any = {};
  nombreUsuario = '';
  correoUsuario = '';
  iconoUsuario = 'fa-user';
  mostrarLogout = false;
  esAdmin = false;
  usuarioLogueado = false;

  idioma: string = 'es';

  menuAbierto = false;
  menuUsuarioAbierto = false;

  constructor(
    private translationService: TranslationService,
    private cartService: CartService,
    private authService: AuthService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {

    this.translationService.idioma$.subscribe(idioma => {
      this.idioma = idioma;
      this.textos = this.translationService.obtenerTextos(idioma);
    });

    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });

    // 🔥 usuario real de Firebase Auth
    this.authService.user$.subscribe(usuario => {
      if (usuario) {
        this.nombreUsuario = usuario.displayName || usuario.email;
        this.correoUsuario = usuario.email;
        this.iconoUsuario = usuario.photoURL || 'fa-user';
        this.mostrarLogout = true;
        this.usuarioLogueado = true;
        this.esAdmin = usuario.email === ADMIN_EMAIL;
      } else {
        this.nombreUsuario = '';
        this.correoUsuario = '';
        this.iconoUsuario = 'fa-user';
        this.mostrarLogout = false;
        this.usuarioLogueado = false;
        this.esAdmin = false;
      }
    });
  }

  toggleLangMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  seleccionarIdioma(id: string): void {
    this.translationService.cambiarIdioma(id);
    this.menuAbierto = false;
  }

  toggleUserMenu(): void {
    this.menuUsuarioAbierto = !this.menuUsuarioAbierto;
  }

  cerrarSesion(): void {
    this.menuUsuarioAbierto = false;
    this.authService.logout().then(() => {
      window.location.reload();
    });
  }

  // 🔍 Cada vez que el usuario escribe en el buscador del navbar,
  // esto avisa a home.component.ts (a través de SearchService)
  // para que filtre el catálogo.
  buscar(termino: string): void {
    this.searchService.actualizarBusqueda(termino);
  }
}