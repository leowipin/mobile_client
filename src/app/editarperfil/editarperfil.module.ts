import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { EditarperfilPageRoutingModule } from './editarperfil-routing.module';

import { EditarperfilPage } from './editarperfil.page';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClienteWAService } from '../servicios/login-registro/login-registro.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarperfilPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EditarperfilPage],
  providers:[ClienteWAService]
})
export class EditarperfilPageModule {}
