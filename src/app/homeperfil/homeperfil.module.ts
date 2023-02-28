import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeperfilPageRoutingModule } from './homeperfil-routing.module';

import { HomeperfilPage } from './homeperfil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeperfilPageRoutingModule
  ],
  declarations: [HomeperfilPage]
})
export class HomeperfilPageModule {}
