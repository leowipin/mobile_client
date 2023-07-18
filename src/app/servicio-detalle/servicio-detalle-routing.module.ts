import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicioDetallePage } from './servicio-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: ServicioDetallePage
  },
  {
    path: 'servicio-solicitud',
    loadChildren: () => import('../solicitud-servicio/solicitud-servicio.module').then( m => m.SolicitudServicioPageModule)
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicioDetallePageRoutingModule {}
