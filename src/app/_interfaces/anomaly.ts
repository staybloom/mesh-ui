export interface AnomalyDataResponse {
  id?: string;
  webSocketId?: string;
  propertyId?: string;
  inventoryStoreId?: string;
  roomCode?: string;
  deviceName?: string;
  anomalyPushedTime?: Date;
  isAnomalyCorrected?: Boolean;
  anomalyCorrectedTime?: Date;
  anomalyCorrectionType?: AnomalyCorrectionType;
  anomalyTrigger?: AnomalyTrigger;
  potentialAnomalyDetectionTime?: Date | string | number;
  isActive?: Boolean;
  reason?: String;
  //UI
  conId?: string;
  counter?: string;
  hotelDetails?: HotelDetailUiPb;
}
export interface HotelDetailUiPb {
  brand?: string;
  city?: string;
  name?: string;
  picture?: string;
  roomCode?: string;
}
export enum AnomalyTrigger {
  VACANT = 'VACANT',
  TASK_PROLONGED = 'TASK_PROLONGED',
}
export enum AnomalyCorrectionType {
  TASK_STARTED = 'TASK_STARTED',
  CONSUMPTION_REDUCED = 'CONSUMPTION_REDUCED',
  ROOM_OCCUPIED = 'ROOM_OCCUPIED',
}

export enum AnomlayAction {
  ANOMALY_RESOLVED = 'ANOMALY_RESOLVED',
  ROOM_CONNECTED = 'ROOM_CONNECTED',
  ROOM_DISCONNECTED = 'ROOM_DISCONNECTED',
  ANOMALY_TRIGGER = 'ANOMALY_TRIGGER',
}

export interface PinAndAppliance {
  pin: string;
  device: string;
  deviceId: string;
  connectionStatus: string;
}

export interface PlaceAndPin {
  placeType: string;
  placeCode: string;
  pinAndAppliances: PinAndAppliance[];
}

export interface PlaceConnectionFeed {
  inventoryStoreId: string;
  vendorPropertyId: number;
  deviceId: string;
  deviceName: string;
  placeAndPins: PlaceAndPin[];
  deviceConnectionStatus: string;
  deviceDisconnectionTime: number;
  deviceReconnectionTime: number;
}

export interface RoomConnectedResponse {
  action: string;
  placeConnectionFeed: PlaceConnectionFeed;
  status: string;
}
