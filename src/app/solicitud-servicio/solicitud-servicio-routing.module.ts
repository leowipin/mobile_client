import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitudServicioPage } from './solicitud-servicio.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitudServicioPage
  },
  {
    path: 'estado-solicitud',
    loadChildren: () => import('../estado-solicitud/estado-solicitud.module').then( m => m.EstadoSolicitudPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitudServicioPageRoutingModule {}
