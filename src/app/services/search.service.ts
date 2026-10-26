import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Servicio "puente" entre el input de busqueda (que vive en el navbar,
// compartido en toda la app) y la pagina que realmente filtra productos
// (home.component). El navbar escribe aqui, home.component escucha.
@Injectable({ providedIn: 'root' })
export class SearchService {

  private terminoBusquedaSubject = new BehaviorSubject<string>('');
  terminoBusqueda$ = this.terminoBusquedaSubject.asObservable();

  actualizarBusqueda(termino: string) {
    this.terminoBusquedaSubject.next(termino.trim().toLowerCase());
  }
}