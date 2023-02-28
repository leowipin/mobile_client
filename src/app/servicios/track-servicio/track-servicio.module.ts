import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UbicacionComponent } from 'src/app/ubicacion/ubicacion.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TrackServicioComponent } from './track-servicio.component';




@NgModule({
  declarations: [TrackServicioComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    UbicacionComponent
  ],
  exports: [TrackServicioComponent]
})
export class TrackServicioModule { }
