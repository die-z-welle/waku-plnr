#include "EmonLib.h"                   // Include Emon Library
EnergyMonitor emon1;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  emon1.current(1, 111.1); 
}

void loop() {
  // put your main code here, to run repeatedly:
  double Irms = emon1.calcIrms(1480);  // Calculate Irms only
  Serial.print(Irms*230.0);         // Apparent power
  Serial.print(" ");
  Serial.println(Irms);          // Irms
}
