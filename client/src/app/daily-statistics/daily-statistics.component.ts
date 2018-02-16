import { Component, OnInit } from '@angular/core';
import { ConductorArrival } from '../model/conductor-arrival';
import { ConductorArrivalsService } from '../conductor-arrivals.service';
import { Station } from '../model/station';

@Component({
  selector: 'app-daily-statistics',
  templateUrl: './daily-statistics.component.html',
  styleUrls: ['./daily-statistics.component.css']
})
export class DailyStatisticsComponent implements OnInit {
  private arrivals: ConductorArrival[] = [];

  constructor(private conductorArrivalsService: ConductorArrivalsService) {
    conductorArrivalsService.getAll()
      .subscribe((conductorArrivals: ConductorArrival[]): any => {
        this.arrivals = conductorArrivals;
      })
  }

  arrivalsTo(station: Station): ConductorArrival[] {
    return this.arrivals.filter((arrival: ConductorArrival) => arrival.stationId === station.id );
  }

  ngOnInit() {
  }

}
