#include <Wire.h>         // Library for I2C connection between the Nodemu and the Arduino
#include <ESP8266WiFi.h>  // A library contaiting esp8266 WiFi features
#include <PubSubClient.h> // Library containgin MQTT feature for both subcriper and publisher
#include <AUnit.h> // Library for Unit Testing
#define ssid "YOUR SSID"              // network name
#define wifi_pswrd "YOUR WIFI PASSWORD"   // network password

#define mqttServer "raspberrypi"  // hostname of the MQTT server
#define mqttPort 8883             // the raspberry pi uses port 1883

#define msgIN "lock/msg" //subscripe to topic 
#define msgOut"lock/msg" // publich to topic 
#define userName "MQTT/Lock"
#define pswrd "Lock4Pocket"
String message = "";

WiFiClient NodeMCU;     //creating a client to be used for the MQTT
PubSubClient client;    // creating a client object.

const char* cert = \ 
"-----BEGIN CERTIFICATE-----\n" \
"MIIEETCCAvmgAwIBAgIUAw+K6RUF/F0prHVqMcYcRfpRIHUwDQYJKoZIhvcNAQEL\n" \
"BQAwgZcxCzAJBgNVBAYTAlNFMRgwFgYDVQQIDA9WYXN0cmEgR290YWxhbmQxEzAR\n" \
"BgNVBAcMCkdvdGhlbmJ1cmcxDzANBgNVBAoMBkEtTG9jazENMAsGA1UECwwETVFU\n" \
"VDEUMBIGA1UEAwwLcmFzcGJlcnJ5cGkxIzAhBgkqhkiG9w0BCQEWFG9ybmhhcmFs\n" \
"ZHNAZ21haWwuY29tMB4XDTIwMDcxNzIwMzc1M1oXDTI1MDcxNzIwMzc1M1owgZcx\n" \
"CzAJBgNVBAYTAlNFMRgwFgYDVQQIDA9WYXN0cmEgR290YWxhbmQxEzARBgNVBAcM\n" \
"CkdvdGhlbmJ1cmcxDzANBgNVBAoMBkEtTG9jazENMAsGA1UECwwETVFUVDEUMBIG\n" \
"A1UEAwwLcmFzcGJlcnJ5cGkxIzAhBgkqhkiG9w0BCQEWFG9ybmhhcmFsZHNAZ21h\n" \
"aWwuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu746nCd5+Xj2\n" \
"lwgCGE/UkRnTfLh3lprBHSORACGVu6xCwL0wqyJANwnisf+hR//Tl5DautoxbP0p\n" \
"R7T/PAvyvUUzh7/vm7AtQdLJ8iTUof3IduaTpydt+56q6y9WO7m9VpM9NFXD02/j\n" \
"Th681Y5I/EuspKE+qU6gMMO5ZpXhvN/ZpGQANYMhp58AaINa1OW1Rmlu6gXeCrl0\n" \
"z9YWP1YwaevKi/5osPoiw1EncxpQSW14JYb5oZkaY0TvEvwaWybz/FCY+RuMx3Ka\n" \
"1/vPoUDGr7U/aCt206HrBOOJXy+kvlYCVv9rZzpK2W8Ke+jdCucIhSkmWld9OCE6\n" \
"wyOsGXXPlwIDAQABo1MwUTAdBgNVHQ4EFgQUbrXhM6XhovcVGsBOsD6GH0QjGIMw\n" \
"HwYDVR0jBBgwFoAUbrXhM6XhovcVGsBOsD6GH0QjGIMwDwYDVR0TAQH/BAUwAwEB\n" \
"/zANBgkqhkiG9w0BAQsFAAOCAQEAfDJhOorFkYD9rUGRFcONQYWzQaSyN3n2Ryh2\n" \
"OYxbEMBOFIC+DXruYwxrurFTs0r/4zaLzAu3vNQwsUdS2aF4yq+XMwr822LBAPcl\n" \
"gm54HPXY5oD/AbsJzHF4Vvyzyax33tzAh5AtB6JkJ/Rf5GmE+761XBR/Sgc+paAf\n" \
"MtKqurHtq3EUFvJry6Tca8EVHDx4MJ2wZhDUZZnAtfyD547KnDv0QYK2EN1hmryR\n" \
"XO9PnG3SX7KoHC+Mz9ZGXwbksjnbPxuq489quvb/QKEct6u/sJbdLKd2+ZQgnhRg\n" \
"FwjfJw2PzNaBMRqY6ug9zQu+DFB2rcpETmDuGA3LIz2f99sUeQ==\n" \
"-----END CERTIFICATE-----\n";


void setup() {
  Serial.begin(9600);         //Sets the data rate in bits per second (baud) for serial data transmission  and allows communication with the serial monitor (ctl, shift, m).
  Wire.begin(D1, D2);         // the I2C transmission starts on pins D1 and D2 on the NodeMcu
  WIFI();                     // This function is responsible for connecting the NodeMCU to the wifi
  //NodeMCU.setCACert(ca_cert);
  client.setClient(NodeMCU);              // sets the wifi client as a mqtt client
  client.setServer(mqttServer, mqttPort); // set the mqtt server
  client.setCallback(mqttDataIN);         // this is callback function that allows the NodeMCU to read incoming data.
}

void WIFI() {
  WiFi.begin(ssid, wifi_pswrd);               // tries to connect to the wifi
  Serial.print("trying to connect to WIFI");
  while (WiFi.status() != WL_CONNECTED) {     // while the wifi is not connected.
    delay(500);
    Serial.print("Trying to Connect To: ");
    Serial.print(ssid);
    Serial.println(" Local Network.");
  }
  Serial.println("");
  Serial.print("NodeMCU IP address: ");
  Serial.println(WiFi.localIP()); // prints out the NodeMCU IP address
}

void mqttConnection () {                                                // this function connects the NodeMCU to the MQTT server
  while (!client.connected()) {                                         // loops until the nodemcu is connected to the mqtt server
    if (client.connect("NodeMCU",userName, pswrd)) {                    // if connected
      Serial.println("Connected to Raspberry PI MQTT Server!");
   
      client.subscribe("lock/msg");                                     // subcripes to the topic
    } else {  
      Serial.print("Error State: ");
      Serial.println(client.state());                                     // if not connected then prints error message.
      delay(5000);
    }
  }
}

void talkToSlave() {                           // this function sends message to the slave arduino
  Serial.println("Sending Order to Arduino");
  Wire.beginTransmission(8);                   // starts transmission on address 8
  Wire.write(1);                               // sends the integer 1 to the slave Arduino
  Wire.endTransmission();                       // closes the transmission

}

void mqttDataIN(char* msg, byte* payload, unsigned int length) {// This function is used as a argument for the client callback function. This function is responsible to read messages comming in from the MQTT server.
 Serial.print("Message: ");
  for (int i = 0; i < length; i++) {
    char messageComingIN = (char)payload[i];                   // the char is set to each letter comming through
    Serial.print(messageComingIN);
    message += messageComingIN;
    if (messageComingIN == '1') 
      talkToSlave();                                          // the the message is 1 then the function talkToSlave() is called.

  } yield();                                                  // allowes the NodeMCU to focus on the wifi and mqtt connection while looping through the for loop.
Serial.println();
}

void loop() {
 aunit::TestRunner::run();
  if (!client.connected()) { // if MQTT server is not connected then try to connect
    mqttConnection();
  }
   aunit::TestRunner::run();
  client.loop();             // maintains connection and communication to the MQTT server
  delay(1000);               // 1 minute delay
}

test(WIFI_Connected){
  assertEqual(WiFi.status(),WL_CONNECTED);
}

test(IP){
  assertEqual(WiFi.localIP().toString(),"192.168.1.75"); 
}

test(ClientConnected){
  assertEqual(client.connected(), true);
}

test(clientState){
 assertEqual(client.state(),0);
}

test(MQTT_Subscripe){
  assertEqual(message,"hello From Mobile Application");
}
