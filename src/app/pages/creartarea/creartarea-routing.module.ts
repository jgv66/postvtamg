import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreartareaPage } from './creartarea.page';

const routes: Routes = [
  {
    path: '',
    component: CreartareaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreartareaPageRoutingModule {}
