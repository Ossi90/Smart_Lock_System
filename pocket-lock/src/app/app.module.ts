import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule, AngularFireAuth } from "@angular/fire/auth"
import { environment } from "../environments/environment";
import { SQLite } from '@ionic-native/sqlite/ngx';
import { HttpClientModule } from '@angular/common/http';
import  {LoginPage}  from  "../app/login/login.page";
import * as firebase from 'firebase';
import { MqttModule, IMqttServiceOptions } from "ngx-mqtt";
import { FingerprintAIO } from "@ionic-native/fingerprint-aio/ngx";
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';



export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = { 
  
  hostname: 'raspberrypi',
  protocol: "wss",
  port: 8081,
  path: '/mqtt',
  username: 'MQTT/Lock',
  password: 'Lock4Pocket',
}

firebase.initializeApp(environment.firebase);



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [ MqttModule.forRoot(MQTT_SERVICE_OPTIONS),BrowserModule, IonicModule.forRoot(), AppRoutingModule, AngularFireModule.initializeApp(environment.firebase), AngularFireAuthModule,HttpClientModule],
  providers: [
 
    StatusBar,
    SplashScreen,
    SQLite,
    LoginPage,
    FingerprintAIO,
    SQLitePorter,
    
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
