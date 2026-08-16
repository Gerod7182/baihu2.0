import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, user, updateProfile } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Observable con el usuario actual (o null si no hay sesión iniciada)
  user$: Observable<any>;

  constructor(private auth: Auth) {
    this.user$ = user(this.auth);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async register(email: string, password: string, nombre: string, icono: string) {
    const credenciales = await createUserWithEmailAndPassword(this.auth, email, password);
    // Guardamos el nombre y el ícono elegido en el perfil de Firebase Auth
    await updateProfile(credenciales.user, {
      displayName: nombre,
      photoURL: icono
    });
    return credenciales;
  }

  logout() {
    return signOut(this.auth);
  }
}