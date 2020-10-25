import { Component, OnInit } from '@angular/core';
import {DatabaseService} from "../../services/database.service";
import * as firebase from 'firebase';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-pin',
  templateUrl: './pin.page.html',
  styleUrls: ['./pin.page.scss'],
})
export class PinPage implements OnInit {
  currentUser:any 
  // user object
  user = {
    pin1: "",
    pin2: "",
    pin3: "",
    pin4: "",
    password :0,
    email: "",
  }

  constructor(private database:DatabaseService,
    private menu: MenuController) { }

  ngOnInit() {  // makes sure that the correct user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
    
      } else {

      }
    });

  }

  async openLock(){  // This function valuates the PIN CODE and if correct, calls the database where the MQTT function is called.
    let pins = "";
    pins += this.user.pin1;
    pins += this.user.pin2;
    pins += this.user.pin3;
    pins += this.user.pin4;
    this.user.password = parseInt(pins);
   
   // this.platform.ready()
  
     await this.database.getID(firebase.auth().currentUser.email).then((id =>{
      this.database.getUserLockCombination(id,this.user.password).then((res =>{
      }))
     }))
     this.changePinFields();
    }

  nextDigit(pin) { // allows the user to automatically move to the next input field when entering PIN
    pin.setFocus();
  }

  changePinFields(){ // clears PIN
    this.user.pin1 = "";
    this.user.pin2 = "";
    this.user.pin3 = "";
    this.user.pin4 = "";
  }

  openMenu(){ // sideMenu
    this.menu.enable(true, "pin");
 this.menu.open("pin");
  }

}
