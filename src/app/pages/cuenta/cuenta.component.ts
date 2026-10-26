import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { PedidoService } from '../../services/pedido.service';
import { Pedido } from '../../models/Pedido.model';

const ADMIN_EMAIL = 'g3rm4n7115@gmail.com';

type FiltroPedido = 'todos' | Pedido['estado'];
type AccionCuenta = { tipo: 'cancelar' | 'eliminar' | 'salir'; id?: string } | null;

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.css']
})
export class CuentaComponent implements OnInit, OnDestroy {

  usuario: any = null;
  pedidos: Pedido[] = [];
  cargando = true;
  errorCarga = '';
  errorAccion = '';

  filtro: FiltroPedido = 'todos';
  accion: AccionCuenta = null;
  procesando = false;

  reenviando = false;
  avisoVerificacion = '';

  readonly opciones: { clave: FiltroPedido; etiqueta: string; icono: string; color: string }[] = [
    { clave: 'todos', etiqueta: 'Todos', icono: 'fa-receipt', color: '#ffffff' },
    { clave: 'pendiente', etiqueta: 'Pendientes', icono: 'fa-clock', color: '#ffd000' },
    { clave: 'entregado', etiqueta: 'Entregados', icono: 'fa-check-circle', color: '#00ff88' },
    { clave: 'cancelado', etiqueta: 'Cancelados', icono: 'fa-times-circle', color: '#888888' }
  ];

  private readonly mensajesVacio: Record<FiltroPedido, string> = {
    todos: 'Aún no has hecho ningún pedido.',
    pendiente: 'No tienes pedidos pendientes.',
    entregado: 'Todavía no tienes pedidos entregados.',
    cancelado: 'No tienes pedidos cancelados.'
  };

  private suscripcion?: Subscription;

  constructor(
    private readonly authService: AuthService,
    private readonly pedidoService: PedidoService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.suscripcion = this.authService.user$.pipe(
      switchMap(usuario => {
        this.usuario = usuario;

        // Sin sesión: no hay cuenta que mostrar, mandamos a login
        if (!usuario) {
          this.cargando = false;
          this.router.navigate(['/login']);
          return of([] as Pedido[]);
        }

        this.cargando = true;
        return this.pedidoService.pedidosDeUsuario(usuario.uid);
      })
    ).subscribe({
      next: pedidos => {
        this.pedidos = pedidos;
        this.cargando = false;
        this.errorCarga = '';
      },
      error: err => {
        console.error('No se pudieron cargar los pedidos:', err);
        this.errorCarga = 'No se pudieron cargar tus pedidos. Intenta de nuevo más tarde.';
        this.cargando = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.suscripcion?.unsubscribe();
  }

  // ---------- Datos del perfil ----------

  get nombre(): string {
    return this.usuario?.displayName || this.usuario?.email?.split('@')[0] || 'Cliente';
  }

  get inicial(): string {
    return this.nombre.trim().charAt(0).toUpperCase() || '?';
  }

  // En el registro guardamos el ícono de Font Awesome en photoURL
  get iconoAvatar(): string {
    const foto: string = this.usuario?.photoURL || '';
    return foto.startsWith('fa-') ? foto : '';
  }

  get esAdmin(): boolean {
    return this.usuario?.email === ADMIN_EMAIL;
  }

  get miembroDesde(): string {
    const creado = this.usuario?.metadata?.creationTime;
    return creado
      ? new Date(creado).toLocaleDateString('es-CO', { month: 'short', year: 'numeric' })
      : '';
  }

  // ---------- Pedidos ----------

  get conteos(): Record<FiltroPedido, number> {
    const base: Record<FiltroPedido, number> = {
      todos: this.pedidos.length,
      pendiente: 0,
      entregado: 0,
      cancelado: 0
    };
    this.pedidos.forEach(p => { base[p.estado] += 1; });
    return base;
  }

  get pedidosFiltrados(): Pedido[] {
    return this.pedidos.filter(p => this.filtro === 'todos' || p.estado === this.filtro);
  }

  get mensajeVacio(): string {
    return this.mensajesVacio[this.filtro];
  }

  cambiarFiltro(nuevo: FiltroPedido): void {
    this.filtro = nuevo;
  }

  trackPedido(_: number, p: Pedido): string | undefined {
    return p.id;
  }

  numero(p: Pedido): string {
    return (p.id ?? '').slice(-6).toUpperCase();
  }

  fecha(p: Pedido): string {
    return new Date(p.fecha).toLocaleDateString('es-CO', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  }

  unidades(p: Pedido): number {
    return p.items.reduce((acc, item) => acc + item.cantidad, 0);
  }

  detalle(p: Pedido): string {
    return p.items.map(item => `${item.cantidad} × ${item.nombre}`).join(' · ');
  }

  precio(valor: number): string {
    return valor.toLocaleString('es-CO');
  }

  // ---------- Acciones con confirmación ----------

  pedirAccion(tipo: 'cancelar' | 'eliminar' | 'salir', id?: string): void {
    this.errorAccion = '';
    this.accion = { tipo, id };
  }

  cerrarAccion(): void {
    if (!this.procesando) {
      this.accion = null;
    }
  }

  get tituloModal(): string {
    switch (this.accion?.tipo) {
      case 'cancelar': return 'Cancelar pedido';
      case 'eliminar': return 'Eliminar del historial';
      default: return 'Cerrar sesión';
    }
  }

  get mensajeModal(): string {
    switch (this.accion?.tipo) {
      case 'cancelar': return 'Esto marcará el pedido como cancelado. ¿Continuar?';
      case 'eliminar': return 'Esto borra el pedido por completo, no se puede deshacer. ¿Continuar?';
      default: return '¿Seguro que quieres salir de tu cuenta?';
    }
  }

  get textoConfirmar(): string {
    switch (this.accion?.tipo) {
      case 'cancelar': return 'Sí, cancelar';
      case 'eliminar': return 'Sí, eliminar';
      default: return 'Sí, salir';
    }
  }

  async confirmarAccion(): Promise<void> {
    if (!this.accion) return;

    const { tipo, id } = this.accion;
    this.procesando = true;
    this.errorAccion = '';

    try {
      if (tipo === 'cancelar' && id) {
        await this.pedidoService.cancelarPedido(id);
      } else if (tipo === 'eliminar' && id) {
        await this.pedidoService.eliminarPedido(id);
      } else if (tipo === 'salir') {
        await this.authService.logout();
        this.router.navigate(['/']);
      }
    } catch (error) {
      console.error('No se pudo completar la acción:', error);
      this.errorAccion = 'No se pudo completar la acción. Intenta de nuevo.';
    } finally {
      this.accion = null;
      this.procesando = false;
    }
  }

  // ---------- Verificación de correo ----------

  async reenviarVerificacion(): Promise<void> {
    this.reenviando = true;
    this.avisoVerificacion = '';
    try {
      await this.authService.reenviarVerificacion();
      this.avisoVerificacion = 'Te enviamos un correo nuevo. Revisa tu bandeja (y el spam).';
    } catch (error) {
      console.error('No se pudo reenviar la verificación:', error);
      this.avisoVerificacion = 'No se pudo enviar el correo. Espera un momento e intenta de nuevo.';
    } finally {
      this.reenviando = false;
    }
  }
}