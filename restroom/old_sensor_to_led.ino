

// =========

/*********
  Rui Santos
  Complete project details at https://randomnerdtutorials.com  
*********/
//
//#define ESP8266_LED 5
//
//const int analogInPin = A0;  // ESP8266 Analog Pin ADC0 = A0
//
//int sensorValue = 0;  // value read from the pot
//int outputValue = 0;  // value to output to a PWM pin
//
//int initialValue = 0;
//int laterValue = 0;
//
//void setup() {
//  pinMode(ESP8266_LED, OUTPUT);
//  // initialize serial communication at 115200
//  Serial.begin(115200);
//  initialValue = analogRead(analogInPin);
//}
//
//void loop() {
//  // read the analog in value
//  sensorValue = analogRead(analogInPin);
//
//  laterValue = analogRead(analogInPin);
//
//  if (initialValue - laterValue > 20 || laterValue - initialValue > 20) {
//    digitalWrite(ESP8266_LED, HIGH);
//  } else {
//    digitalWrite(ESP8266_LED, LOW);
//  }
//  
//  // map it to the range of the PWM out
//  outputValue = map(sensorValue, 0, 1024, 0, 255);
//  
//  // print the readings in the Serial Monitor
//  Serial.print("sensor = ");
//  Serial.print(sensorValue);
//  Serial.print("\t output = ");
//  Serial.println(outputValue);
//
//  delay(1000);
//}
