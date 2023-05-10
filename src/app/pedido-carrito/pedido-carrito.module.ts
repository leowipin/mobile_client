import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidoCarritoPageRoutingModule } from './pedido-carrito-routing.module';

import { MyModalComponent, PedidoCarritoPage } from './pedido-carrito.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PedidoCarritoPageRoutingModule
  ],
  declarations: [PedidoCarritoPage, MyModalComponent]
})
export class PedidoCarritoPageModule {}
