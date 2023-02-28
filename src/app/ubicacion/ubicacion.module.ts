import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UbicacionComponent } from './ubicacion.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [UbicacionComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports: [UbicacionComponent]
})
export class UbicacionModule { }
