import { ConductorArrival } from './conductor-info';

export interface RoutePoint {
  id: number;
  index: number;
  subrouteIndex: number;
  stationName: string;
  arrivals: ConductorArrival[];
}
