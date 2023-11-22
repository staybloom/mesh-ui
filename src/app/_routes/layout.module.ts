import { NgModule } from '@angular/core';

import { FullPageLayoutComponent } from '../_layouts/full-page-layout/full-page-layout/full-page-layout.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SwitchComponent } from '../_components/switch/switch.component';

@NgModule({
  imports: [RouterModule, CommonModule],
  exports: [],
  declarations: [FullPageLayoutComponent, SwitchComponent],
  providers: [],
})
export class LayoutModule {}
