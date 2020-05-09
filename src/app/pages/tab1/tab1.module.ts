import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './tab1-routing.module';
// import { FechaPipe } from '../../pipes/fecha.pipe';
import { RevisartareaPage } from '../revisartarea/revisartarea.page';
import { RevisartareaPageModule } from '../revisartarea/revisartarea.module';
import { GaleriaPage } from '../galeria/galeria.page';
import { GaleriaPageModule } from '../galeria/galeria.module';
import { CreartareaPage } from '../creartarea/creartarea.page';
import { CreartareaPageModule } from '../creartarea/creartarea.module';

@NgModule({
  entryComponents: [ RevisartareaPage, GaleriaPage, CreartareaPage ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    RevisartareaPageModule,
    GaleriaPageModule,
    CreartareaPageModule,
  ],
  declarations: [Tab1Page ]
})
export class Tab1PageModule {}
