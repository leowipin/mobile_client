import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CambiarPasswordPageRoutingModule } from './cambiar-password-routing.module';

import { CambiarPasswordPage } from './cambiar-password.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CambiarPasswordPageRoutingModule
  ],
  declarations: [CambiarPasswordPage]
})
export class CambiarPasswordPageModule {}
