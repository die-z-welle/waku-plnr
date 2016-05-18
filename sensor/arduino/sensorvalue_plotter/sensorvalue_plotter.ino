#include "EmonLib.h"
EnergyMonitor emon1;

const int gpioPin = 8;
const double irmsTreshold = 0.2; //In Percent!
const int numReadings = 10;
bool isOn = false;
double readings[10];
int readIndex = 0;
double total = 0;
double average = 0;

void setup() {
  Serial.begin(9600);
  emon1.current(1, 111.1); 
  pinMode(gpioPin, OUTPUT);
}

void calculateAverage(double value) {
  total = total - readings[readIndex];
  readings[readIndex] = value;

  total = total + readings[readIndex];

  readIndex = readIndex + 1;

  if (readIndex >= numReadings) {
    readIndex = 0;
  }

  average = total / numReadings;
}

void loop() {
  double irms = emon1.calcIrms(1480);
  calculateAverage(irms);
  Serial.println(irms); //Remove when done
  
  if(irms > (average + average * irmsTreshold) && !isOn) {
       isOn = true;
       digitalWrite(gpioPin, HIGH);
       Serial.println("Waschmaschiene AN");
  } else if(irms < (average - average * irmsTreshold) && isOn) {
    digitalWrite(gpioPin, LOW);
    isOn = false;
    Serial.println("Waschmaschiene AUS");
  }
}
