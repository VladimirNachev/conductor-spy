import { Component, OnInit } from '@angular/core';
import { Station } from '../model/station';
import { StationsService } from '../stations.service';
import { LocationService } from '../location.service';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

interface ExtendendStation extends Station {
  marked: boolean;
}

@Component({
  selector: 'app-report-conductor',
  templateUrl: './report-conductor.component.html',
  styleUrls: ['./report-conductor.component.css']
})
export class ReportConductorComponent implements OnInit {
  stations: ExtendendStation[] = undefined;

  constructor(
    private stationsService: StationsService,
    private locationService: LocationService
  ) {
    locationService.getLocation()
      .then((location: Position) => stationsService.getCloseStations(location))
      .then((stations$: Observable<ExtendendStation[]>) => {
        stations$.subscribe((stations: Station[]) => {
          console.log("stations =", stations);
          return this.stations = stations.map((station: Station): ExtendendStation => {
            return _.extend(station, { marked: false });
          });
        });
      });
  }

  private reportConductor(station: ExtendendStation): void {
    console.log("station.service activateddddddddddddddddddddddddd");
    station.marked = true;
    this.stationsService.reportConductor(station)
      .subscribe((station: Station): any => {

      }, (error: any): void => {
        station.marked = false;
      });
  }

  ngOnInit() {
  }

}
