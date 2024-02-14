import { Component, ElementRef, NgZone, ViewChild } from "@angular/core";
import * as moment from "moment";
import {
  Observable,
  Subscription,
  fromEvent,
  interval,
  map,
  merge,
  of,
} from "rxjs";
import {
  AnomalyDataResponse,
  AnomlayAction,
  HotelDetailUiPb,
  RoomConnectedResponse,
} from "src/app/_interfaces/anomaly";
import { AnomaliesService } from "src/app/_services/anomalies.service";
import { SocketService } from "src/app/_services/socket.service";

@Component({
  selector: "app-dashboard-landing",
  templateUrl: "./dashboard-landing.component.html",
  styleUrls: ["./dashboard-landing.component.scss"],
})
export class DashboardLandingComponent {
  isOnline: boolean;

  private eventInterval$: Observable<number>;
  @ViewChild("audioOption") audioOption: ElementRef;
  networkStatus$: Subscription = Subscription.EMPTY;

  voiceCues: string;
  anomaliesDataResponse: AnomalyDataResponse[] = [];
  inventory: any = {};
  error: any = null;
  disconnectedDevicesPerInventory: any = {};
  moment = moment;
  getAllDisconnectedDevices: RoomConnectedResponse[];
  secondsPassed: number = 0;
  counterSeconds: any = 0;
  resolvedIndex: any;
  initialLoad: boolean;
  constructor(
    public anomalies: AnomaliesService,
    public socket: SocketService,
    public ngZone: NgZone
  ) {}

  ngOnInit() {
    document.body.click();

    this.isOnline = navigator.onLine;

    // Listen for online/offline events
    window.addEventListener("online", this.updateOnlineStatus.bind(this));
    window.addEventListener("offline", this.updateOnlineStatus.bind(this));
    this.initialLoad = true;
    this.checkNetworkStatus();
    this.eventInterval$ = interval(1000);

    // socketInitialize;
    this.socketInitialize();
    // sending connectinInfo
    this.ngZone.runOutsideAngular(() => {
      this.ngZone.run(() => {
        setInterval(() => {
          let PING_PONG: any = { action: "PING_PONG" };
          this.socket.socket$.next(PING_PONG);
        }, 120000);
      });
    });

    this.getAnomaliesCards();
  }

  socketInitialize() {
    this.socket.socketConnection(true).subscribe({
      next: (onmessage) => {
        if (onmessage) {
          this.updateAnomalies(onmessage);
          this.disconnectedAnomalies(onmessage);
          console.log(onmessage);
          let message = JSON.parse(onmessage);
          if (message.action) {
            switch (message.action) {
              case AnomlayAction.ANOMALY_TRIGGER:
                this.voiceCues = "/assets/audio/anomaly-detected.mp3";
                break;
              case AnomlayAction.ANOMALY_RESOLVED:
                this.voiceCues = "./assets/audio/anomaly-resolved.mp3";

                break;
              case AnomlayAction.ROOM_CONNECTED:
                this.voiceCues = "./assets/audio/device-connected.mp3";
                break;
              case AnomlayAction.ROOM_DISCONNECTED:
                this.voiceCues = "./assets/audio/device-disconnected.mp3";
                break;
              default:
                break;
            }
            if (
              message.action &&
              (message.action == AnomlayAction.ANOMALY_TRIGGER ||
                message.action == AnomlayAction.ANOMALY_RESOLVED ||
                message.action == AnomlayAction.ROOM_CONNECTED ||
                message.action == AnomlayAction.ROOM_DISCONNECTED)
            ) {
              if (this.voiceCues) {
                this.playAudio(this.voiceCues);
              }
            }
          }
        }
      },
      error: (err) => console.error("An error occurred :", err),
      complete: () => {},
    });
  }
  playAudio(url: string) {
    setTimeout(() => {
      document.getElementsByTagName("audio")[0]?.remove();
      var audio = document.createElement("audio") as any;
      let source = document.createElement("source") as any;
      source.setAttribute("src", url);
      source.setAttribute("type", "audio/mp3");
      audio.appendChild(source);
      document.body.appendChild(audio);
      audio.setAttribute("autoPlay", true);
    }, 1500);
  }

  getEventInterval(): Observable<number> {
    return this.eventInterval$;
  }

  getString(input: any) {
    return String(input);
  }

  disconnectedAnomalies(item: any) {
    let data = JSON.parse(item);
    if (data.action) {
      switch (data?.action) {
        case AnomlayAction.ROOM_CONNECTED:
          this.disconnectedDevicesPerInventory = {};
          this.getAllDisconnectedDevices.map((ele: any, i: number) => {
            if (ele.id == data.placeConnectionFeed.id) {
              this.getAllDisconnectedDevices.splice(i, 1);
            }
          });
          this.populateDisconnected(this.getAllDisconnectedDevices);

          break;
        case AnomlayAction.ROOM_DISCONNECTED:
          this.getAllDisconnectedDevices.push(data.placeConnectionFeed);
          this.populateDisconnected(this.getAllDisconnectedDevices);
          break;
      }
    }
  }
  async updateAnomalies(item: any) {
    let data = JSON.parse(item);
    if (data && data?.action) {
      if (data?.action == AnomlayAction.ANOMALY_RESOLVED) {
        this.anomaliesDataResponse.map((ele, i) => {
          if (ele.id == data?.anomalyClientFeed?.id) {
            this.resolvedIndex = i;
          }
        });
        setTimeout(() => {
          this.anomaliesDataResponse.splice(this.resolvedIndex, 1);
          this.resolvedIndex = false;
        }, 9000);
      } else if (data?.action == AnomlayAction.ANOMALY_TRIGGER) {
        const hotel: any = await this.anomalies.getHotelInventory(
          data.anomalyClientFeed.inventoryStoreId
        );
        if (hotel?.id) {
          this.inventory[hotel.id] = {};
          this.inventory[hotel.id] = hotel;
        }

        let hotelDetails: HotelDetailUiPb = {
          brand: hotel?.propertyRef?.brandName,
          city: `${hotel?.propertyRef?.addressBasic.city}, ${hotel?.propertyRef?.addressBasic.state}`,
          picture: `${hotel?.propertyRef?.imageUrl}`,
          roomCode: data.anomalyClientFeed.roomCode,
          name: hotel?.propertyRef?.name,
        };
        data.anomalyClientFeed.hotelDetails = hotelDetails;
        if (!this.anomaliesDataResponse?.length) {
          this.anomaliesDataResponse = [];
        }
        this.anomaliesDataResponse.push(data?.anomalyClientFeed);
      }
    }
  }
  getAnomaliesCards() {
    let start = moment()
      .utc()
      .add(5, "hours")
      .add(30, "minutes")
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    let end = moment().utc().add(5, "hours").add(30, "minutes").format();
    var payload: any = { isActive: true, start: start, end: end };
    this.anomalies.getAnomalies(payload).subscribe((data) => {
      this.anomaliesDataResponse = data;
      this.anomaliesDataResponse?.map(async (ele) => {
        const hotel = await this.anomalies.getHotelInventory(
          ele.inventoryStoreId
        );
        if (hotel?.id) {
          this.inventory[hotel.id] = {};
          this.inventory[hotel.id] = hotel;
        }

        let hotelDetails: HotelDetailUiPb = {
          brand: hotel?.propertyRef?.brandName,
          city: `${hotel?.propertyRef?.addressBasic.city}, ${hotel?.propertyRef?.addressBasic.state}`,
          picture: `${hotel?.propertyRef?.imageUrl}`,
          roomCode: ele.roomCode,
          name: hotel?.propertyRef?.name,
        };
        ele.hotelDetails = hotelDetails;
      });
      this.getDisconetedDevices();
    });
  }

  getDisconnectedDevicesArray(data: any) {
    return data;
  }

  getDisconetedDevices() {
    let start = moment()
      .utc()
      .add(5, "hours")
      .add(30, "minutes")
      .subtract(10, "days")
      .format();
    let end = moment().utc().add(5, "hours").add(30, "minutes").format();
    let payload = {
      start,
      end,
    };
    this.disconnectedDevicesPerInventory = {};
    this.anomalies.getDisconnectedDevices(payload).subscribe((data) => {
      this.getAllDisconnectedDevices = data;
      this.populateDisconnected(data);
    });
  }
  getDisconnectedTime(data: any) {
    return moment(data).format("hh:mm");
  }
  getDisconnectedTimeDiff(data: string, data1: any) {
    return this.counter(moment().diff(moment(new Date(data))));
  }
  getPlaceAndPins(data: any) {
    return data;
  }

  counter(potentialAnomalyDetectionTimeDiff: number) {
    let dateTimeInterval;
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
      // duration.add(1, 'minutes');
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

    return dateTimeInterval;
  }

  populateDisconnected(data: any) {
    let room: any;
    let roomIndexMapObject: any;
    if (!room?.length) {
      room = [];
    }
    if (!(roomIndexMapObject && Object.keys(roomIndexMapObject).length)) {
      roomIndexMapObject = {};
    }
    if (data && data.length) {
      data.forEach(async (ele: any) => {
        if (ele.inventoryStoreId) {
          if (!(this.inventory && this.inventory[ele.inventoryStoreId])) {
            const hotel = await this.anomalies.getHotelInventory(
              ele.inventoryStoreId
            );
            this.inventory[hotel.id] = {};
            this.inventory[hotel.id] = hotel;
          }
        }

        if (!this.disconnectedDevicesPerInventory[ele.inventoryStoreId]) {
          this.disconnectedDevicesPerInventory[ele.inventoryStoreId] = [];
        }
        ele.placeAndPins.forEach((item: any, i: number) => {
          const existingRoomPlace = room?.find(
            (r: any) => r.placeCode === item.placeCode
          );
          if (existingRoomPlace) {
            room[roomIndexMapObject[item.placeCode]].pinAndAppliances.push(
              ...item.pinAndAppliances
            );
          } else {
            roomIndexMapObject[item.placeCode] = i;
            room.push({
              placeCode: item.placeCode,
              pinAndAppliances: [...item.pinAndAppliances],
              deviceDisconnectionTime: ele.deviceDisconnectionTime,
            });
          }
        });
        this.disconnectedDevicesPerInventory[ele.inventoryStoreId] = room;
      });
    }
  }
  checkNetworkStatus() {
    this.networkStatus$ = merge(
      of(null),
      fromEvent(window, "online"),
      fromEvent(window, "offline")
    )
      .pipe(map(() => navigator.onLine))
      .subscribe((status) => {
        console.log("status", status);
      });
  }
  updateOnlineStatus() {
    this.isOnline = navigator.onLine;
    if (this.isOnline) {
      location.reload();
    }
  }
}
