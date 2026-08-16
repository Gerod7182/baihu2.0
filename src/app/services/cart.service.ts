import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  private cartUpdatedSubject = new BehaviorSubject<void>(undefined);
  cartUpdated$ = this.cartUpdatedSubject.asObservable();

  constructor() {
    this.actualizarContador();
  }

  private getCarrito(): Product[] {
    return JSON.parse(localStorage.getItem('carrito') || '[]');
  }

  private setCarrito(carrito: Product[]) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  actualizarContador() {
    const carrito = this.getCarrito();
    const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    this.cartCountSubject.next(total);
  }

  agregarItem(id: string, img: string, precio: number) {
    let carrito = this.getCarrito();

    const existente = carrito.find(item => item.id === id);

    if (existente) {
      existente.cantidad += 1;
    } else {
      carrito.push({ id, img, precio, cantidad: 1 });
    }

    this.setCarrito(carrito);
    this.actualizarContador();
    this.cartUpdatedSubject.next();
  }

  eliminarItem(id: string) {
    const carrito = this.getCarrito().filter(item => item.id !== id);
    this.setCarrito(carrito);
    this.actualizarContador();
    this.cartUpdatedSubject.next();
  }

  vaciarCarrito() {
    this.setCarrito([]);
    this.actualizarContador();
    this.cartUpdatedSubject.next();
  }

  obtenerItems(): Product[] {
    return this.getCarrito();
  }
}