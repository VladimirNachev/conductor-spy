import { Route } from './route';
import { ConductorInfo } from './conductor-info';

export interface Station {
  id: number;
  name: string;
  distance: number;
  conductors: ConductorInfo[];
}
