import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidoCarritoPageRoutingModule } from './pedido-carrito-routing.module';

import { PedidoCarritoPage } from './pedido-carrito.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PedidoCarritoPageRoutingModule
  ],
  declarations: [PedidoCarritoPage]
})
export class PedidoCarritoPageModule {}
