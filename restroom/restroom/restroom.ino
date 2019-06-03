#include <ESP8266WiFi.h>
#include <WebSocketClient.h>
#include <ArduinoJson.h>

const char WIFI_SSID[] = "Pirinsoft";
const char WIFI_PSK[] = "+rqcP3_nnhSH]Yr%";

const int LED_PIN = 5;

int state = 1;

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

  String host = "35.242.253.103";
  // String host = "192.168.1.201";
  if (WiFi.status() == WL_CONNECTED) {

    if (!client.connect(host, 5000)) {
      morse("...  ...  ...  ");
      return;
    }

    // Handshake with the server
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
    while (!data.length());

    String peerId = getJsonField(data, "peer_id");
    /*StaticJsonDocument<500> jsonBuffer1;
    DeserializationError error1 = deserializeJson(jsonBuffer1, data);
    if (error1) {
      webSocketClient.sendData(error1.c_str());
      return;
    }*/

    /*String peerId = String((const char*)jsonBuffer1["peer_id"]);
    //String token = root["access_token"];
    return;*/

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
    data = String("{\"domain\":\"global\",\"type\":\"create-context\",\"peer_id\":\"#peerId#\",\"request_id\":\"1\",\"name\":\"milk\",\"lifetime\":\"retained\"}");
    data.replace("#peerId#", peerId);
    webSocketClient.sendData(data);
    do {
      delay(5000);
      webSocketClient.getData(data);
      morse("...  ...  ...  ");
    }
    while (!data.length());

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
    data = 
      "{\"domain\":\"global\",\"type\":\"update-context\",\"request_id\":\"3\",\"peer_id\":\"#peerId#\",\"context_id\":\"#contextId#\",\"delta\":{\"state\":#state#}}";
    data.replace("#peerId#", peerId);
    data.replace("#contextId#", contextId);
    data.replace("#state#", state ? "true" : "false");
    state ^= 1;
    webSocketClient.sendData(data);
    delay(5000);

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
