import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AdminComponent } from './admin.component';
import { FirestoreCrudService } from '../../services/firestore-crud.service';
import { Firestore } from '@angular/fire/firestore';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let crudSpy: jasmine.SpyObj<FirestoreCrudService<any>>;

  beforeEach(async () => {
    // Doble falso del servicio: no llama a Firebase de verdad,
    // solo registra que se le llamó y con qué datos.
    crudSpy = jasmine.createSpyObj('FirestoreCrudService', ['obtenerTodos', 'guardar', 'eliminar']);
    crudSpy.obtenerTodos.and.returnValue(of([]));
    crudSpy.guardar.and.returnValue(Promise.resolve());
    crudSpy.eliminar.and.returnValue(Promise.resolve());

    await TestBed.configureTestingModule({
      declarations: [AdminComponent],
      providers: [
        { provide: FirestoreCrudService, useValue: crudSpy },
        { provide: Firestore, useValue: {} } // solo usado por la migración, no se prueba aquí
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  // =========================
  // PRODUCTOS
  // =========================

  describe('guardarProducto', () => {
    it('rechaza guardar si falta el nombre', async () => {
      component.producto = { nombre: '', precio: 100, img: 'x.png', codigo: 'abc', categoria: 'camisetas' };
      await component.guardarProducto();

      expect(crudSpy.guardar).not.toHaveBeenCalled();
      expect(component.mensaje).toBe('Faltan datos obligatorios');
    });

    it('rechaza guardar si falta la imagen', async () => {
      component.producto = { nombre: 'Poster Zoro', precio: 100, img: '', codigo: 'abc', categoria: 'posters' };
      await component.guardarProducto();

      expect(crudSpy.guardar).not.toHaveBeenCalled();
      expect(component.mensaje).toBe('Sube una imagen antes de guardar');
    });

    it('guarda un producto nuevo cuando los datos son válidos', async () => {
      const productoEsperado = { nombre: 'Poster Zoro', precio: 20000, img: 'assets/img/zoro1.png', codigo: 'prod-post-zoro', categoria: 'posters' as const };
      component.producto = { ...productoEsperado };
      component.productoEditandoId = null;

      await component.guardarProducto();

      expect(crudSpy.guardar).toHaveBeenCalledWith('productos', productoEsperado, null);
      expect(component.mensaje).toContain('guardado con éxito');
    });

    it('actualiza un producto existente cuando hay un id en edición', async () => {
      const productoEsperado = { nombre: 'Poster Zoro', precio: 20000, img: 'assets/img/zoro1.png', codigo: 'prod-post-zoro', categoria: 'posters' as const };
      component.producto = { ...productoEsperado };
      component.productoEditandoId = 'id-existente-123';

      await component.guardarProducto();

      expect(crudSpy.guardar).toHaveBeenCalledWith('productos', productoEsperado, 'id-existente-123');
      expect(component.mensaje).toContain('actualizado');
    });

    it('muestra un mensaje de error genérico si el guardado falla (sin exponer el error crudo)', async () => {
      crudSpy.guardar.and.returnValue(Promise.reject(new Error('Firestore desconectado')));
      component.producto = { nombre: 'Poster Zoro', precio: 20000, img: 'assets/img/zoro1.png', codigo: 'prod-post-zoro', categoria: 'posters' };

      await component.guardarProducto();

      expect(component.mensaje).toBe('No se pudo guardar el producto. Intenta de nuevo.');
      expect(component.mensaje).not.toContain('Firestore desconectado');
    });

    it('resetea el formulario después de guardar con éxito', async () => {
      component.producto = { nombre: 'Poster Zoro', precio: 20000, img: 'assets/img/zoro1.png', codigo: 'prod-post-zoro', categoria: 'posters' };

      await component.guardarProducto();

      expect(component.producto.nombre).toBe('');
      expect(component.productoEditandoId).toBeNull();
    });
  });

  describe('editarProducto', () => {
    it('carga los datos del producto en el formulario y guarda su id', () => {
      const productoExistente = { id: 'abc123', nombre: 'Camiseta Tigre', precio: 50000, img: 'x.png', codigo: 'cam-tigre', categoria: 'camisetas' as const };

      component.editarProducto(productoExistente);

      expect(component.producto.nombre).toBe('Camiseta Tigre');
      expect(component.productoEditandoId).toBe('abc123');
    });
  });

  describe('duplicarProducto', () => {
    it('copia los datos pero limpia el id y agrega "-copia" al código', () => {
      const productoExistente = { id: 'abc123', nombre: 'Camiseta Tigre', precio: 50000, img: 'x.png', codigo: 'cam-tigre', categoria: 'camisetas' as const };

      component.duplicarProducto(productoExistente);

      expect(component.producto.codigo).toBe('cam-tigre-copia');
      expect(component.productoEditandoId).toBeNull();
    });
  });

  describe('eliminarProducto', () => {
    it('elimina el producto si el usuario confirma', async () => {
      spyOn(window, 'confirm').and.returnValue(true);

      await component.eliminarProducto('abc123');

      expect(crudSpy.eliminar).toHaveBeenCalledWith('productos', 'abc123');
    });

    it('NO elimina el producto si el usuario cancela', async () => {
      spyOn(window, 'confirm').and.returnValue(false);

      await component.eliminarProducto('abc123');

      expect(crudSpy.eliminar).not.toHaveBeenCalled();
    });
  });

  describe('cancelarEdicionProducto', () => {
    it('vuelve el formulario a sus valores por defecto', () => {
      component.producto = { nombre: 'Algo', precio: 999, img: 'x.png', codigo: 'x', categoria: 'stickers' };
      component.productoEditandoId = 'algun-id';

      component.cancelarEdicionProducto();

      expect(component.producto).toEqual({ nombre: '', precio: 0, img: '', codigo: '', categoria: 'camisetas' });
      expect(component.productoEditandoId).toBeNull();
    });
  });

  // =========================
  // GALERÍA (mismo patrón, prueba más breve)
  // =========================

  describe('guardarItemGaleria', () => {
    it('rechaza guardar si faltan título o imagen', async () => {
      component.itemGaleria = { titulo: '', img: '', categoria: 'anime', descripcion: '' };
      await component.guardarItemGaleria();

      expect(crudSpy.guardar).not.toHaveBeenCalled();
      expect(component.mensajeGaleria).toContain('Faltan datos');
    });

    it('guarda un item de galería válido', async () => {
      const itemEsperado = { titulo: 'Zoro', img: 'assets/img/zoro1.png', categoria: 'anime' as const, descripcion: 'Espadachín' };
      component.itemGaleria = { ...itemEsperado };

      await component.guardarItemGaleria();

      expect(crudSpy.guardar).toHaveBeenCalledWith('galeria', itemEsperado, null);
    });
  });

  // =========================
  // OFERTAS (mismo patrón, prueba más breve)
  // =========================

  describe('guardarOferta', () => {
    it('rechaza guardar si faltan nombre o imagen', async () => {
      component.oferta = { nombre: '', img: '', precioAntes: 0, precioAhora: 0 };
      await component.guardarOferta();

      expect(crudSpy.guardar).not.toHaveBeenCalled();
      expect(component.mensajeOferta).toContain('Faltan datos');
    });

    it('guarda una oferta válida', async () => {
      const ofertaEsperada = { nombre: 'Pack Zoro', img: 'assets/img/zoro1.png', precioAntes: 40000, precioAhora: 25000 };
      component.oferta = { ...ofertaEsperada };

      await component.guardarOferta();

      expect(crudSpy.guardar).toHaveBeenCalledWith('ofertas', ofertaEsperada, null);
    });
  });
});