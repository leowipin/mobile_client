import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenupruebaPageRoutingModule } from './menuprueba-routing.module';

import { MenupruebaPage } from './menuprueba.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenupruebaPageRoutingModule
  ],
  declarations: [MenupruebaPage]
})
export class MenupruebaPageModule {}
