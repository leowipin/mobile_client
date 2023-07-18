import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarperfilPage } from './editarperfil.page';

const routes: Routes = [
  {
    path: '',
    component: EditarperfilPage
  },
  {
    path: 'tarjetas',
    loadChildren: () =>
      import('../metododepago/metododepago.module').then((m) => m.MetododepagoPageModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarperfilPageRoutingModule {}
