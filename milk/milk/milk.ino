#include <ESP8266WiFi.h>
#include <WebSocketClient.h>
#include <ArduinoJson.h>
//#include <WiFiClientSecure.h>

const char WIFI_SSID[] = "Pirinsoft";
const char WIFI_PSK[] = "+rqcP3_nnhSH]Yr%";

const int LED_PIN = 5;
const uint8_t GPIO0 = 0;

// GW HTTP client
WiFiClient client;
// GW WS client
WebSocketClient webSocketClient;

// Zapier HTTP client
WiFiClient/*Secure*/ secureClient;

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

//const char fingerprint[] PROGMEM = "5F F1 60 31 09 04 3E F2 90 D2 B0 8A 50 38 04 E8 37 9F BC 76";
//const char fingerprint[] PROGMEM = "AF 21 4A 6C 2C E4 CE 6E 99 7B B8 EA 58 CF 57 6B C2 35 A4 0D";
void setup() {

  Serial.begin(115200);

  pinMode(LED_PIN, OUTPUT);
  pinMode(GPIO0, INPUT);

  connectWiFi();


}



String getJsonField(String json, String field) {
  char* where = strstr(strstr(strstr(json.c_str(), field.c_str()), "\"") + 1, "\"") + 1;
  char dest[200];
  int len = strstr(where, "\"") - where;
  strncpy(dest, where, len);
  dest[len] = '\0';
  String value = String(dest);
  return String(value);
}

void loop() {

  int debug = 0;
  char* host = "35.242.253.103";
  if (debug) {
    host = "192.168.1.201";
  }
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  }

  if (WiFi.status() != WL_CONNECTED) {
    return;
  }

  if (!client.connect(host, 5000)) {
    morse("...  ...  ...  ");
    return;
  }

  webSocketClient.path = "/gw";
  webSocketClient.host = host;
  if (!webSocketClient.handshake(client)) {
    morse("..  ..  ..  ");
    return;
  }

  morse(".  .  .  ");

  String data;
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
  do {
    delay(5000);
    webSocketClient.getData(data);
    morse("...  ...  ...  ");
  }
  while (client.connected() && !data.length());

  String peerId = getJsonField(data, "peer_id");

  /*
  JSON.stringify(
      {
        "domain": "global",
        "type": "create-context",
        "peer_id": peerId,
        "request_id": "1",
        "name": "test",
        "lifetime": "retained"
    });
  */
  data = String("{\"domain\":\"global\",\"type\":\"create-context\",\"peer_id\":\"#peerId#\",\"request_id\":\"1\",\"name\":\"GOT_Extension\",\"lifetime\":\"retained\"}");
  data.replace("#peerId#", peerId);
  webSocketClient.sendData(data);
  do {
    delay(5000);
    webSocketClient.getData(data);
    morse("...  ...  ...  ");
  } while (client.connected() && !data.length());

  String contextId = getJsonField(data, "context_id");

  /*
  JSON.stringify(
    {
        "domain": "global",
        "type": "update-context",
        "request_id": "3",
        "peer_id": "peerId",
        "context_id": "contextId",
        "delta": { state: "true" }
    });
  */
  int state = 1;
  while (client.connected()) {
    data =
      "{\"domain\":\"global\",\"type\":\"update-context\",\"request_id\":\"3\",\"peer_id\":\"#peerId#\",\"context_id\":\"#contextId#\",\"delta\":{\"updated\":{\"milk\":#state#}}}";
    data.replace("#peerId#", peerId);
    data.replace("#contextId#", contextId);

    byte pressed = 0;
    while (client.connected()) {
      pressed = (digitalRead(GPIO0) == LOW);
      if (pressed) {
        break;
      }
      delay(200);
    }

    if (!client.connected()) {
      return;
    }

    if (pressed) {
      state = !state;
    }

    if (debug) {
      webSocketClient.sendData(String(state));
    }

    if (pressed) {
      data.replace("#state#", state ? "true" : "false");

      webSocketClient.sendData(data);
      if (!state) {
        //secureClient.setFingerprint(fingerprint);
        if (secureClient.connect("192.168.1.201", 3000)) {
          secureClient.print(String("GET ") + String("/") + " HTTP/1.1\r\n" +
                             "Connection: close\r\n\r\n\r\n");
          while (secureClient.connected()) {
            String line = secureClient.readStringUntil('\n');
            if (line == "\r") {
              break;
            }
          }
          //morse(".-.  .-.  .-.  .-.  ");
        }
        else {
          morse(".. .. .. .. ");
        }
      }

      digitalWrite(LED_PIN, !state ? HIGH : LOW);

      // drain websocket
      webSocketClient.getData(data);

      while (digitalRead(GPIO0) == LOW) {
        // wait for user to release button
        delay(100);
      }
    }

  }

}