id = node.chipid()

-- mqtt config
ip = "192.168.11.118"
port = 1883
secure = 0
topic = "/waku"

-- gpio config
pin = 3  -- D0

createJson = function(status)
  return ('{"id": "' .. id .. '", "status": "'.. status .. '"}')
end

-- init mqtt client with keepalive timer 120sec
m = mqtt.Client(chipid, 120, "", "")
-- setup Last Will and Testament (optional)
m:lwt("/lwt", "offline", 0, 0)
m:on("connect", function(client) print ("connected") end)
m:on("offline", function(client) print ("offline") end)
m:on("message", function(client, topic, data)
  print(topic .. ":" )
  if data ~= nil then
    print(data)
  end
end)

m:connect(ip, port, secure, function(client) print("connected") end,
                            function(client, reason) print("failed reason: " .. reason) end)
m:subscribe(topic, 0, function(client) print("subscribe success") end)

gpio.mode(pin, gpio.INPUT)
oldVal = 0
--automatically repeat alarm every 5000ms
tmr.register(0, 5000, tmr.ALARM_AUTO, function()
  val = gpio.read(pin)
  if (val != oldVal) {
    message = createJson((val == 1) ? "on" : "off" )
    m:publish(topic, message, 0, 0, function(client) print("sent status") end)
  }
  oldVal = val
end)
tmr.start(0)

-- m:close();
-- you can call m:connect again
