# Smart_Lock_System
Ionic Angular mobile application that is capable of controlling a NodeMCU/Arduino smart lock through a RaspberryPI MQTT Server with biometric authentication.

# Application:
Ionic Angular cross-platform mobile application. The application takes both a fingerprint authentication when communicating with the smart lock, as well as a pin code.
The application uses firebase for account authentication and SQLite to store user information. 
              
# NodeMCU: 
The NodeMCU is the microcontroller used to establish an internet connection and communicating with the MQTT server as well as communicating with the Arduino using I2C                    transmission communication. 

# Arduino: 
The Arduino is responsible for receiving information from the NodeMCU and controlling the stepping motor(or the actual lock).

# Raspberry PI:
The Raspberry PI is used to host an MQTT server that serves as a middle man between the mobile application and the NodeMCU. 
