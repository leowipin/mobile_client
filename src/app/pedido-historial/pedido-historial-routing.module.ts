import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PedidoHistorialPage } from './pedido-historial.page';

const routes: Routes = [
  {
    path: '',
    component: PedidoHistorialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidoHistorialPageRoutingModule {}
