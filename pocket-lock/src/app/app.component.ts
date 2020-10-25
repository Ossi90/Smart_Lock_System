import { Component } from '@angular/core';
import * as firebase from "firebase";
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menu: MenuController,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  
  logout(){
    console.log("here");
    firebase.auth().signOut();
  }

  openMenu(){
    this.menu.enable(true, "outAPP");
 this.menu.open("outAPP")
  }

  openFingerMenu(){
    this.menu.enable(true, "finger");
 this.menu.open("finger")
  }
}
