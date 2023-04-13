import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstadoSolicitudPageRoutingModule } from './estado-solicitud-routing.module';

import { EstadoSolicitudPage } from './estado-solicitud.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstadoSolicitudPageRoutingModule
  ],
  declarations: [EstadoSolicitudPage]
})
export class EstadoSolicitudPageModule {}
