
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var SerialPort = require('serialport');
var weather = require("openweather-node")



var port = new SerialPort('/dev/ttyACM0', {
  parser: SerialPort.parsers.readline('\n')
});

port.on('data', function (data) {
  console.log('Data: ' + data);
});

server.listen(8080);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index5.html');
});

io.sockets.on('connection', function (socket) {
    port.on('data', function(data) {
        socket.emit('temperature', data);
    });
});



//set your API key if you have one
weather.setAPPID("c101c81b05aa7a61dcd7c3e4e9d99e0b");
//set the culture
weather.setCulture("fr");
//set the forecast type
weather.setForecastType("1 hour"); //or "" for 3 hours forecast

io.sockets.on('connection', function(socket) {
    console.log("Handling temperature extérieure");
    weather.now("Rennes",function(err, aData)
    {
    	if(err) console.log(err);
    	else
    	{
        var fluxjson = aData.getDegreeTemp();
        console.log(fluxjson);
        var temp = fluxjson["temp"];
        console.log(temp);
        var tempstring = temp.toString().substr(0, 5);
        console.log(tempstring);
        // var string = JSON.stringify(fluxjson);
        // console.log(string);
        socket.emit('temperature_ext', tempstring);
    	}
    })

});
