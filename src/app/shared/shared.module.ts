import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import {IonicModule} from '@ionic/angular';
import {FilterComponent} from './components/filter/filter.component';


@NgModule({
  declarations: [ToolbarComponent, FilterComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    ToolbarComponent,
    FilterComponent
  ]
})
export class SharedModule { }
