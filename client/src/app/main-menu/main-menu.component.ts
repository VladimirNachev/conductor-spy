import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
   selector: 'app-main-menu',
   templateUrl: './main-menu.component.html',
   styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

   constructor(private http: HttpClient) { }

   ngOnInit() {
   }

   public fetchClosest() {
      if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition((position) => {
            console.log(position);
            this.http.get('stations', {
               params: new HttpParams({
                  fromObject: {
                     longtitude: position.coords.longitude.toString(),
                     latitude: position.coords.latitude.toString(),
                     accuracy: position.coords.accuracy.toString(),
                  }
               })
            }).subscribe((result: any): void => {
               console.log(result);
            });

         });
      } else {
         console.log('Geolocation is not supported by this browser.');
      }
   }
}
