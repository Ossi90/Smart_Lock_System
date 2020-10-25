#include <Wire.h> // Library for I2C connection between the Nodemu and the Arduino
#include <CheapStepper.h> //Library for the stepping motor 
#include <AUnit.h> // Library for unit testing.

CheapStepper stepMOTOR; // Stepping motor object 
boolean motorCW = false; // boolean value used to manage the stepping motor

int transportData = 0; // Varible used to store the I2C data
int switchButton = 2; // button set to pin 2
int switchButtonState = 0; // the state of button is 0;
int redLED= 6; // setting red rgb to pin 6
int greenLED = 5; // setting green rgb to pin 6

void setup() {
  Serial.begin(115200);  //Sets the data rate in bits per second (baud) for serial data transmission  and allows communication with the serial monitor (ctl, shift, m).
  pinMode(redLED, OUTPUT); // pinmode as output
  pinMode(greenLED, OUTPUT);
  pinMode(switchButton, INPUT);
  Wire.begin(8);           // Starts the I2C connection with the address of 8
  Wire.onReceive(I2cData); // call back function that reads incoming data 

}

void I2cData(int bytes) {
  transportData = Wire.read();    // read one character from the I2C // storing the incoming data from the nodemcu
}

void loop() {
  aunit::TestRunner::run();
   switchButtonState = digitalRead(switchButton); // reads if there is any input from button
   analogWrite(redLED, 255); // Led turns on the red light
  if (transportData == 1 ||switchButtonState == HIGH) {  // if there is any I2C data or the button is being pushed
    delay(500);
    openLock(); 
    analogWrite(greenLED, 255); // Led turns on the green light// Calls the toogleMotor method to turn the stepping motor.
    delay(10000);                                        // 10 second delay
    analogWrite(greenLED, 0);                            // Led turns off the green light
    openLock();   
    transportData = 0;                                   // sets the variable back to zero 
  }  
}

int openLock() {              // function the handles the stepping motor.
  
  int steps = 0;
  while (steps <= 2048) {     // 2048 steps is 180° 
    stepMOTOR.step(motorCW);  // while false then rotate clockwise.
    steps++;
  }
  motorCW = !motorCW;         // sets the boolean value to false, making the motor step counter clockwise.
  return steps;
}

test(DataIn){
  assertEqual(transportData,0);
}
test(MotorCW){
  assertEqual(motorCW,false);
  openLock();
  assertEqual(motorCW,true);

}
test(button){
    assertEqual(switchButtonState,LOW);
}

test(motor){
  assertEqual(openLock,2048);
 
}
