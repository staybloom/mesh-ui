import { Component } from '@angular/core';
import { SocketService } from './_services/socket.service';
import { AnomaliesService } from './_services/anomalies.service';
import { AnomalyDataResponse } from './_interfaces/anomaly';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'mesh';
  anomaliesDataResponse: AnomalyDataResponse[] = [];
  anomaliesTranformerData: any = {};
  constructor(
    private socket: SocketService,
    private anomalies: AnomaliesService
  ) {
    this.socket.socket$.next({ action: 'CONNECTION' });
  }
}
