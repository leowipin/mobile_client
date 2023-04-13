import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstadoSolicitudPage } from './estado-solicitud.page';

const routes: Routes = [
  {
    path: '',
    component: EstadoSolicitudPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstadoSolicitudPageRoutingModule {}
