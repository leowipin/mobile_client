import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalificarServicioPage } from './calificar-servicio.page';

const routes: Routes = [
  {
    path: '',
    component: CalificarServicioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalificarServicioPageRoutingModule {}
