import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidoHistorialPageRoutingModule } from './pedido-historial-routing.module';

import { PedidoHistorialPage } from './pedido-historial.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PedidoHistorialPageRoutingModule
  ],
  declarations: [PedidoHistorialPage]
})
export class PedidoHistorialPageModule {}
