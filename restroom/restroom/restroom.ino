#include <ESP8266WiFi.h>
#include <WebSocketClient.h>
#include <ArduinoJson.h>

const char WIFI_SSID[] = "Pirinsoft";
const char WIFI_PSK[] = "+rqcP3_nnhSH]Yr%";

const int LED_PIN = 5;
const int ANALOG_PIN = A0; // The only analog pin on the Thing

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
  int state = -1;
  while (client.connected()) {
    data = 
      "{\"domain\":\"global\",\"type\":\"update-context\",\"request_id\":\"3\",\"peer_id\":\"#peerId#\",\"context_id\":\"#contextId#\",\"delta\":{\"updated\":{\"restrooms\":{\"3MLEFT\":#state#}}}}";
    data.replace("#peerId#", peerId);
    data.replace("#contextId#", contextId);
  
    int mappedValue = (int)(603.74 * pow(map(analogRead(ANALOG_PIN), 0, (1<<10)-1, 0, 5000)/1000.0, -1.16));
    int newState = mappedValue < 900;
    if (debug) {
      webSocketClient.sendData(String(mappedValue));
    }
    if (state != newState) {
      state = newState;

      data.replace("#state#", state ? "true" : "false");

      digitalWrite(LED_PIN, state ? HIGH : LOW);

      webSocketClient.sendData(data);

      // drain websocket
      webSocketClient.getData(data);
    }
    delay(2000);
  }

}
