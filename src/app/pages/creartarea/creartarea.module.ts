import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreartareaPageRoutingModule } from './creartarea-routing.module';

import { CreartareaPage } from './creartarea.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreartareaPageRoutingModule
  ],
  declarations: [CreartareaPage]
})
export class CreartareaPageModule {}
