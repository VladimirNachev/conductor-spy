import { Injectable } from '@angular/core';
import { Station } from './model/station';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class StationsService {

  constructor(private httpClient: HttpClient) { }

  getCloseStations(position: Position): Observable<Station[]> {
    return this.httpClient.get<Station[]>('/api/stations', {
      params: new HttpParams({
        fromObject: {
          longtitude: position.coords.longitude.toString(),
          latitude: position.coords.latitude.toString(),
        }
      })
    });
  }

  reportConductor(station: Station): Observable<Station> {
    return this.httpClient.put<Station>(`/api/stations/${station.id}`, {});
  }
}
