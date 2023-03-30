import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServicioDetallePageRoutingModule } from './servicio-detalle-routing.module';

import { ServicioDetallePage } from './servicio-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ServicioDetallePageRoutingModule
  ],
  declarations: [ServicioDetallePage]
})
export class ServicioDetallePageModule {}
