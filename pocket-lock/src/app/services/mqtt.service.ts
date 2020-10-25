import { Injectable, OnInit, OnDestroy } from '@angular/core';
//import { Subscription } from 'rxjs';
import { IMqttMessage, MqttService } from 'ngx-mqtt';

@Injectable({
  providedIn: 'root'
})
export class MQTTService  implements OnInit, OnDestroy {
  //private subscription: Subscription;
  appTopic: "lock/mgs";
  message: any;

  constructor(private mqtt: MqttService) { }

  ngOnInit() {}
  
  ngOnDestroy(): void {
   // this.subscription.unsubscribe();
  }

  
  /*MQTTsubscribe() { // This function subscribes to a MQTT topic and returns the message as a string.
    var incommingMsg = "";
    this.subscription = this.mqtt.observe("lock/msg").subscribe((Arduinomsg: IMqttMessage) => {
      this.message = Arduinomsg; 
      
      incommingMsg =  this.message.payload.toString();
   
   
    });
   return incommingMsg;
  }
  */


sendMessageToMQTT(){ // This function is sends out the MQTT message.
    this.mqtt.unsafePublish("lock/msg", "1", { qos: 1, retain: true })
    this.mqtt.unsafePublish("lock/msg", "hello From Mobile Application", { qos: 1, retain: true })
    console.log(this.mqtt);
      return "Open"
  }
}
