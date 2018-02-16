import { Component, OnInit } from '@angular/core';
import { StationsService } from '../stations.service';
import { RoutesService } from '../routes.service';
import { Route } from '../model/route';
import { RoutePoint } from '../model/route-point';
import { Subroute } from '../model/subroute';
import * as _ from 'lodash';

@Component({
   selector: 'app-find-conductor',
   templateUrl: './find-conductor.component.html',
   styleUrls: ['./find-conductor.component.css']
})
export class FindConductorComponent implements OnInit {
   vehicleTypeLabels: {[key: string]: string} = {
      bus: "Автобус",
      tram: "Трамвай",
      trolleybus: "Тролейбус",
   };
   selectedVehicleType: string = "bus";
   vehicleTypes: string[] = [];

   routesByVehicleType: { [vehicleType: string]: Route[] } = {};
   routes: Route[] = [];
   selectedRouteId: string;
   selectedRoute: Route;

   subroutes: Subroute[];
   selectedSubrouteIndex: string;
   selectedSubroute: Subroute;

   constructor(private routesService: RoutesService) {
      routesService.getRoutes()
         .subscribe((routes: Route[]): any => {
            for (const route of routes) {
               if (!this.routesByVehicleType[route.vehicleType]) {
                  this.routesByVehicleType[route.vehicleType] = [];
               }

               this.routesByVehicleType[route.vehicleType].push(route);
            }
            for (const vehicleType in this.routesByVehicleType) {
               this.routesByVehicleType[vehicleType]
                  .sort((route1: Route, route2: Route): number => {
                     return parseInt(route1.routeNumber) - parseInt(route2.routeNumber);
                  })
            }
            this.vehicleTypes = Object.keys(this.routesByVehicleType);
            this.routes = this.routesByVehicleType[this.selectedVehicleType];
         });
   }

   onVehicleTypeChanged(selectedVehicleType: string): void {
      this.routes = this.routesByVehicleType[selectedVehicleType];
   }

   onRouteChanged(route: Route): void {
      this.routesService.getRoutePoints(route)
         .subscribe((routePoints: RoutePoint[]): any => {
            this.subroutes = [];
            for (const routePoint of routePoints) {
               if (!this.subroutes[routePoint.subrouteIndex]) {
                  this.subroutes[routePoint.subrouteIndex] = {
                     index: routePoint.subrouteIndex,
                     firstStationName: '',
                     lastStationName: '',
                     routePoints: [],
                  };
               }
               this.subroutes[routePoint.subrouteIndex].routePoints.push(routePoint);
            }
            for (let subroute of this.subroutes) {
               subroute.routePoints = _.sortBy(subroute.routePoints, "index");
               subroute.firstStationName = subroute.routePoints[0].stationName;
               subroute.lastStationName = subroute.routePoints[subroute.routePoints.length - 1].stationName;
            }
            this.selectedSubroute = this.subroutes[0];
            this.selectedSubrouteIndex = this.selectedSubroute.index.toString();
         });
   }

   onSubrouteChanged(subroute: Subroute): void {
      this.selectedSubroute = subroute;
   }

   ngOnInit() {
   }
}
