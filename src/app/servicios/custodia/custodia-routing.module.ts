import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustodiaPage } from './custodia.page';

const routes: Routes = [
  {
    path: '',
    component: CustodiaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustodiaPageRoutingModule {}
