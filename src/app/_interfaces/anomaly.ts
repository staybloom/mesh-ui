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
enum AnomalyTrigger {
  NO_ONE_CHECKED_IN = 'NO_ONE_CHECKED_IN',
  TASK_PROLONGED = 'TASK_PROLONGED',
}
enum AnomalyCorrectionType {
  TASK_STARTED = 'TASK_STARTED',
  CONSUMPTION_REDUCED = 'CONSUMPTION_REDUCED',
  ROOM_OCCUPIED = 'ROOM_OCCUPIED',
}
