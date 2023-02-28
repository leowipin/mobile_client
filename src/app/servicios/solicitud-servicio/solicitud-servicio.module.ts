import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SolicitudServicioPageRoutingModule } from './solicitud-servicio-routing.module';

import { SolicitudServicioPage } from './solicitud-servicio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolicitudServicioPageRoutingModule
  ],
  declarations: [SolicitudServicioPage]
})
export class SolicitudServicioPageModule {}
