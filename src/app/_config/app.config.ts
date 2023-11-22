import { environment } from '../../environments/environment';

export const AppConfig = Object.freeze({
  API_URL: environment.apiURL,

  FRONT_END_API: {
    MESH_ANOMALY: 'mesh/anomaly',
    MESH_ACTIVE_ANOMALY: 'mesh/active/anomaly',
    MESH_PLACE_ANOMALY: 'mesh/place/anomaly',
    PMS_INVENTORY: 'pms/inventory/',
  },
});
