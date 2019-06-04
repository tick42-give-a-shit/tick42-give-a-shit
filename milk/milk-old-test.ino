static const uint8_t D1 = 0;
const int LED_PIN = 5;

void setup() {
  pinMode(D1, INPUT);
  pinMode(LED_PIN, OUTPUT);

  for (int ii = 0; ii < 10; ++ ii) {
     digitalWrite(LED_PIN, HIGH);
     delay(200);
     digitalWrite(LED_PIN, LOW);
     delay(200);
  }
}

void loop() {
  byte valor = digitalRead(D1); 

  if(valor == HIGH) {         
     digitalWrite(LED_PIN, LOW);
     delay(1000);
     digitalWrite(LED_PIN, HIGH);
     delay(1000);
  } else {
     digitalWrite(LED_PIN, HIGH);
     delay(200);
     digitalWrite(LED_PIN, LOW);
     delay(200);
     digitalWrite(LED_PIN, HIGH);
     delay(200);
     digitalWrite(LED_PIN, LOW);
     delay(200);
     digitalWrite(LED_PIN, HIGH);
     delay(1000);
  }

}
