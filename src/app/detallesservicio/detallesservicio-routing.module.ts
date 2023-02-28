import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetallesservicioPage } from './detallesservicio.page';

const routes: Routes = [
  {
    path: '',
    component: DetallesservicioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetallesservicioPageRoutingModule {}
