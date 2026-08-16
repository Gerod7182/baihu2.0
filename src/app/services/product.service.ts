import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private firestore: Firestore) {}

  /**
   * Trae en tiempo real todos los productos de Firestore que pertenecen
   * a una categoría dada (camisetas, stickers, posters, etc.).
   * Como usa collectionData, si agregas un producto desde /admin,
   * aparece solo en la página sin recargar.
   */
  obtenerPorCategoria(categoria: string): Observable<Product[]> {
    const productosRef = collection(this.firestore, 'productos');
    const q = query(productosRef, where('categoria', '==', categoria));
    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }
}