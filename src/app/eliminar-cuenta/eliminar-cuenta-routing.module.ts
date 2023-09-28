import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EliminarCuentaPage } from './eliminar-cuenta.page';

const routes: Routes = [
  {
    path: '',
    component: EliminarCuentaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EliminarCuentaPageRoutingModule {}
