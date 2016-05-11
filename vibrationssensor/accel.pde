import processing.serial.*;

Serial port;
char[] accelPacket = new char[12];
int serialCount = 0;
int aligned = 0;
int interval = 0;

int[] xarr = new int[400];
//float[] yarr = new float[400];
//float[] zarr = new float[400];

void setup() {
  size(400, 400);
 //println(Serial.list());
 
 String portName = "/dev/ttyACM0";
 
 port = new Serial(this, portName, 115200);
  
 port.write('r');
  
}

void draw() {
  if (millis() - interval > 1000) {
        // resend single character to trigger DMP init/start
        // in case the MPU is halted/reset while applet is running
        port.write('r');
        interval = millis();
    }
    background(255);
    stroke(255,0,0);
    beginShape();
    for(int i = 0; i < xarr.length; i++) {
      vertex(i, (int)(xarr[i]/10) - 600);
    }
    endShape();
   
}

void serialEvent(Serial port) {
  interval = millis();
  while(port.available() > 0) {
    int ch = port.read();
    print((char)ch);
    if(ch == '$') {
      serialCount = 0;
    }
    if(aligned < 4) {
      if (serialCount == 0) {
          if (ch == '$') aligned++; else aligned = 0;
      } else if (serialCount == 1) {
          if (ch == 2) aligned++; else aligned = 0;
      } else if (serialCount == 10) {
          if (ch == '\r') aligned++; else aligned = 0;
      } else if (serialCount == 11) {
          if (ch == '\n') aligned++; else aligned = 0;
      }
      serialCount++;
      if(serialCount == 12) serialCount = 0;
    } else {
      if(serialCount > 0 || ch == '$') {
        accelPacket[serialCount++] = (char)ch;
        if(serialCount == 12) {
          serialCount = 0;
          int x = ((accelPacket[2] << 8) | accelPacket[3]) ;
          float y = ((accelPacket[4] << 8) | accelPacket[5]);
          float z = ((accelPacket[6] << 8) | accelPacket[7]);
          println("x: " + x + "\t y: " + y + "\t z: " + z);
          for(int i = 1; i < xarr.length; i++) {
            xarr[i - 1] = xarr[i];
          }
          xarr[xarr.length-1] = x;
         
        }
      }
    }
  }
}