import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenupruebaPage } from './menuprueba.page';

const routes: Routes = [
  {
    path: '',
    component: MenupruebaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenupruebaPageRoutingModule {}
