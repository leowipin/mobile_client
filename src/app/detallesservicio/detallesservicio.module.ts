import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallesservicioPageRoutingModule } from './detallesservicio-routing.module';

import { DetallesservicioPage } from './detallesservicio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetallesservicioPageRoutingModule
  ],
  declarations: [DetallesservicioPage]
})
export class DetallesservicioPageModule {}
