import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MetododepagoPage } from './metododepago.page';

const routes: Routes = [
  {
    path: '',
    component: MetododepagoPage
  },
  {
    path: 'agregar-tarjeta',
    loadChildren: () => import('../agregar-tarjeta/agregar-tarjeta.module').then( m => m.AgregarTarjetaPageModule)
  },
  {
    path: 'pedido-detalle',
    loadChildren: () => import('../pedido-detalle/pedido-detalle.module').then( m => m.PedidoDetallePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MetododepagoPageRoutingModule {}
