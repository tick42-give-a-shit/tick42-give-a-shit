#include <ESP8266WiFi.h>
#include <WebSocketClient.h>
#include <ArduinoJson.h>
//#include <WiFiClientSecure.h>

// using:
// ESP8266-Websocket-master
// ESP8266WiFi
// ArduinoJson

const char WIFI_SSID[] = "Pirinsoft";
const char WIFI_PSK[] = "+rqcP3_nnhSH]Yr%";

const int LED_PIN = 5;
const uint8_t GPIO0 = 0;
const uint8_t GPIO4 = 4;
int debug = 1;
// has milk?
int state = 1;

// gw host
// char* gwHost = "52.48.192.145";
// int gwPort = 80;
char* gwHost = "35.242.253.103";
int gwPort = 5000;
// char* gwHost = "192.168.0.2";

char* smtpFrom = "t42test@tick42.com";
char* smtpTo = "velko.nikolov@tick42.com";
// char* smtpTo = "irina.zasheva@tick42.com";
char* smtpCC = "velko.nikolov@tick42.com";
char* smtpUser = "dHJ1c3Rpbmc=";
char* smtpPassword = "";
char* smtpSubject = "Out of milk";
char* smtpBody = "No milk, or someone is trolling us :(";

char* smtpHost = "mail.trustingwolves.com";
int smtpPort = 587;

// GW HTTP client
WiFiClient client;
// GW WS client
WebSocketClient webSocketClient;

// Zapier HTTP client
WiFiClient/*Secure*/ secureClient;
// ...........      - waiting for WiFi connection
// ...   ...   ...  - connecting to GW

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

//const char fingerprint[] PROGMEM = "5F F1 60 31 09 04 3E F2 90 D2 B0 8A 50 38 04 E8 37 9F BC 76";
//const char fingerprint[] PROGMEM = "AF 21 4A 6C 2C E4 CE 6E 99 7B B8 EA 58 CF 57 6B C2 35 A4 0D";
void setup() {

  Serial.begin(115200);

  pinMode(LED_PIN, OUTPUT);
  pinMode(GPIO0, INPUT);
  pinMode(GPIO4, OUTPUT);

  // digitalWrite(GPIO4, HIGH);
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

  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  }

  if (WiFi.status() != WL_CONNECTED) {
    return;
  }

  if (!client.connect(gwHost, gwPort)) {
    morse("...  ...  ...  ");
    return;
  }

  webSocketClient.path = "/gw";
  webSocketClient.host = gwHost;
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
      digitalWrite(GPIO4, state ? LOW : HIGH);

      data.replace("#state#", state ? "true" : "false");

      webSocketClient.sendData(data);

      if (!state) {
        if (sendEmail()){}else{

        }
         /*ESPMail mail;
         mail.begin();

         mail.setSubject("velko.nikolov@gmail.com", "EMail Subject");
         mail.addTo("velko.nikolov@gmail.com");

         mail.setBody("This is an example e-mail.\nRegards Grzesiek");
         //mail.setHTMLBody("This is an example html <b>e-mail<b/>.\n<u>Regards Grzesiek</u>");

         if (mail.send("mail.smtp2go.com", 2525, "velko.nikolov@gmail.com", "MOQcUt8805wI") == 0) {
            Serial.println("Mail send OK");
         } else {
          morse(".. .. .. .. ");
        }*/
        /*//secureClient.setFingerprint(fingerprint);
        if (secureClient.connect(zapierUrl)) {
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
        }*/
      }


      // drain websocket
      webSocketClient.getData(data);

      while (digitalRead(GPIO0) == LOW) {
        // wait for user to release button
        delay(100);
      }
    }

  }

}

// https://iotdesignpro.com/projects/how-to-send-smtp-email-using-esp8266-nodemcu
byte sendEmail()
{
  WiFiClient espClient;
  if (espClient.connect(smtpHost, smtpPort) == 1)
  {
    Serial.println(F("connected"));
  }
  else
  {
    Serial.println(F("connection failed"));
    return 0;
  }

  if (!emailResp(espClient)) {
    return 0;
  }

  Serial.println(F("Sending EHLO"));
  espClient.println("EHLO staafl.nowhere.com");
  if (!emailResp(espClient)) {
    return 0;
  }

  Serial.println(F("Sending auth login"));
  espClient.println("AUTH LOGIN");
  if (!emailResp(espClient)) {
    return 0;
  }

  Serial.println(F("Sending User"));

  espClient.println(smtpUser);
  if (!emailResp(espClient)) {
    return 0;
  }

  Serial.println(F("Sending Password"));

  espClient.println(smtpPassword);
  if (!emailResp(espClient)) {
    return 0;
  }

  Serial.println(F("Sending From"));

  espClient.println((String("MAIL From: ") + String(smtpFrom)));
  if (!emailResp(espClient)) {
    return 0;
  }

  Serial.println(F("Sending To"));
  espClient.println((String("RCPT To: ") + String(smtpTo)));
  if (!emailResp(espClient)) {
    return 0;
  }

  Serial.println(F("Sending CC"));
  espClient.println((String("RCPT To: ") + String(smtpCC)));
  if (!emailResp(espClient)) {
    return 0;
  }


  Serial.println(F("Sending DATA"));
  espClient.println(("DATA"));
  if (!emailResp(espClient)) {
    return 0;
  }

  Serial.println(F("Sending email"));
  espClient.println((String("To: ") + String(smtpTo)));
  espClient.println((String("Cc: ") + String(smtpCC)));
  espClient.println((String("From: ") + String(smtpFrom)));
  espClient.println((String("Subject: ") + String(smtpSubject) + String("\r\n")));
  espClient.println((String(smtpBody) + String("\n")));
  espClient.println(F("."));

  if (!emailResp(espClient))
    return 0;

  Serial.println(F("Sending QUIT"));
  espClient.println(F("QUIT"));
  if (!emailResp(espClient))
    return 0;
  //
  espClient.stop();
  Serial.println(F("disconnected"));
  return 1;
}

byte emailResp(WiFiClient espClient)
{
  byte responseCode;
  byte readByte;
  int loopCount = 0;

  while (!espClient.available())
  {
    delay(1);
    loopCount++;

    if (loopCount > 20000)
    {
      espClient.stop();
      Serial.println(F("\r\nTimeout"));
      return 0;
    }
  }

  responseCode = espClient.peek();
  while (espClient.available())
  {
    readByte = espClient.read();
    Serial.write(readByte);
  }

  if (responseCode >= '4')
  {
    return 0;
  }
  return 1;
}
