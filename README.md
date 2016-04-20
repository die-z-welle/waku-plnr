# waku-plnr
HSR Challenge 2 Projekt: Waschküchenplaner

## Setup
Prerequisites:

    lua
    nodejs


### Cloud
  Run the nodejs-webserver on the device of your choice

### Sensor
  1. Flash the NodeMCU unit's firmware as described at https://github.com/nodemcu/nodemcu-firmware.
  2. Plug the AC-current sensor into GPIO-pin x and x
  3. Adjust the cloud's IP-address in the lua-script
  4. Save the lua-script to the device's flash-memory
  
### Raspberry
