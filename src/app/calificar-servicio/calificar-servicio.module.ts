import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { CalificarServicioPageRoutingModule } from './calificar-servicio-routing.module';
import { CalificarServicioPage } from './calificar-servicio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalificarServicioPageRoutingModule
  ],
  declarations: [CalificarServicioPage]
})
export class CalificarServicioPageModule {}
