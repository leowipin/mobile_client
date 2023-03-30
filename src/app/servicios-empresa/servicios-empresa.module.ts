import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
//import { ClienteWAService } from '../servicios/login-registro/login-registro.service';
import { IonicModule } from '@ionic/angular';

import { ServiciosEmpresaPageRoutingModule } from './servicios-empresa-routing.module';

import { ServiciosEmpresaPage } from './servicios-empresa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiciosEmpresaPageRoutingModule,
    HttpClientModule
  ],
  declarations: [ServiciosEmpresaPage]
})
export class ServiciosEmpresaPageModule {}
