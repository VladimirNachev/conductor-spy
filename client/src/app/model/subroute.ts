import { RoutePoint } from './route-point';

export interface Subroute {
  index: number;
  firstStationName: string;
  lastStationName: string;
  routePoints: RoutePoint[];
}
