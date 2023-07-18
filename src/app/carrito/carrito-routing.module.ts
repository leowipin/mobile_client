import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarritoPage } from './carrito.page';

const routes: Routes = [
  {
    path: '',
        component: CarritoPage
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
export class CarritoPageRoutingModule {}
