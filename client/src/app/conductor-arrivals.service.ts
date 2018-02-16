import { Injectable } from '@angular/core';
import { ConductorArrival } from './model/conductor-arrival';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ConductorArrivalsService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<ConductorArrival[]> {
    return this.httpClient.get<ConductorArrival[]>("/api/conductorArrivals");
  }

  markConductor(conductorArrival: ConductorArrival): Observable<ConductorArrival> {
    console.log("conductorArrival =", conductorArrival);
    return this.httpClient.get<ConductorArrival>('/api/conductorArrivals', {
      params: new HttpParams({
        fromObject: {
          arrivalTime: conductorArrival.arrivalTime.toString(),
          stationId: conductorArrival.stationId.toString(),
        }
      })
    });
  }

}
