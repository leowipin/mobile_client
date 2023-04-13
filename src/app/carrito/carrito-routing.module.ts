import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarritoPage } from './carrito.page';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'pedido-carrito/:id',
        loadChildren: () => import('../pedido-carrito/pedido-carrito.module').then(m => m.PedidoCarritoPageModule)
      },
      {
        path: '',
        component: CarritoPage
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarritoPageRoutingModule {}
