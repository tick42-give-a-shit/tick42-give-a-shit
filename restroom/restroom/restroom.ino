#define TCP_MSS 1500
#include <ESP8266WiFi.h>
#include <WebSocketClient.h>

int reqId = 3;
int tick = 0;
const int debug = 0;
const int refreshDelay = 100;
const String toiletId = "MR3";

/*
const char WIFI_SSID[] = "trustingwolves";
const char WIFI_PSK[] = "Athena8911;";
char* gwHost = "192.168.0.3";

int gwPort = 8385;
/*/

char* gwHost = "dock01.tick42.com";
// char* gwHost = "zapdev1.tick42.com"; //35.242.253.103";
// char* gwHost = "192.168.0.221";
const char WIFI_SSID[] = "Pirinsoft";
const char WIFI_PSK[] = "+rqcP3_nnhSH]Yr%";
// int gwPort = 5000;
int gwPort = 8389;
//*/


const int LED_PIN = 5;
const int ANALOG_PIN = A0; // The only analog pin on the Thing

WiFiClient client;
WebSocketClient webSocketClient;

String getJsonField(String json, String field);
void connectWiFi();
void morse(String str);

void setup() {

  Serial.begin(115200);

  pinMode(LED_PIN, OUTPUT);

}

void loop() {

  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  }

  if (WiFi.status() != WL_CONNECTED) {
    return;
  }

  if (debug) Serial.println("CONNECTING TO " + String(gwHost));
  
  if (!client.connect(gwHost, gwPort)) {
    
    morse("...  ...  ...  ");
    return;
  }

  if (debug) Serial.println("CONNECTED " + String(gwHost) + ":" + String(gwPort));

  webSocketClient.path = "/gw";
  webSocketClient.host = gwHost;
  if (!webSocketClient.handshake(client)) {
    morse("..  ..  ..  ");
    return;
  }

  if (debug) Serial.println("HANDSHAKE");

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

  data = String("{\"type\":\"hello\",\"request_id\":\"0\",\"domain\":\"global\",\"identity\":{\"application\":\"tick42-got-sensor\"},\"authentication\":{\"method\":\"secret\",\"login\":\"vnikolov\",\"secret\":\"\"}}");
  webSocketClient.sendData(data);

  if (debug) Serial.println("SENT HELLO");
  do {
    delay(5000);
    webSocketClient.getData(data);
    morse("...  ...  ...  ");
    if (debug) Serial.println(String("(1) GOT ") + String(data.length()) + String(" bytes"));
  }
  while (client.connected() && !data.length());

  if (debug) Serial.println("GOT WELCOME");

  String peerId = getJsonField(data, "peer_id");

  if (debug) Serial.println("GOT PEER ID" + peerId);

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

  if (debug) Serial.println("SENT CREATE CONTEXT ");
  do {
    delay(5000);
    webSocketClient.getData(data);
    morse("...  ...  ...  ");
  } while (client.connected() && !data.length());
  String contextId;
  do {
    delay(5000);
    webSocketClient.getData(data);
    morse("...  ...  ...  ");
    if (debug) Serial.println(String("(2) GOT ") + String(data.length()) + String(" bytes ") + data);
    contextId = getJsonField(data, "context_id");
    String name = getJsonField(data, "name");
    if (!contextId.length()){ continue; }
    if (name == String("GOT_Extension") || !name.length()) { break; }
  }
  while (client.connected());

  if (!contextId.length()) return;
  
  if (debug) Serial.println("GOT CONTEXT ID " + contextId);

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
  int occupied = -1;
  int score = 0;
  while (client.connected()) {
    int got = analogRead(ANALOG_PIN);
    int mappedValue = (int)(603.74 * pow(map(got, 0, (1<<10)-1, 0, 5000)/1000.0, -1.16)) * 6;
    int newOccupied = mappedValue < 900;
    if (debug) Serial.println("RAW: " + String(got));
    if (debug) Serial.println("MAPPED: " + String(mappedValue));
    int mod = (tick % (60*1000/refreshDelay));
    //if (debug) Serial.println("mod " + String(mod));
    if (debug) {
      // webSocketClient.sendData(String(mappedValue));
    }
    tick += 1;

    // update at least once a minute
    if (occupied != newOccupied || mod == 1) {

      if (debug) Serial.println("score " + String(score));
      if (debug) Serial.println("occupied " + String(occupied));
      if (debug) Serial.println("newOccupied " + String(newOccupied));
      
      if (newOccupied) {
        score = 10000 / refreshDelay;
      } else {
        score -= 1;
        if (score > 0 && mod != 1) {
          delay(refreshDelay);
          continue;
        }
        if (score < -1) {
          score = -1;
        }
      }
      if (debug) Serial.println("score2 " + String(score));
      
      data =
        "{\"domain\":\"global\",\"type\":\"update-context\",\"request_id\":\"#reqId#\",\"peer_id\":\"#peerId#\",\"context_id\":\"#contextId#\",\"delta\":{\"updated\":{\"restrooms\":{\"#toiletId#\":{\"occupied\":#occupied#,\"tick\":#tick#}}}}}";
      data.replace("#toiletId#", toiletId);
      data.replace("#peerId#", peerId);
      data.replace("#contextId#", contextId);
      data.replace("#tick#", String(tick));
      data.replace("#reqId#", String(reqId++));
      
      occupied = score > 0;

      data.replace("#occupied#", occupied ? "true" : "false");

      if (debug) Serial.println("data " + String(data));

      digitalWrite(LED_PIN, occupied ? HIGH : LOW);

      if (debug) Serial.println("SENDING DATA");
      webSocketClient.sendData(data);
      
      if (debug) Serial.println("SENT DATA");
      
      // drain websocket
      webSocketClient.getData(data);
      
      if (debug) Serial.println("GOT RESPONSE");
    }

    delay(refreshDelay);
  }

}



void connectWiFi() {

  if (debug) Serial.println("CONNECTING TO WIFI");
  byte led_status = 0;

  // Set WiFi mode to station (client)
  WiFi.mode(WIFI_STA);
  if (debug) Serial.println(WiFi.localIP());
  WiFi.enableAP(false);
  //WiFi.dnsIP(8 | (8 << 8) | (8 << 16) | (8 << 24));

  WiFi.begin(WIFI_SSID, WIFI_PSK);
  //WiFi.softAPdisconnect(true);

  // Blink LED while we wait for WiFi connection
  while ( WiFi.waitForConnectResult() != WL_CONNECTED ) {

    digitalWrite(LED_PIN, led_status);

    led_status ^= 0x01;
    delay(100);
  }

  // Turn LED off when we are connected
  digitalWrite(LED_PIN, HIGH);
  if (debug) Serial.println("DONE");

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
