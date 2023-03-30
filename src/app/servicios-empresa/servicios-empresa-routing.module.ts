import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiciosEmpresaPage } from './servicios-empresa.page';

const routes: Routes = [
  /*{
    path: '',
    component: ServiciosEmpresaPage
  },
  {
    path: '',

    children: [
      {
        path: 'servicio-detalle',
        loadChildren: () => import('../servicio-detalle/servicio-detalle.module').then(m => m.ServicioDetallePageModule)
      },
      {
        path: '',
        component: ServiciosEmpresaPage
      },

    ]
  }*/
  {
    path: '',
    children: [
      {
        path: 'servicio-detalle/:id',
        loadChildren: () => import('../servicio-detalle/servicio-detalle.module').then(m => m.ServicioDetallePageModule)
      },
      {
        path: '',
        component: ServiciosEmpresaPage
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiciosEmpresaPageRoutingModule {}
