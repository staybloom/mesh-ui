import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent {
  timer: number = 10;
  @Input('counter') counter: any;
  constructor() {}
  ngOnChanges() {
    console.log(this.counter);
    if (this.counter) {
      this.timer--;
    }
  }
}
