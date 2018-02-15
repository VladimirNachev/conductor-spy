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

const appRoutes: Routes = [
  {
    path: '',
    component: MainMenuComponent,
  },
  {
    path: 'report',
    component: ReportConductorComponent,
  },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainMenuComponent,
    ReportConductorComponent,
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
