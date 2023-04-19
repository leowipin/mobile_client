import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PedidoCarritoPage } from './pedido-carrito.page';

const routes: Routes = [
  {
    path: '',
    component: PedidoCarritoPage
  },
  {
    path: 'carrito',
    loadChildren: () => import('../carrito/carrito.module').then( m => m.CarritoPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidoCarritoPageRoutingModule {}
