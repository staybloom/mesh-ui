import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';

@Injectable({ providedIn: 'root' })
export class SocketService {
  public socket$ = new WebSocketSubject(
    ' wss://1tn4ylyxc4.execute-api.ap-southeast-1.amazonaws.com/DEV/'
  );
  constructor() {}
}
