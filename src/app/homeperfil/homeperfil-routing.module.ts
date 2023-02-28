import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeperfilPage } from './homeperfil.page';

const routes: Routes = [
  {
    path: '',
    component: HomeperfilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeperfilPageRoutingModule {}
