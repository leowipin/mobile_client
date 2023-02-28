import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Item1ModalPageRoutingModule } from './item1-modal-routing.module';

import { Item1ModalPage } from './item1-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Item1ModalPageRoutingModule
  ],
  declarations: [Item1ModalPage]
})
export class Item1ModalPageModule {}
