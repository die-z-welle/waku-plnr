id = 1
-- gpio config
pin = 1  -- D1

createJson = function(status)
  return ('{"id": "' .. id .. '", "status": "'.. status .. '"}')
end

gpio.mode(pin, gpio.INPUT)
oldVal = 0
--automatically repeat alarm every 2000ms
tmr.alarm(1, 2000,1,function()
  newVal = gpio.read(pin)
  if (newVal ~= oldVal) then
    if (newVal == 1) then
      status = "on"
    else 
      status = "off"
    end
    print(createJson(status))
  end
  oldVal = newVal
end)