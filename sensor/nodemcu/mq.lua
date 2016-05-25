-- DO NOT USE node.chipid()! bricks nodemcu!!!
id = 1

-- mqtt config
ip = "152.96.239.126"
port = 1883
secure = 0
topic = "/waku"

-- gpio config
pin = 1  -- D1

createJson = function(status)
  return ('{"_id": "' .. id .. '", "location": "", "status": "'.. status .. '"}')
end

wifi.setmode(wifi.STATION)
wifi.sta.config("HONOR_PLK_A046","d6c6e433")
print(wifi.sta.getip())

-- init mqtt client with keepalive timer 120sec
m = mqtt.Client(chipid, 120, "", "")
-- setup Last Will and Testament (optional)
m:lwt("/lwt", "offline", 0, 0)
m:on("connect", function(client) print ("connected") end)
m:on("offline", function(client) print ("offline") end)
m:connect(ip, port, secure, function(client) print("connected") end,
                            function(client, reason) print("failed reason: " .. reason) end)
m:subscribe(topic, 0, function(client) print("subscribe success") end)

gpio.mode(pin, gpio.INPUT)
oldVal = 0
--automatically repeat alarm every 2000ms
tmr.alarm(1, 2000,1,function()
  newVal = gpio.read(pin)
  if (newVal ~= oldVal) then
    if (newVal == 1) then
      status = "washing"
    else
      status = "idle"
    end
    m:publish(topic, createJson(status), 0, 0, function(client) print("sent status") end)
  end
  oldVal = newVal
end)
-- m:close();
-- you can call m:connect again
