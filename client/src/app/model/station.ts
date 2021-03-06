import { ConductorArrival } from './conductor-info';

export interface Station {
  id: number;
  name: string;
  distance: number;
  arrivals: ConductorArrival[];
}
