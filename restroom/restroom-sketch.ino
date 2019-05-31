//#include <ZSharpIR.h>
//
//#define ir A0
//#define model 20150       //999 user type
//#define DELAY_REFRESH     1000
//ZSharpIR SharpIR(ir, model);
//
//void setup() {
//  Serial.begin(115200);
//
//}
//
//void loop() {
//  // put your main code here, to run repeatedly:
//  Serial.println(SharpIR.distance());
//  delay(DELAY_REFRESH);
//}

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

// =========

#include <ESP8266WiFi.h>

//////////////////////
// WiFi Definitions //
//////////////////////
const char WiFiAPPSK[] = "sparkfun";

/////////////////////
// Pin Definitions //
/////////////////////
const int LED_PIN = 5; // Thing's onboard, green LED
const int ANALOG_PIN = A0; // The only analog pin on the Thing
const int DIGITAL_PIN = 12; // Digital pin to be read

WiFiServer server(80);

void setup() 
{
  initHardware();
  setupWiFi();
  server.begin();
}

void loop() 
{
  // Check if a client has connected
  WiFiClient client = server.available();
  if (!client) {
    return;
  }

  // Read the first line of the request
  String req = client.readStringUntil('\r');
  Serial.println(req);
  client.flush();

  // Match the request
  int val = -1; // We'll use 'val' to keep track of both the
                // request type (read/set) and value if set.
  if (req.indexOf("/led/0") != -1)
    val = 0; // Will write LED low
  else if (req.indexOf("/led/1") != -1)
    val = 1; // Will write LED high
  else if (req.indexOf("/read") != -1)
    val = -2; // Will print pin reads
  // Otherwise request will be invalid. We'll say as much in HTML

  // Set GPIO5 according to the request
  if (val >= 0)
    digitalWrite(LED_PIN, val);

  client.flush();

  // Prepare the response. Start with the common header:
  String s = "HTTP/1.1 200 OK\r\n";
  s += "Content-Type: text/html\r\n\r\n";
  s += "<!DOCTYPE HTML>\r\n<html>\r\n";

  /*Note: Uncomment the line below to refresh automatically
   *      for every 1 second. This is not ideal for large pages 
   *      but for a simple read out, it is useful for monitoring 
   *      your sensors and I/O pins. To adjust the fresh rate, 
   *      adjust the value for content. For 30 seconds, simply 
   *      change the value to 30.*/
  s += "<meta http-equiv='refresh' content='1'/>\r\n";//auto refresh page

  // If we're setting the LED, print out a message saying we did
  if (val >= 0)
  {
    s += "LED is now ";
    s += (val)?"on":"off";
  }
  else if (val == -2)
  { // If we're reading pins, print out those values:
    s += "Analog Pin = ";
    //    s += String(analogRead(ANALOG_PIN));
    s += String((int)( 603.74 * pow(map(analogRead(ANALOG_PIN), 0, (1<<10)-1, 0, 5000)/1000.0, -1.16)));
    s += "<br>"; // Go to the next line.
    s += "Digital Pin 12 = ";
    s += String(digitalRead(DIGITAL_PIN));
  }
  else
  {
    s += "Invalid Request.<br> Try /led/1, /led/0, or /read.";
  }
  s += "</html>\n";

  // Send the response to the client
  client.print(s);
  delay(1);
  Serial.println("Client disonnected");

  // The client will actually be disconnected 
  // when the function returns and 'client' object is detroyed
}

void setupWiFi()
{
  WiFi.mode(WIFI_AP);

  // Do a little work to get a unique-ish name. Append the
  // last two bytes of the MAC (HEX'd) to "Thing-":
  uint8_t mac[WL_MAC_ADDR_LENGTH];
  WiFi.softAPmacAddress(mac);
  String macID = String(mac[WL_MAC_ADDR_LENGTH - 2], HEX) +
                 String(mac[WL_MAC_ADDR_LENGTH - 1], HEX);
  macID.toUpperCase();
  String AP_NameString = "ESP8266 Thing " + macID;

  char AP_NameChar[AP_NameString.length() + 1];
  memset(AP_NameChar, 0, AP_NameString.length() + 1);

  for (int i=0; i<AP_NameString.length(); i++)
    AP_NameChar[i] = AP_NameString.charAt(i);

  WiFi.softAP(AP_NameChar, WiFiAPPSK);
}

void initHardware()
{
  Serial.begin(115200);
  pinMode(DIGITAL_PIN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);
  // Don't need to set ANALOG_PIN as input, 
  // that's all it can be.
}
