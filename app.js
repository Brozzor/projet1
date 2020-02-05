var http = require('http');
var fs = require('fs');
let express = require('express');
let app = express();
app.use('/assets', express.static('assets'))
var server = http.createServer(app);

app.get("/", function(req, res){
    res.sendFile(__dirname+'/main.html')
});


var io = require('socket.io').listen(server);


io.sockets.on('connection', function (socket) {
    socket.emit('message', 'Vous êtes bien connecté !');
  
    socket.on('score', function (score) {
        console.log('le score est : ' + score);
    });	
    socket.on('pseudo', function (pseudo) {
        console.log('son pseudo est ' + pseudo);
    });	

});


server.listen(8080);