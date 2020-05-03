import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizerPipe } from './dom-sanitizer.pipe';
import { FechaPipe } from './fecha.pipe';

@NgModule({
  declarations: [DomSanitizerPipe, FechaPipe],
  imports: [ CommonModule],
  exports: [DomSanitizerPipe, FechaPipe]
})
export class PipesModule { }
