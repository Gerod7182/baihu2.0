import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pedido } from '../models/Pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  constructor(private readonly firestore: Firestore) {}

  // POST: crea el pedido en la colección "pedidos"
  crearPedido(pedido: Pedido) {
    return addDoc(collection(this.firestore, 'pedidos'), pedido);
  }

  // Historial del usuario, más reciente primero
  pedidosDeUsuario(usuarioId: string): Observable<Pedido[]> {
    const q = query(
      collection(this.firestore, 'pedidos'),
      where('usuarioId', '==', usuarioId)
    );

    return (collectionData(q, { idField: 'id' }) as Observable<Pedido[]>).pipe(
      map(lista =>
        [...lista].sort((a, b) => b.fecha.localeCompare(a.fecha))
      )
    );
  }

  // No borra: solo marca como cancelado (queda en el historial)
  cancelarPedido(id: string) {
    return updateDoc(doc(this.firestore, 'pedidos', id), { estado: 'cancelado' });
  }

  // Borra de verdad. Solo se ofrece para pedidos ya cancelados
  eliminarPedido(id: string) {
    return deleteDoc(doc(this.firestore, 'pedidos', id));
  }
}