import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from '../../services/translation.service'; // <--- Importante
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  esRegistro: boolean = false;
  mensajeError: string = '';
  textos: any = {}; // <--- Variable para textos

  // Pantalla de "revisa tu correo" tras registrarse
  registroExitoso: boolean = false;
  correoRegistrado: string = '';
  reenviando: boolean = false;
  mensajeReenvio: string = '';

  // Íconos disponibles para elegir en el registro (Font Awesome, ya cargado en el proyecto)
  iconosDisponibles: string[] = ['fa-dragon', 'fa-fire', 'fa-skull', 'fa-ghost', 'fa-crow', 'fa-spider', 'fa-cat', 'fa-hat-wizard'];

  datos = {
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    avatar: 'fa-dragon'
  };

  seleccionarIcono(icono: string) {
    this.datos.avatar = icono;
  }

  constructor(
    private router: Router,
    private translationService: TranslationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Suscripción al idioma
    this.translationService.idioma$.subscribe(idioma => {
      this.textos = this.translationService.obtenerTextos(idioma);
    });
  }

  toggleModo() {
    this.esRegistro = !this.esRegistro;
    this.mensajeError = '';
  }

  onSubmit() {
    if (this.esRegistro) {
      this.registrar();
    } else {
      this.entrar();
    }
  }

  async registrar() {
    if (!this.datos.email || !this.datos.password || !this.datos.nombre) {
      this.mostrarError('Todos los campos son obligatorios');
      return;
    }
    try {
      await this.authService.register(this.datos.email, this.datos.password, this.datos.nombre, this.datos.avatar);
      // En vez de alert(), mostramos la pantalla de "revisa tu correo"
      this.correoRegistrado = this.datos.email;
      this.registroExitoso = true;
    } catch (error: any) {
      this.mostrarError(this.traducirError(error.code));
    }
  }

  async reenviarCorreo() {
    this.reenviando = true;
    try {
      await this.authService.reenviarVerificacion();
      this.mensajeReenvio = 'Correo reenviado correctamente.';
    } catch {
      this.mensajeReenvio = 'No se pudo reenviar, intenta de nuevo en un momento.';
    }
    this.reenviando = false;
    setTimeout(() => this.mensajeReenvio = '', 4000);
  }

  volverALogin() {
    this.registroExitoso = false;
    this.esRegistro = false;
  }

   async entrar() {
    try {
      const credenciales = await this.authService.login(this.datos.email, this.datos.password);

      if (!credenciales.user.emailVerified) {
        // Cuenta válida pero sin verificar: reenviamos el link y mostramos la pantalla de espera
        await this.authService.reenviarVerificacion();
        this.correoRegistrado = this.datos.email;
        this.registroExitoso = true;
        return;
      }

      this.router.navigate(['/']).then(() => {
        window.location.reload();
      });
    } catch (error: any) {
      this.mostrarError(this.traducirError(error.code));
    }
  }

  traducirError(code: string): string {
    switch (code) {
      case 'auth/invalid-email':
        return 'Correo inválido';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Correo o contraseña incorrectos';
      case 'auth/email-already-in-use':
        return 'El correo ya está registrado';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres';
      default:
        return 'Ocurrió un error, intenta de nuevo';
    }
  }

  mostrarError(msg: string) {
    this.mensajeError = msg;
    setTimeout(() => this.mensajeError = '', 3000);
  }
}