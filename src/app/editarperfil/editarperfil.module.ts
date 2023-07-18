import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { EditarperfilPageRoutingModule } from './editarperfil-routing.module';

import { EditarperfilPage } from './editarperfil.page';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClienteWAService } from '../login-registro/login-registro.service';
import { MyEmailModalComponent } from './editarperfil.page';
import { MyPasswordModalComponent } from './editarperfil.page';
import { MyDeleteModalComponent } from './editarperfil.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarperfilPageRoutingModule,
    ReactiveFormsModule,
    
  ],
  declarations: [EditarperfilPage, MyEmailModalComponent, MyPasswordModalComponent, MyDeleteModalComponent],
  providers:[ClienteWAService]
})
export class EditarperfilPageModule {}
