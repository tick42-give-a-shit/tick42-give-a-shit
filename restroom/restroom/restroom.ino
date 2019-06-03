#include <ESP8266WiFi.h>
#include <WebSocketClient.h>

const char WIFI_SSID[] = "Pirinsoft";
const char WIFI_PSK[] = "+rqcP3_nnhSH]Yr%";

const int LED_PIN = 5;

WiFiClient client;
WebSocketClient webSocketClient;


void connectWiFi() {

  Serial.print("connecting");
  byte led_status = 0;

  // Set WiFi mode to station (client)
  WiFi.mode(WIFI_STA);

  WiFi.begin(WIFI_SSID, WIFI_PSK);

  // Blink LED while we wait for WiFi connection
  while ( WiFi.status() != WL_CONNECTED ) {
    digitalWrite(LED_PIN, led_status);
    led_status ^= 0x01;
    delay(100);
  }

  // Turn LED off when we are connected
  digitalWrite(LED_PIN, HIGH);
  Serial.print("done");

}

void setup() {

  Serial.begin(115200);

  pinMode(LED_PIN, OUTPUT);

  connectWiFi();

}

void morse(String str) {
  digitalWrite(LED_PIN, LOW);
  delay(500);
  for (int ii = 0; ii < str.length(); ++ii) {
    if (str.charAt(ii) == '.') {
      digitalWrite(LED_PIN, HIGH);
      delay(300);
      digitalWrite(LED_PIN, LOW);
      delay(500);
    } else if (str.charAt(ii) == '-') {
      digitalWrite(LED_PIN, HIGH);
      delay(1000);
      digitalWrite(LED_PIN, LOW);
      delay(500);
    } else {
      delay(1000);
    }
  }
}

void loop() {

  if (WiFi.status() == WL_CONNECTED) {

    if (!client.connect("192.168.1.201", 5000)) {
      morse("...  ...  ...  ");
      return;
    }

    // Handshake with the server
    webSocketClient.path = "/gw";
    webSocketClient.host = "192.168.1.201";
    if (!webSocketClient.handshake(client)) {
      morse("..  ..  ..  ");
      return;
    }
    
    morse(".  .  .  ");

    String data;
    webSocketClient.getData(data);
    /*
    JSON.stringify(
        {
            type: "hello",
            request_id: "0",
            domain: "global",
            identity: {
                application: "tick42-got-sensor"
            },
            authentication: {
                method: "secret",
                login: "tick42_got",
                secret: "secret"
            },
        });
    */
    data = String("{\"type\":\"hello\",\"request_id\":\"0\",\"domain\":\"global\",\"identity\":{\"application\":\"tick42-got-sensor\"},\"authentication\":{\"method\":\"secret\",\"login\":\"tick42_got\",\"secret\":\"secret\"}}");
    webSocketClient.sendData(data);
    delay(2000);
  
  }
    /*String url = "/";

    client.print(String("GET ") + url + " HTTP/1.1\r\n" +
                 "Connection: close\r\n\r\n");*/
    /*
    while (client.connected()) {
      String line = client.readStringUntil('\n');
      if (line == "\r") {
        Serial.println("headers received");
        break;
      }
    }
    */
    /*
    String line = client.readStringUntil('\n');
    if (line.startsWith("{\"state\":\"success\"")) {
      Serial.println("esp8266/Arduino CI successfull!");
    } else {
      Serial.println("esp8266/Arduino CI has failed");
    }
    Serial.println("reply was:");
    Serial.println("==========");
    Serial.println(line);
    Serial.println("==========");
    Serial.println("closing connection");
      }
    */

}
