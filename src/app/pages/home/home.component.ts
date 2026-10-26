import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { SearchService } from '../../services/search.service';
import { Product } from '../../models/product.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  textos: any = {};
  notificacionVisible = false;
  notificacionMensaje = '';

  private sub!: Subscription;

  // Estas son las listas que el HTML realmente muestra (ya filtradas).
  camisetas: Product[] = [];
  stickers: Product[] = [];
  posters: Product[] = [];

  // Estas guardan TODO el catálogo sin filtrar, para no perderlo
  // cada vez que alguien escribe o borra algo en el buscador.
  private camisetasCompletas: Product[] = [];
  private stickersCompletos: Product[] = [];
  private postersCompletos: Product[] = [];

  private terminoBusqueda = '';

  constructor(
    private translationService: TranslationService,
    private cartService: CartService,
    private productService: ProductService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {

    this.translationService.idioma$.subscribe(idioma => {
      this.textos = this.translationService.obtenerTextos(idioma);
    });

    window.addEventListener('cartUpdated', () => {
      this.mostrarNotificacion("Producto agregado 🔥");
    });

    // Traer productos agregados desde el panel /admin.
    this.productService.obtenerPorCategoria('camisetas').subscribe(productos => {
      this.camisetasCompletas = [...this.camisetasCompletas, ...productos];
      this.aplicarFiltro();
    });

    this.productService.obtenerPorCategoria('stickers').subscribe(productos => {
      this.stickersCompletos = [...this.stickersCompletos, ...productos];
      this.aplicarFiltro();
    });

    this.productService.obtenerPorCategoria('posters').subscribe(productos => {
      this.postersCompletos = [...this.postersCompletos, ...productos];
      this.aplicarFiltro();
    });

    // Cada vez que el navbar avisa un cambio en el buscador, refiltramos.
    this.sub = this.searchService.terminoBusqueda$.subscribe(termino => {
      this.terminoBusqueda = termino;
      this.aplicarFiltro();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private aplicarFiltro() {
    if (!this.terminoBusqueda) {
      this.camisetas = this.camisetasCompletas;
      this.stickers = this.stickersCompletos;
      this.posters = this.postersCompletos;
      return;
    }

    const coincide = (p: Product) =>
      (p.nombre ?? '').toLowerCase().includes(this.terminoBusqueda);

    this.camisetas = this.camisetasCompletas.filter(coincide);
    this.stickers = this.stickersCompletos.filter(coincide);
    this.posters = this.postersCompletos.filter(coincide);
  }

  get sinResultados(): boolean {
    return this.terminoBusqueda !== ''
      && this.camisetas.length === 0
      && this.stickers.length === 0
      && this.posters.length === 0;
  }

  agregarAlCarrito(id: string, img: string, precio: number, nombre: string) {
    this.cartService.agregarItem(id, img, precio, nombre);

    const accion = this.textos['noti-agregado'] || 'agregado al carrito';

    this.mostrarNotificacion(`"${nombre}" ${accion}`);
  }

  mostrarNotificacion(msg: string) {
    this.notificacionMensaje = msg;
    this.notificacionVisible = true;

    setTimeout(() => {
      this.notificacionVisible = false;
    }, 2000);
  }
}