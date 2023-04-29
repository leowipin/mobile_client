import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarTarjetaPage } from './agregar-tarjeta.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarTarjetaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarTarjetaPageRoutingModule {}
