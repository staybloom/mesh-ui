import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventHubService {
  private timerSubject: Subject<number> = new Subject<number>();

  constructor() {}
  getTimer() {
    return this.timerSubject.asObservable();
  }
  setTimer(data: number) {
    this.timerSubject.next(data);
  }
}
