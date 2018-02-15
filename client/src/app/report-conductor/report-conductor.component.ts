import { Component, OnInit } from '@angular/core';
import { Station } from '../model/station';
import { StationsService } from '../stations.service';
import { LocationService } from '../location.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-report-conductor',
  templateUrl: './report-conductor.component.html',
  styleUrls: ['./report-conductor.component.css']
})
export class ReportConductorComponent implements OnInit {
  stations: Station[] = undefined;

  constructor(
    stationsService: StationsService,
    locationService: LocationService
  ) {
    locationService.getLocation()
      .then((location: Position) => stationsService.getCloseStations(location))
      .then((stations$: Observable<Station[]>) => {
        stations$.subscribe((stations: Station[]) => this.stations = stations);
      });
  }

  ngOnInit() {
  }

}
