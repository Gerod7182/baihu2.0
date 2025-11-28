import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // Esta es la "antena" que actualiza el número en tiempo real
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor() {
    this.actualizarContador();
  }

  // Cuenta cuántos productos hay en total
  actualizarContador() {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    // Sumamos la cantidad de cada producto
    const totalItems = carrito.reduce((acc: any, item: any) => acc + (item.cantidad || 1), 0);
    this.cartCountSubject.next(totalItems);
  }

  agregarItem(nombreCodigo: string, img: string, precio: number) {
    let carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    
    const existente = carrito.find((item: any) => item.nombre === nombreCodigo);
    
    if (existente) {
      existente.cantidad += 1;
    } else {
      carrito.push({ id: Date.now(), nombre: nombreCodigo, img, precio, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    this.actualizarContador();
  }

  // --- LAS NUEVAS FUNCIONES DE BORRADO ---

  eliminarItem(id: number) {
    let carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    // Usamos .filter() para guardar todos MENOS el que tiene ese ID
    carrito = carrito.filter((item: any) => item.id !== id);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Avisamos al contador que el número bajó
    this.actualizarContador();
  }

  vaciarCarrito() {
    localStorage.setItem('carrito', '[]');
    this.actualizarContador();
  }
}