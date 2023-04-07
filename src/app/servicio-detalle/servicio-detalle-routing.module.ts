import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicioDetallePage } from './servicio-detalle.page';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'servicio-solicitud',
        loadChildren: () => import('../servicios/solicitud-servicio/solicitud-servicio.module').then( m => m.SolicitudServicioPageModule)
      },
      {
        path: '',
        component: ServicioDetallePage
      },
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicioDetallePageRoutingModule {}
