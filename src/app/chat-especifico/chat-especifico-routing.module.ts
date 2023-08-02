import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatEspecificoPage } from './chat-especifico.page';

const routes: Routes = [
  {
    path: '',
    component: ChatEspecificoPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatEspecificoPageRoutingModule {}
