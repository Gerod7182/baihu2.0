import { Component } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  producto = {
    nombre: '',
    precio: 0,
    img: '',
    codigo: '',
    categoria: 'camisetas'
  };

  mensaje = '';

  constructor(private firestore: Firestore) {}

  async guardarProducto() {
    // Validación simple
    if(!this.producto.nombre || !this.producto.codigo) {
      this.mensaje = 'Faltan datos obligatorios';
      return;
    }

    try {
      // Referencia a la colección 'productos' en Firebase
      const coleccionRef = collection(this.firestore, 'productos');
      
      // Guardamos el objeto
      await addDoc(coleccionRef, this.producto);
      
      this.mensaje = '¡Producto guardado con éxito en la Nube! ☁️';
      
      // Limpiamos el formulario
      this.producto = { nombre: '', precio: 0, img: '', codigo: '', categoria: 'camisetas' };

    } catch (error) {
      console.error(error);
      this.mensaje = 'Error al guardar: ' + error;
    }
  }
}
