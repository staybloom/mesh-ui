import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgZone,
  SimpleChanges,
} from '@angular/core';
import * as moment from 'moment';
import { Observable, Subject, interval, map, timer } from 'rxjs';
import {
  AnomalyDataResponse,
  AnomalyTrigger,
  AnomlayAction,
  HotelDetailUiPb,
} from 'src/app/_interfaces/anomaly';
import { AnomaliesService } from 'src/app/_services/anomalies.service';

@Component({
  selector: 'app-anomaly-card',
  templateUrl: './anomaly-card.component.html',
  styleUrls: ['./anomaly-card.component.scss'],
})
export class AnomalyCardComponent {
  data: any = [1, 2, 3, 4, 5];
  @Input('anomalyData') anomalyData: AnomalyDataResponse = {};
  isClassActive: boolean = false;
  potentialAnomalyInterval: any;
  dateTimeInterval: any;
  allAnomalies: AnomalyDataResponse[] = [];
  activeCounter: any;
  edit: boolean = false;
  reason: string = '';
  potentialDetectionTimeExcceed: boolean = false;
  today = new Date();
  @Input() counterSeconds: Observable<number>;
  @Input() resolvedIndex: number;
  @Input() index: number;

  timerCounter: number;
  constructor(private anomaly: AnomaliesService, private ngZone: NgZone) {}

  ngOnInit() {
    if (this.counterSeconds) {
      this.counterSeconds.subscribe((data) => {
        // console.log(data);
        this.timerCounter = data;
        this.counter(this.anomalyData, true);
      });
    }
  }

  clickAnomaly() {
    this.isClassActive = !this.isClassActive;
    if (this.isClassActive) {
      this.getPlaceAnomaly();
    }
  }
  editReason() {
    this.edit = true;
  }
  get potentialAnomalyDetectionTime() {
    let potentialAnomalyDetectionTime: any =
      this.anomalyData?.potentialAnomalyDetectionTime;
    return {
      date: moment(new Date(potentialAnomalyDetectionTime)).date(),
      month: moment(new Date(potentialAnomalyDetectionTime)).format('MMM'),
      time24: moment(new Date(potentialAnomalyDetectionTime)).format('hh:mm'),
    };
  }

  getAnomaliesTime(item: AnomalyDataResponse) {
    let potentialAnomalyDetectionTime: any =
      item?.potentialAnomalyDetectionTime;
    return {
      diff: moment(
        moment(new Date()).diff(new Date(potentialAnomalyDetectionTime))
      ).format('hh:mm'),
      time24: moment(new Date(potentialAnomalyDetectionTime)).format('hh:mm'),
    };
  }

  counter(item: AnomalyDataResponse = {}, main: boolean = false) {
    let dateTimeInterval;
    let anomalyCalculate: any = moment(item.potentialAnomalyDetectionTime);
    let potentialAnomalyDetectionTimeDiff = moment().diff(
      moment(anomalyCalculate)
    );
    if (main && item?.isActive) {
      this.potentialDetectionTimeExcceed =
        potentialAnomalyDetectionTimeDiff > 890000 ? true : false;
    }
    const duration = moment.duration(potentialAnomalyDetectionTimeDiff);
    if (potentialAnomalyDetectionTimeDiff <= 60000) {
      const secondsElapsed = duration.asSeconds();
      dateTimeInterval =
        Math.floor(secondsElapsed) > 1
          ? `${Math.floor(secondsElapsed)} secs`
          : `${Math.floor(secondsElapsed)} sec`;
    } else if (
      potentialAnomalyDetectionTimeDiff > 60000 &&
      potentialAnomalyDetectionTimeDiff <= 3600000
    ) {
      const minutesElapsed = duration.minutes();
      dateTimeInterval =
        Math.floor(minutesElapsed) > 1
          ? `${Math.floor(minutesElapsed)} mins`
          : `${Math.floor(minutesElapsed)} min`;
    } else if (potentialAnomalyDetectionTimeDiff > 3600000) {
      const hoursElapsed = duration.hours();
      dateTimeInterval =
        Math.floor(hoursElapsed) > 1
          ? `${Math.floor(hoursElapsed)} hrs`
          : `${Math.floor(hoursElapsed)} hr`;
    }
    if (main) {
      this.activeCounter = dateTimeInterval;
    }
    return dateTimeInterval;
  }

  getPlaceAnomaly() {
    let payload = {
      start: new Date(
        new Date(new Date().setDate(new Date().getDate() - 30)).setHours(
          12,
          0,
          0,
          0
        )
      ),
      end: new Date(new Date().setDate(new Date().getDate())),
      inventoryStoreId: this.anomalyData.inventoryStoreId,
      roomCode: this.anomalyData.roomCode,
    };
    this.anomaly.getResolvedAnomaly(payload).subscribe((data) => {
      this.allAnomalies = data;
      this.allAnomalies.map((ele) => {
        ele.counter = this.counter(ele);
      });
      this.allAnomalies = this.allAnomalies.reverse();
    });
  }
  saveReason() {
    this.updateActiveAnomay();
  }
  getReason($event: any) {
    this.reason = $event;
  }

  updateActiveAnomay() {
    let payload = {
      id: this.anomalyData.id,
      reason: this.reason,
    };
    this.anomaly.updateAnomaly(payload).subscribe((data) => {
      this.edit = false;
    });
  }

  get hotelDetails(): HotelDetailUiPb {
    return this.anomalyData?.hotelDetails || {};
  }

  get roomStatus(): string {
    switch (this.anomalyData.anomalyTrigger) {
      case AnomalyTrigger.VACANT:
        return './assets/color/room-vacant.svg';
        break;
      case AnomalyTrigger.TASK_PROLONGED:
      default:
        return './assets/color/task-prolonged.svg';
        break;
    }
  }
}
