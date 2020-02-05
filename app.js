var http = require('http');
var fs = require('fs');
let express = require('express');
let mysql = require('mysql');

let app = express();
let conn = mysql.createConnection({
  database: 'game_sp',
  host: "164.132.46.160",
  user: "backend",
  password: "Avq3yjLDAsW8pzNr"
});
 
conn.connect(function(err) {
  if (err) throw err;
  console.log("Connecter à la bdd!");
}); 

app.use('/assets', express.static('assets'))

let server = http.createServer(app);

app.get("/", function(req, res){
    res.sendFile(__dirname+'/main.html')
});


let io = require('socket.io').listen(server);


io.sockets.on('connection', function (socket) {
  
    socket.on('score', function (score) {
        console.log('le score est : ' + score + socket.pseudo);

        Math.round(score /= 100);

        let sql = `UPDATE user SET money = money + '${score}' WHERE pseudo = '${socket.pseudo}'`;
        conn.query(sql);
    });	
    socket.on('pseudo', function (pseudo) {
        let sql = `SELECT count(*) as nb FROM user WHERE pseudo = '${pseudo}'`;
        conn.query(sql, function(err, rows, fields) {
            if (err) throw err;
               if (rows[0].nb == '0')
               {
                let sql = `INSERT INTO user(pseudo,money) VALUES('${pseudo}','0')`;
                conn.query(sql);
                console.log('insertion du nouveau joueur' + socket.pseudo);
               }
            socket.pseudo = pseudo;
        });
    });	

});


server.listen(8080);