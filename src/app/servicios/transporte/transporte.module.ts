import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransportePageRoutingModule } from './transporte-routing.module';

import { TransportePage } from './transporte.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransportePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [TransportePage]
})
export class TransportePageModule {}
