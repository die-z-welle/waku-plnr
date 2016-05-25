print(wifi.sta.getip())
--nil

wifi.setmode(wifi.STATION)
wifi.sta.config("HONOR_PLK_A046","d6c6e433")
print(wifi.sta.getip())
