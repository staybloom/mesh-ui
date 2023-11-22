import { Component } from '@angular/core';
import {
  AnomalyDataResponse,
  HotelDetailUiPb,
} from 'src/app/_interfaces/anomaly';
import { AnomaliesService } from 'src/app/_services/anomalies.service';
import { SocketService } from 'src/app/_services/socket.service';

@Component({
  selector: 'app-dashboard-landing',
  templateUrl: './dashboard-landing.component.html',
  styleUrls: ['./dashboard-landing.component.scss'],
})
export class DashboardLandingComponent {
  public list: any = [1, 2];
  anomaliesDataResponse: AnomalyDataResponse[] = [];
  constructor(
    private anomalies: AnomaliesService,
    private socket: SocketService
  ) {}
  ngOnInit() {
    this.socket.socket$.subscribe((data) => {
      this.getAnomalies(data);
    });
  }
  async getAnomalies(data: any = {}) {
    let payload = {
      isActive: true,
      clientConnectionId: data.connectionId,
      start: new Date(
        new Date(new Date().setDate(new Date().getDate() - 30)).setHours(
          12,
          0,
          0,
          0
        )
      ),
      end: new Date(new Date().setDate(new Date().getDate())),
    };
    this.anomalies.getAnomalies(payload).subscribe((data) => {
      this.anomaliesDataResponse = data;
      this.anomaliesDataResponse.map(async (ele) => {
        const hotel: any = await this.anomalies.getHotelInventory(
          ele.inventoryStoreId
        );
        console.log(hotel);
        let hotelDetails: HotelDetailUiPb = {
          brand: hotel?.propertyRef?.brandName,
          city: `${hotel?.propertyRef?.addressBasic.city}, ${hotel?.propertyRef?.addressBasic.state}`,
          picture: `${hotel?.propertyRef?.imageUrl}`,
          roomCode: ele.roomCode,
          name: hotel?.propertyRef?.name,
        };
        ele.hotelDetails = hotelDetails;
      });
      console.log(this.anomaliesDataResponse);
    });
  }
  //  async getInventoryDetail(id:string) {
  //     await this.anomalies.getHotelInventory(id)
  //   }
}
