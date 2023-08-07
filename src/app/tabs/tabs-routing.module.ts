import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'inicio',
        loadChildren: () =>
          import('../servicios-empresa/servicios-empresa.module').then((m) => m.ServiciosEmpresaPageModule),
      },
      {
        path: 'perfil',
        loadChildren: () =>
          import('../homeperfil/homeperfil.module').then((m) => m.HomeperfilPageModule),
      },
      {
        path: 'notificaciones',
        loadChildren: () =>
          import('../notificaciones/notificaciones.module').then((m) => m.NotificacionesPageModule),
      },
      {
        path: 'historialservicios',
        loadChildren: () =>
          import('../historialservicios/historialservicios.module').then((m) => m.HistorialserviciosPageModule),
      },
      {
        path: 'carrito',
        loadChildren: () =>
          import('../carrito/carrito.module').then((m) => m.CarritoPageModule),
      },
      {
        path: 'tarjetas',
        loadChildren: () =>
          import('../metododepago/metododepago.module').then((m) => m.MetododepagoPageModule),
      },
      {
        path: 'chat',
        loadChildren: () => import('../chat/chat.module').then( m => m.ChatPageModule)
      },
      {
        path: 'scanner',
        loadChildren: () => import('../scanner/scanner.module').then( m => m.ScannerPageModule)
      },
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full',
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
