import { Component, OnInit } from '@angular/core';
import {DatabaseService} from "../services/database.service";
import { MenuController } from '@ionic/angular';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
// user object
user={
password: 0,
pin1:"",
pin2:"",
pin3:"",
pin4:"",
}
  
  constructor(
    private database:DatabaseService,
    private menu: MenuController) { }

  ngOnInit() {
    alert("The default PIN code can be found at the back of the Lock");
    this.database.getDatabaseState().subscribe();
  }
  
async enterDefaultPIN(){  // this function calls the database to see if the default pin is correct
  let pins = "";
  pins += this.user.pin1;
  pins += this.user.pin2;
  pins += this.user.pin3;
  pins += this.user.pin4;
  this.user.password = parseInt(pins);
  this.changePinFields()
 await this.database.getDefaultLockPW(this.user.password);


 } 
 nextDigit(pin) { // allows the user to automatically move to the next input field
  pin.setFocus();
}

changePinFields(){
  this.user.pin1 = "";
  this.user.pin2 = "";
  this.user.pin3 = "";
  this.user.pin4 = "";
}

openMenu(){ // sidebar
  this.menu.enable(true, "register");
this.menu.open("register")
}
}



