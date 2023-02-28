import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Item1ModalPage } from './item1-modal.page';

const routes: Routes = [
  {
    path: '',
    component: Item1ModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Item1ModalPageRoutingModule {}
