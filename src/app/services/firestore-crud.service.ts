import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

/**
 * Servicio genérico de CRUD para Firestore.
 *
 * Antes, admin.component.ts repetía este mismo patrón (leer, guardar,
 * editar, eliminar) tres veces por separado para productos, galería
 * y ofertas. Aquí queda escrito una sola vez y las tres secciones
 * lo reutilizan, pasándole solo el nombre de la colección.
 */
@Injectable({ providedIn: 'root' })
export class FirestoreCrudService<T> {

  constructor(private firestore: Firestore) {}

  obtenerTodos(nombreColeccion: string): Observable<(T & { id: string })[]> {
    const ref = collection(this.firestore, nombreColeccion);
    return collectionData(ref, { idField: 'id' }) as Observable<(T & { id: string })[]>;
  }

  async guardar(nombreColeccion: string, datos: T, idExistente: string | null): Promise<void> {
    if (idExistente) {
      const refDoc = doc(this.firestore, nombreColeccion, idExistente);
      await updateDoc(refDoc, datos as any);
    } else {
      const refColeccion = collection(this.firestore, nombreColeccion);
      await addDoc(refColeccion, datos as any);
    }
  }

  async eliminar(nombreColeccion: string, id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, nombreColeccion, id));
  }
}