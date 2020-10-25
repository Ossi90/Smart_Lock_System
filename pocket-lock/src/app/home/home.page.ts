import { Component, OnInit } from '@angular/core';
import {FingerprintAIO} from "@ionic-native/fingerprint-aio/ngx"
import {MQTTService} from "../services/mqtt.service"
import { MenuController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

user = {
  password :"",
  email: ""

}
  constructor( 
    private fingerPrint: FingerprintAIO,
    private MQTT: MQTTService,
    private menu: MenuController) {
    
      
  }

  ngOnInit() {
   
  }

// This function activates the biometric reader and takes fingerprint input 
  async openWithFingerPrint(){
    this.fingerPrint.isAvailable().then((fingerPrintResults: any) => {
      console.log(fingerPrintResults);
      this.fingerPrint.show({
        title: 'ALock FingerPrint',
        subtitle: " ", 
        description: "Biometric Authentication Needs To Be Activated On Your Device",
        cancelButtonTitle: "Cancel..",
        disableBackup: true,
      })
        .then((result: any) => {
          console.log(result);
      try{
        this.MQTT.sendMessageToMQTT();   
    /**  The commented code within this code block was used to perform the time performance test   
     * 
         let startOut = performance.now();
         let x =0;
        while(x<80){
        let startIn = performance.now();
        this.MQTT.sendMessageToMQTT(); // sends MQTT message 
        this.MQTT.MQTTsubscribe(); 
         let endIN = performance.now();
       
        console.log(`Time Performance nr ${x}: ${endIN-startIn}`)
        
           x++;

         }

       let endOut = performance.now();
       console.log(`Time Of Test : ${endOut-startOut}`)
       var start = new Date().getTime();
  
       );
       var end = new Date().getTime();
       console.log(end-start);     **/   
        }catch(e){
          alert(e);
        }
        
        })
        .catch((error: any) => {
        console.log(error)
        });
    })
      .catch((error: any) => {
        console.log(error)
      });
  }

  openMenu(){ // side menu 
    this.menu.enable(true, "finger");
 this.menu.open("finger")
  }
}
