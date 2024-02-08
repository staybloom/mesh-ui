import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';

@Injectable({ providedIn: 'root' })
export class SocketService {
  socket$: WebSocketSubject<any>;

  constructor() {}

  socketConnection(data: boolean = false) {
    let self = this;
    this.socket$ = webSocket({
      url: environment.socketURL,
      deserializer: (e) => e.data,
      serializer: (value: any) => JSON.stringify(value),
      openObserver: {
        next() {
          if (data) {
            self.sendConnectionInfo();
            console.log('connected');
          }
        },
      },

      closeObserver: {
        next() {
          console.log('disconnted');
          if (document.getElementsByClassName('no-internet')[0]) {
            var offlineElement =
              document.getElementsByClassName('no-internet')[0];
            offlineElement.setAttribute('style', 'display:block');
          }
        },
      },
    });

    return this.socket$;
  }

  sendConnectionInfo() {
    this.socket$.next({ action: 'CONNECTION_INFO' });
  }
}
