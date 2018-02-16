import { Injectable } from '@angular/core';
import { Route } from './model/route';
import { RoutePoint } from './model/route-point';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RoutesService {

  constructor(private httpClient: HttpClient) { }

  getRoutes(): Observable<Route[]> {
    return this.httpClient.get<Route[]>('/api/routes');
  }

  getRoutePoints(route: Route): Observable<RoutePoint[]> {
    return this.httpClient.get<RoutePoint[]>(`/api/routes/${route.id}/points`);
  }

}
