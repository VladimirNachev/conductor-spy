import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, } from '@angular/common/http';

@Injectable()
export class LocationService {

   constructor(private http: HttpClient) { }

   public getLocation(): Promise<any> {
      return new Promise((resolve: (result: any) => void, reject: (reason: any) => void): void => {
         if (!navigator.geolocation) {
            reject('Geolocation is not supported by this browser.');
            return;
         }

         navigator.geolocation.getCurrentPosition((position) => {
           resolve(position);
         }, (error: PositionError): void => {
            reject(error);
         });
      });
   }
}
