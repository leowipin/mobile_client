import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RouteLocationsPage } from './route-locations.page';

const routes: Routes = [
  {
    path: '',
    component: RouteLocationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RouteLocationsPageRoutingModule {}
