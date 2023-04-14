import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RouteLocationsPageRoutingModule } from './route-locations-routing.module';

import { RouteLocationsPage } from './route-locations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouteLocationsPageRoutingModule
  ],
  declarations: [RouteLocationsPage]
})
export class RouteLocationsPageModule {}
