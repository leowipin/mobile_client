import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistorialserviciosPage } from './historialservicios.page';

const routes: Routes = [
  {
    path: '',
    component: HistorialserviciosPage
  },  {
    path: 'description',
    loadChildren: () => import('./description/description.module').then( m => m.DescriptionPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistorialserviciosPageRoutingModule {}
