import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IToggleComponent } from './itoggle.component';
import { ITOGGLE_OPTIONS } from './itoggle.token';
import { IToggleConfig } from './itoggle.config';

@NgModule({
  declarations: [
    IToggleComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    FormsModule,
    IToggleComponent
  ]
})
export class IToggleModule {
  static forRoot(config: IToggleConfig | null | undefined): ModuleWithProviders {
    return {
      ngModule: IToggleModule,
      providers: [
        {provide: ITOGGLE_OPTIONS, useValue: config || {}}
      ]
    };
  }
}
