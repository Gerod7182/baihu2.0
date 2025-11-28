import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { CartService } from '../../services/cart.service'; // <--- ¡ESTA ERA LA LÍNEA QUE FALTABA!

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  cartCount: number = 0;
  usuario: any = null;
  textos: any = {}; 

  constructor(
    private translationService: TranslationService,
    private cartService: CartService // Ahora sí funcionará porque lo importamos arriba
  ) { }

  ngOnInit(): void {
    // 1. Cargar usuario (si hay alguien logueado)
    this.cargarUsuario();
    
    // 2. Suscribirse a cambios de idioma
    this.translationService.idioma$.subscribe(idioma => {
      this.textos = this.translationService.obtenerTextos(idioma);
    });

    // 3. Suscribirse al contador del carrito
    // (Esto reemplaza tu antigua función 'leerDatosLocales' para el carrito)
    this.cartService.cartCount$.subscribe(numero => {
      this.cartCount = numero;
    });
  }

  cambiarIdioma(evento: any) {
    const nuevoIdioma = evento.target.value;
    this.translationService.cambiarIdioma(nuevoIdioma);
  }

  cargarUsuario() {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuario = JSON.parse(usuarioGuardado);
      
      // Si usas el ID en el HTML para mostrar el nombre:
      const elementoNombre = document.getElementById('nombreUsuarioHeader');
      const btnLogout = document.getElementById('btn-logout');
      
      if (elementoNombre && this.usuario.nombre) {
        elementoNombre.innerText = this.usuario.nombre;
        // Mostrar botón de cerrar sesión si quieres
        if (btnLogout) btnLogout.style.display = 'inline-block';
      }
    }
  }

  cerrarSesion() {
    localStorage.removeItem('usuario');
    window.location.reload();
  }
}