import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistorialserviciosPage } from './historialservicios.page';

const routes: Routes = [
  {
    path: '',
        component: HistorialserviciosPage
  },
  {
    path: 'pedido-carrito',
    loadChildren: () => import('../pedido-carrito/pedido-carrito.module').then( m => m.PedidoCarritoPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistorialserviciosPageRoutingModule {}
