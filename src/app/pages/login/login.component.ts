import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from '../../services/translation.service'; // <--- Importante

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  esRegistro: boolean = false;
  mensajeError: string = '';
  textos: any = {}; // <--- Variable para textos

  datos = {
    nombre: '',
    email: '',
    password: '',
    telefono: ''
  };

  constructor(private router: Router, private translationService: TranslationService) {}

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

  registrar() {
    if (!this.datos.email || !this.datos.password || !this.datos.nombre) {
      this.mostrarError('Todos los campos son obligatorios'); // Podrías traducir esto también
      return;
    }
    let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    if (usuarios.some((u: any) => u.email === this.datos.email)) {
      this.mostrarError('El correo ya está registrado');
      return;
    }
    usuarios.push(this.datos);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    alert('¡Registro exitoso! Ahora inicia sesión.');
    this.toggleModo();
  }

  entrar() {
    let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuarioEncontrado = usuarios.find((u: any) => 
      u.email === this.datos.email && u.password === this.datos.password
    );

    if (usuarioEncontrado) {
      localStorage.setItem('usuario', JSON.stringify(usuarioEncontrado));
      this.router.navigate(['/']).then(() => {
        window.location.reload();
      });
    } else {
      this.mostrarError('Correo o contraseña incorrectos');
    }
  }

  mostrarError(msg: string) {
    this.mensajeError = msg;
    setTimeout(() => this.mensajeError = '', 3000);
  }
}