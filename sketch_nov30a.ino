
const int soundSensorPin = A1;
const int soundThreshold = 300;
int soundValue = 0;
void setup() {
  Serial.begin(9600); 
}

void loop() {

  soundValue = analogRead(soundSensorPin);
  Serial.print(",A1:");
  Serial.println(soundValue);
delay(50); 
}
