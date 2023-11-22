import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../_config/app.config';
import { map } from 'rxjs';
import { AnomalyDataResponse } from '../_interfaces/anomaly';

@Injectable({ providedIn: 'root' })
export class AnomaliesService {
  public anomaliesDataResponse: AnomalyDataResponse[] = [];
  constructor(private http: HttpClient) {}

  getAnomalies(data: any = {}) {
    return this.http
      .post(
        AppConfig.API_URL + AppConfig.FRONT_END_API.MESH_ACTIVE_ANOMALY,
        data
      )
      .pipe(map((data: any) => data.data));
  }

  getResolvedAnomaly(data: any = {}) {
    return this.http
      .post(
        AppConfig.API_URL + AppConfig.FRONT_END_API.MESH_PLACE_ANOMALY,
        data
      )
      .pipe(map((data: any) => data.data));
  }

  updateAnomaly(data: any = {}) {
    return this.http
      .put(AppConfig.API_URL + AppConfig.FRONT_END_API.MESH_ANOMALY, data)
      .pipe(map((data: any) => data.data));
  }

  getHotelInventory(id: string = '') {
    return this.http
      .get(AppConfig.API_URL + AppConfig.FRONT_END_API.PMS_INVENTORY + id)
      .pipe(map((data: any) => data.data))
      .toPromise();
  }
}
