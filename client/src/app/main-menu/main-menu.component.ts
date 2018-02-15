import { Component, OnInit } from '@angular/core';
import { LocationService } from '../location.service';

@Component({
   selector: 'app-main-menu',
   templateUrl: './main-menu.component.html',
   styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

   public error: string;

   constructor(private locationService: LocationService) { }

   ngOnInit() {
   }

   public onClosestStopsButtonClicked(): void {
      // this.locationService.fetchClosest().then((result: any): void => {
      //    this.error = '';
      //    console.log(result);
      // }).catch((error: any): void => {
      //    this.error = typeof error === 'string' ? error : error.message;
      //    console.error(error);
      // });
   }
}
