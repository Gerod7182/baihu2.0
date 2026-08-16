import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { GaleriaComponent } from './pages/galeria/galeria.component';
import { OfertasComponent } from './pages/ofertas/ofertas.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminComponent } from './pages/admin/admin.component';
import { GraciasComponent } from './pages/gracias/gracias.component'; // 🔥 FALTABA
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'galeria', component: GaleriaComponent },
  { path: 'ofertas', component: OfertasComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'login', component: LoginComponent },

  { path: 'gracias', component: GraciasComponent }, // 🔥 ESTA ES LA CLAVE

  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }