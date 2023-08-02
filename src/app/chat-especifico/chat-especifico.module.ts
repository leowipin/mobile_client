import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatEspecificoPageRoutingModule } from './chat-especifico-routing.module';

import { ChatEspecificoPage } from './chat-especifico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatEspecificoPageRoutingModule
  ],
  declarations: [ChatEspecificoPage]
})
export class ChatEspecificoPageModule {}
