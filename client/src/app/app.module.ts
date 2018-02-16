import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { ReportConductorComponent } from './report-conductor/report-conductor.component';

import { LocationService } from './location.service';
import { StationsService } from './stations.service';
import { RoutesService } from './routes.service';
import { ConductorArrivalsService } from './conductor-arrivals.service';
import { FindConductorComponent } from './find-conductor/find-conductor.component';
import { DangerIndicatorComponent } from './danger-indicator/danger-indicator.component';
import { DailyStatisticsComponent } from './daily-statistics/daily-statistics.component';

const appRoutes: Routes = [
  {
    path: '',
    component: MainMenuComponent,
  },
  {
    path: 'report',
    component: ReportConductorComponent,
  },
  {
    path: 'find',
    component: FindConductorComponent,
  },
  {
    path: 'statistics',
    component: DailyStatisticsComponent,
  },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainMenuComponent,
    ReportConductorComponent,
    FindConductorComponent,
    DangerIndicatorComponent,
    DailyStatisticsComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [
    LocationService,
    StationsService,
    RoutesService,
    ConductorArrivalsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
