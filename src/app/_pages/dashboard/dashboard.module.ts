import { NgModule } from '@angular/core';
import { DashboardLandingComponent } from './dashboard-landing/dashboard-landing.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { LayoutModule } from 'src/app/_routes/layout.module';
import { AnomalyCardComponent } from './components/anomaly-card/anomaly-card.component';
import { PulseComponent } from 'src/app/_components/pulse/pulse.component';
import { CommonModule } from '@angular/common';
import { SelectComponent } from 'src/app/_components/select/select.component';

@NgModule({
  imports: [
    DashboardRoutingModule,
    LayoutModule,
    CommonModule,
    SelectComponent,
  ],
  exports: [],
  declarations: [
    DashboardLandingComponent,
    AnomalyCardComponent,
    PulseComponent,
  ],
  providers: [],
})
export class DashboardModule {}
