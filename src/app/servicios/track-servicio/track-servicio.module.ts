import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UbicacionModule } from 'src/app/ubicacion/ubicacion.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TrackServicioComponent } from './track-servicio.component';




@NgModule({
  declarations: [TrackServicioComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    UbicacionModule
  ],
  exports: [TrackServicioComponent]
})
export class TrackServicioModule { }
