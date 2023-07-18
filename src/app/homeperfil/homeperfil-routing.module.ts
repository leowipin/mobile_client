import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeperfilPage } from './homeperfil.page';

const routes: Routes = [
  {
    path: '',
    component: HomeperfilPage
  },
  {
    path: 'editarperfil',
    loadChildren: () => import('../editarperfil/editarperfil.module').then( m => m.EditarperfilPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeperfilPageRoutingModule {}
