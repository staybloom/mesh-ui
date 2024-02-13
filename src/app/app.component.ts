import { Component, NgZone } from '@angular/core';
import { SocketService } from './_services/socket.service';
import { AnomalyDataResponse } from './_interfaces/anomaly';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'mesh';
  // networkStatus$: Subscription = Subscription.EMPTY;

  anomaliesDataResponse: AnomalyDataResponse[] = [];
  anomaliesTranformerData: any = {};

  constructor() {}

  ngOnInit() {
    // this.checkNetworkStatus();
  }

  // checkNetworkStatus() {
  //   this.networkStatus$ = merge(
  //     of(null),
  //     fromEvent(window, 'online'),
  //     fromEvent(window, 'offline')
  //   )
  //     .pipe(map(() => navigator.onLine))
  //     .subscribe((status) => {
  //       this.internetCheck();
  //       //console.log('status', status);
  //     });
  // }

  internetCheck() {
    var offlineElement = document.getElementsByClassName('no-internet')[0];
    if (navigator.onLine) {
      if (offlineElement) {
        offlineElement.setAttribute('style', 'display:none');
      }
    } else {
      offlineElement.setAttribute('style', 'display:block');
    }
  }
}
