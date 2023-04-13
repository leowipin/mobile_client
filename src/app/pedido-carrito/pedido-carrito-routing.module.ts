import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PedidoCarritoPage } from './pedido-carrito.page';

const routes: Routes = [
  {
    path: '',
    component: PedidoCarritoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidoCarritoPageRoutingModule {}
