import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { RevisartareaPage } from '../revisartarea/revisartarea.page';
import { RevisartareaPageModule } from '../revisartarea/revisartarea.module';
import { GaleriaPage } from '../galeria/galeria.page';
import { GaleriaPageModule } from '../galeria/galeria.module';

@NgModule({
  entryComponents: [ RevisartareaPage, GaleriaPage ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab2PageRoutingModule,
    RevisartareaPageModule,
    GaleriaPageModule,
  ],
  declarations: [Tab2Page]
})
export class Tab2PageModule {}
