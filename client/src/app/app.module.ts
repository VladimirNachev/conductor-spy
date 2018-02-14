import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material/material.module';


import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { HttpClientModule } from '@angular/common/http';
import { LocationService } from './location.service';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainMenuComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    HttpClientModule,
  ],
  providers: [LocationService,],
  bootstrap: [AppComponent,]
})
export class AppModule { }
