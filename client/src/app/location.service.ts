import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, } from '@angular/common/http';

@Injectable()
export class LocationService {

   constructor(private http: HttpClient) { }

   public fetchClosest(): Promise<any> {
      return new Promise((resolve: (result: any) => void, reject: (reason: any) => void): void => {
         if (!navigator.geolocation) {
            reject('Geolocation is not supported by this browser.');
            return;
         }

         navigator.geolocation.getCurrentPosition((position) => {
            console.log(position);
            this.http.get('api/stations', {
               params: new HttpParams({
                  fromObject: {
                     longtitude: position.coords.longitude.toString(),
                     latitude: position.coords.latitude.toString(),
                     accuracy: position.coords.accuracy.toString(),
                  }
               })
            }).subscribe((result: any): void => {
               resolve(result);
            });
         }, (error: PositionError): void => {
            reject(error);
         });
      });
   }

}
