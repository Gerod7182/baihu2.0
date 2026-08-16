import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';

// ⚠️ Cambia este correo por el que uses para tu cuenta de administrador.
// Solo este correo va a poder entrar a /admin, aunque otras personas
// se registren en el sitio.
const ADMIN_EMAIL = 'g3rm4n7115@gmail.com';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private auth: Auth, private router: Router) {}

  canActivate() {
    return authState(this.auth).pipe(
      take(1),
      map(usuario => {
        if (usuario && usuario.email === ADMIN_EMAIL) {
          return true;
        }
        this.router.navigate(['/login']);
        return false;
      })
    );
  }
}