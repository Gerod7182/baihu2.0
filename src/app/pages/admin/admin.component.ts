import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

import { FirestoreCrudService } from '../../services/firestore-crud.service';
import { Producto } from '../../models/producto.model';
import { ItemGaleria } from '../../models/galeria-item.model';
import { Oferta } from '../../models/oferta.model';

type ConId<T> = T & { id: string };

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  // =========================
  // 🛍️ PRODUCTOS
  // =========================
  producto: Producto = { nombre: '', precio: 0, img: '', codigo: '', categoria: 'camisetas' };
  mensaje = '';
  productos$!: Observable<ConId<Producto>[]>;
  productoEditandoId: string | null = null;

  // =========================
  // 🖼️ GALERÍA
  // =========================
  itemGaleria: ItemGaleria = { img: '', categoria: 'espiritual', titulo: '', descripcion: '' };
  mensajeGaleria = '';
  galeria$!: Observable<ConId<ItemGaleria>[]>;
  itemGaleriaEditandoId: string | null = null;

  // =========================
  // 🔥 OFERTAS
  // =========================
  oferta: Oferta = { nombre: '', img: '', precioAntes: 0, precioAhora: 0 };
  mensajeOferta = '';
  ofertas$!: Observable<ConId<Oferta>[]>;
  ofertaEditandoId: string | null = null;

  constructor(
    private crud: FirestoreCrudService<any>,
    private firestore: Firestore // se mantiene solo para la migración puntual de abajo
  ) {}

  ngOnInit(): void {
    this.productos$ = this.crud.obtenerTodos('productos');
    this.galeria$ = this.crud.obtenerTodos('galeria');
    this.ofertas$ = this.crud.obtenerTodos('ofertas');
  }

  // =========================
  // 🛍️ CRUD Productos
  // =========================

  async guardarProducto() {
    if (!this.producto.nombre || !this.producto.codigo) {
      this.mensaje = 'Faltan datos obligatorios';
      return;
    }
    if (!this.producto.img) {
      this.mensaje = 'Sube una imagen antes de guardar';
      return;
    }
    try {
      await this.crud.guardar('productos', this.producto, this.productoEditandoId);
      this.mensaje = this.productoEditandoId
        ? '¡Producto actualizado! ✏️'
        : '¡Producto guardado con éxito en la Nube! ☁️';
      this.cancelarEdicionProducto();
    } catch (error) {
      console.error('Error guardando producto:', error);
      this.mensaje = 'No se pudo guardar el producto. Intenta de nuevo.';
    }
  }

  editarProducto(p: ConId<Producto>) {
    this.producto = { nombre: p.nombre, precio: p.precio, img: p.img, codigo: p.codigo, categoria: p.categoria };
    this.productoEditandoId = p.id;
    this.mensaje = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  duplicarProducto(p: ConId<Producto>) {
    this.producto = { nombre: p.nombre, precio: p.precio, img: p.img, codigo: p.codigo + '-copia', categoria: p.categoria };
    this.productoEditandoId = null;
    this.mensaje = 'Cambia la categoría/código y guarda para crear la copia.';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async eliminarProducto(id: string) {
    if (!confirm('¿Seguro que quieres eliminar este producto? No se puede deshacer.')) return;
    try {
      await this.crud.eliminar('productos', id);
      this.mensaje = 'Producto eliminado.';
    } catch (error) {
      console.error('Error eliminando producto:', error);
      this.mensaje = 'No se pudo eliminar el producto.';
    }
  }

  cancelarEdicionProducto() {
    this.producto = { nombre: '', precio: 0, img: '', codigo: '', categoria: 'camisetas' };
    this.productoEditandoId = null;
  }

  // =========================
  // 🖼️ CRUD Galería
  // =========================

  async guardarItemGaleria() {
    if (!this.itemGaleria.titulo || !this.itemGaleria.img) {
      this.mensajeGaleria = 'Faltan datos obligatorios (título e imagen)';
      return;
    }
    try {
      await this.crud.guardar('galeria', this.itemGaleria, this.itemGaleriaEditandoId);
      this.mensajeGaleria = this.itemGaleriaEditandoId
        ? '¡Imagen de galería actualizada! ✏️'
        : '¡Imagen agregada a la galería! 🖼️';
      this.cancelarEdicionGaleria();
    } catch (error) {
      console.error('Error guardando item de galería:', error);
      this.mensajeGaleria = 'No se pudo guardar la imagen.';
    }
  }

  editarItemGaleria(item: ConId<ItemGaleria>) {
    this.itemGaleria = { img: item.img, categoria: item.categoria, titulo: item.titulo, descripcion: item.descripcion };
    this.itemGaleriaEditandoId = item.id;
    this.mensajeGaleria = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async eliminarItemGaleria(id: string) {
    if (!confirm('¿Seguro que quieres quitar esta imagen de la galería?')) return;
    try {
      await this.crud.eliminar('galeria', id);
      this.mensajeGaleria = 'Imagen eliminada de la galería.';
    } catch (error) {
      console.error('Error eliminando item de galería:', error);
      this.mensajeGaleria = 'No se pudo eliminar la imagen.';
    }
  }

  cancelarEdicionGaleria() {
    this.itemGaleria = { img: '', categoria: 'espiritual', titulo: '', descripcion: '' };
    this.itemGaleriaEditandoId = null;
  }

  // =========================
  // 🔥 CRUD Ofertas
  // =========================

  async guardarOferta() {
    if (!this.oferta.nombre || !this.oferta.img) {
      this.mensajeOferta = 'Faltan datos obligatorios (nombre e imagen)';
      return;
    }
    try {
      await this.crud.guardar('ofertas', this.oferta, this.ofertaEditandoId);
      this.mensajeOferta = this.ofertaEditandoId
        ? '¡Oferta actualizada! ✏️'
        : '¡Oferta publicada! 🔥';
      this.cancelarEdicionOferta();
    } catch (error) {
      console.error('Error guardando oferta:', error);
      this.mensajeOferta = 'No se pudo guardar la oferta.';
    }
  }

  editarOferta(o: ConId<Oferta>) {
    this.oferta = { nombre: o.nombre, img: o.img, precioAntes: o.precioAntes, precioAhora: o.precioAhora };
    this.ofertaEditandoId = o.id;
    this.mensajeOferta = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async eliminarOferta(id: string) {
    if (!confirm('¿Seguro que quieres quitar esta oferta?')) return;
    try {
      await this.crud.eliminar('ofertas', id);
      this.mensajeOferta = 'Oferta eliminada.';
    } catch (error) {
      console.error('Error eliminando oferta:', error);
      this.mensajeOferta = 'No se pudo eliminar la oferta.';
    }
  }

  cancelarEdicionOferta() {
    this.oferta = { nombre: '', img: '', precioAntes: 0, precioAhora: 0 };
    this.ofertaEditandoId = null;
  }

  // =========================
  // 🚚 MIGRACIÓN (una sola vez — borrar este bloque completo
  // una vez confirmes que ya no la necesitas correr de nuevo)
  // =========================

  migrando = false;
  mensajeMigracion = '';

  private productosOriginales: Producto[] = [
    { nombre: 'Camiseta VI Brawler', img: 'assets/img/1.jpg', precio: 50000, codigo: 'prod-cam-vi', categoria: 'camisetas' },
    { nombre: 'Camiseta Tigre Blanco', img: 'assets/img/2.jpg', precio: 50000, codigo: 'prod-cam-tigre', categoria: 'camisetas' },
    { nombre: 'Camiseta Dragón Azul', img: 'assets/img/3.jpg', precio: 50000, codigo: 'prod-cam-dragon', categoria: 'camisetas' },
    { nombre: 'Camiseta Cobra Amarilla', img: 'assets/img/4.jpg', precio: 50000, codigo: 'prod-cam-cobra', categoria: 'camisetas' },
    { nombre: 'Camiseta Yugioh', img: 'assets/img/5.png', precio: 50000, codigo: 'prod-cam-yugioh', categoria: 'camisetas' },
    { nombre: 'Sticker Fénix de Fuego', img: 'assets/img/stickerfenix.png', precio: 5000, codigo: 'prod-stick-fenix', categoria: 'stickers' },
    { nombre: 'Sticker Dragón del Trueno', img: 'assets/img/dragon sticker-01.png', precio: 5000, codigo: 'prod-stick-thunder', categoria: 'stickers' },
    { nombre: 'Sticker Tigre de Hierro', img: 'assets/img/sticker tigre.png', precio: 5000, codigo: 'prod-stick-iron', categoria: 'stickers' },
    { nombre: 'Sticker Cobra de Piedra', img: 'assets/img/sticker cobra.png', precio: 5000, codigo: 'prod-stick-stone', categoria: 'stickers' },
    { nombre: 'Póster E.Hero Burstinatrix', img: 'assets/img/burstinatrix.png', precio: 20000, codigo: 'prod-post-burst', categoria: 'posters' },
    { nombre: 'Póster VI Brawler', img: 'assets/img/VI.png', precio: 20000, codigo: 'prod-post-vi', categoria: 'posters' },
    { nombre: 'Póster Darth Vader', img: 'assets/img/vader.png', precio: 20000, codigo: 'prod-post-vader', categoria: 'posters' },
    { nombre: 'Póster Halloween', img: 'assets/img/Myers.png', precio: 20000, codigo: 'prod-post-hallo', categoria: 'posters' },
    { nombre: 'Póster Cobra Amarilla', img: 'assets/img/HEBI.png', precio: 20000, codigo: 'prod-post-cobra', categoria: 'posters' },
    { nombre: 'Póster Tigre Blanco', img: 'assets/img/BAIHU.png', precio: 20000, codigo: 'prod-post-tigre', categoria: 'posters' },
    { nombre: 'Póster Dragón Azul', img: 'assets/img/dragonsword.png', precio: 20000, codigo: 'prod-post-dragon', categoria: 'posters' },
    { nombre: 'Póster Fénix Rojo', img: 'assets/img/fenghua.png', precio: 20000, codigo: 'prod-post-fenix', categoria: 'posters' }
  ];

  private galeriaOriginal: ItemGaleria[] = [
    { titulo: 'Tigre Blanco (Bái Hǔ)', descripcion: 'Como una de las Cuatro Bestias Sagradas, personifica la fuerza, el coraje y la justicia.', img: 'assets/img/BAIHU.png', categoria: 'espiritual' },
    { titulo: 'Serpiente Amarilla', descripcion: 'En la posición central del Feng Shui, encarna la estabilidad y el equilibrio del elemento tierra.', img: 'assets/img/HEBI.png', categoria: 'espiritual' },
    { titulo: 'Fénix Vermellón', descripcion: 'Irradia calor, luz y renovación como bestia sagrada del sur.', img: 'assets/img/fenghua.png', categoria: 'espiritual' },
    { titulo: 'Burstinatrix', descripcion: 'Guerrera forjada en llamas, encarna la audacia y el poder del fuego.', img: 'assets/img/burstinatrix.png', categoria: 'anime' },
    { titulo: 'Halloween', descripcion: 'Michael Myers alza su emblemático cuchillo al filo de la oscuridad otoñal.', img: 'assets/img/Myers.png', categoria: 'pop' },
    { titulo: 'Darth Vader', descripcion: 'Vader emerge sobre un paisaje volcánico, con lava brotando a sus pies.', img: 'assets/img/vader.png', categoria: 'pop' },
    { titulo: 'VI Brawler', descripcion: 'Vi irrumpe en escena con sus icónicos guanteletes hextech.', img: 'assets/img/VI.png', categoria: 'pop' },
    { titulo: 'Dragón del Rayo', descripcion: 'El Dragón del Rayo despliega su cuerpo serpentino entre nubes eléctricas.', img: 'assets/img/dragonsword.png', categoria: 'espiritual' },
    { titulo: 'Roronoa Zoro', descripcion: 'Tripulante y espadachín de los Mugiwara.', img: 'assets/img/zoro.png', categoria: 'anime' },
    { titulo: 'Sanji Vinsmoke', descripcion: 'Tripulante y chef de los Mugiwara.', img: 'assets/img/sanji.png', categoria: 'anime' },
    { titulo: 'Jason Voorhees', descripcion: 'El infame asesino de Crystal Lake.', img: 'assets/img/jason.png', categoria: 'pop' },
    { titulo: 'Cheetara', descripcion: 'Heroína de los Thundercats con velocidad sobrenatural.', img: 'assets/img/cheetara.png', categoria: 'pop' }
  ];

  private ofertasOriginales: Oferta[] = [
    { nombre: 'Pack: Camiseta + Sticker', img: 'assets/img/helmet.png', precioAntes: 40000, precioAhora: 25000 },
    { nombre: 'Pack: Poster + Pack de Stickers', img: 'assets/img/armor.png', precioAntes: 50000, precioAhora: 45000 },
    { nombre: 'Pack: Hoodie + Poster + Sticker', img: 'assets/img/cofre.png', precioAntes: 145000, precioAhora: 115000 }
  ];

  async migrarDisenosOriginales() {
    const confirmar = confirm(
      'Esto va a copiar tus ' + this.productosOriginales.length + ' productos, ' +
      this.galeriaOriginal.length + ' imágenes de galería y ' + this.ofertasOriginales.length +
      ' ofertas originales a la base de datos, para que puedas editarlas/eliminarlas desde aquí.\n\n' +
      '⚠️ Solo dale click UNA VEZ — si lo corres dos veces, se duplican. ¿Continuar?'
    );
    if (!confirmar) return;

    this.migrando = true;
    this.mensajeMigracion = 'Migrando, no cierres esta pantalla...';

    try {
      const productosRef = collection(this.firestore, 'productos');
      for (const p of this.productosOriginales) {
        await addDoc(productosRef, p);
      }

      const galeriaRef = collection(this.firestore, 'galeria');
      for (const g of this.galeriaOriginal) {
        await addDoc(galeriaRef, g);
      }

      const ofertasRef = collection(this.firestore, 'ofertas');
      for (const o of this.ofertasOriginales) {
        await addDoc(ofertasRef, o);
      }

      this.mensajeMigracion = '¡Listo! Se migraron todos los diseños originales. Ya puedes editarlos/eliminarlos abajo.';
    } catch (error) {
      console.error('Error durante la migración:', error);
      this.mensajeMigracion = 'Hubo un error durante la migración. Revisa la consola para más detalles.';
    }

    this.migrando = false;
  }
}
