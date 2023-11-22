import { Component, Input } from '@angular/core';
import * as moment from 'moment';
import {
  AnomalyDataResponse,
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
  constructor(private anomaly: AnomaliesService) {}
  ngOnInit() {}
  ngOnChanges() {
    this.counter(this.anomalyData, true);
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
    // console.log(potentialAnomalyDetectionTime);
    return {
      date: moment(new Date(potentialAnomalyDetectionTime)).date(),
      month: moment(new Date(potentialAnomalyDetectionTime)).format('MMM'),
      time24: moment(new Date(potentialAnomalyDetectionTime)).format('hh:mm'),
    };
  }

  getAnomaliesTime(item: AnomalyDataResponse) {
    let potentialAnomalyDetectionTime: any =
      item?.potentialAnomalyDetectionTime;
    // console.log(potentialAnomalyDetectionTime);
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
    // let potentialAnomalyDetectionTimeDiff = moment(new Date()).diff(
    //   moment(new Date('2023-11-22T13:04:10.676Z'))
    // );
    console.log(potentialAnomalyDetectionTimeDiff);
    const duration = moment.duration(potentialAnomalyDetectionTimeDiff);
    console.log(duration);
    if (potentialAnomalyDetectionTimeDiff <= 59000) {
      const secondsElapsed = duration.asSeconds();
      dateTimeInterval =
        Math.floor(secondsElapsed) > 1
          ? `${Math.floor(secondsElapsed)} secs`
          : `${Math.floor(secondsElapsed)} sec`;
      if (item.isActive) {
        let seconds = setInterval(() => {
          console.log('seconds');
          duration.add(1, 'seconds');
          const secondsElapsed = duration.asSeconds();
          dateTimeInterval =
            Math.floor(secondsElapsed) > 1
              ? `${Math.floor(secondsElapsed)} secs`
              : `${Math.floor(secondsElapsed)} sec`;
          if (main) {
            this.activeCounter = dateTimeInterval;
          }
          console.log(secondsElapsed);
          if (secondsElapsed > 59) {
            this.counter(item, main);
            console.log('clear interval');
            clearInterval(seconds);
          }
        }, 1000);
      }
    } else if (
      potentialAnomalyDetectionTimeDiff > 59000 &&
      potentialAnomalyDetectionTimeDiff <= 3590000
    ) {
      duration.add(1, 'minutes');
      const minutesElapsed = duration.minutes();
      dateTimeInterval =
        Math.floor(minutesElapsed) > 1
          ? `${Math.floor(minutesElapsed)} mins`
          : `${Math.floor(minutesElapsed)} min`;
      if (item.isActive) {
        setInterval(() => {
          console.log('minutes');
          duration.add(1, 'minutes');
          const minutesElapsed = duration.minutes();
          dateTimeInterval =
            Math.floor(minutesElapsed) > 1
              ? `${Math.floor(minutesElapsed)} mins`
              : `${Math.floor(minutesElapsed)} min`;
          if (main) {
            this.activeCounter = dateTimeInterval;
          }
          if (minutesElapsed > 59) {
            console.log('clear interval');
            clearInterval(minutesElapsed);
            this.counter(item, main);
          }
        }, 60000);
      }
    } else if (potentialAnomalyDetectionTimeDiff > 3590000) {
      duration.add(1, 'hours');
      const hoursElapsed = duration.hours();
      dateTimeInterval =
        Math.floor(hoursElapsed) > 1
          ? `${Math.floor(hoursElapsed)} hrs`
          : `${Math.floor(hoursElapsed)} hr`;
      if (item.isActive) {
        setInterval(() => {
          console.log('hours');
          duration.add(1, 'hours');
          const hoursElapsed = duration.hours();
          dateTimeInterval =
            Math.floor(hoursElapsed) > 1
              ? `${Math.floor(hoursElapsed)} hrs`
              : `${Math.floor(hoursElapsed)} hr`;
          if (main) {
            this.activeCounter = dateTimeInterval;
          }
        }, 3600000);
      }
    }
    if (main) {
      this.activeCounter = dateTimeInterval;
    }
    console.log(this.activeCounter);
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
      console.log(data);
      this.allAnomalies = data;
      this.allAnomalies.map((ele) => {
        ele.counter = this.counter(ele);
      });
      this.allAnomalies = this.allAnomalies.reverse();
      console.log(this.allAnomalies);
    });
  }
  saveReason() {
    this.updateActiveAnomay();
  }
  getReason($event: any) {
    console.log($event);
    this.reason = $event;
  }

  updateActiveAnomay() {
    let payload = {
      id: this.anomalyData.id,
      reason: this.reason,
    };
    this.anomaly.updateAnomaly(payload).subscribe((data) => {
      console.log(data);
      this.edit = false;
    });
  }

  get hotelDetails(): HotelDetailUiPb {
    return this.anomalyData?.hotelDetails || {};
  }
}
