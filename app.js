var http = require("http");
var fs = require("fs");
let express = require("express");
let mysql = require("mysql");

let app = express();
let conn = mysql.createConnection({
  database: "game_sp",
  host: "164.132.46.160",
  user: "backend",
  password: "Avq3yjLDAsW8pzNr"
});

conn.connect(function(err) {
  if (err) throw err;
  console.log("Connecter à la bdd!");
});

app.use("/assets", express.static("assets"));

let server = http.createServer(app);

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/main.html");
});

let io = require("socket.io").listen(server);

io.sockets.on("connection", function(socket) {
  socket.on("score", function(score) {
    if (socket.pseudo == undefined) {
      return false;
    }
    let sql = `SELECT * FROM user WHERE pseudo = '${socket.pseudo}'`;
    conn.query(sql, function(err, rows, fields) {
      sql = `INSERT INTO score(userid,score,date_input) VALUES('${rows[0].id}','${score}', NOW())`;
      conn.query(sql);
      let scorePersistent = score;
      Math.round((score /= 100));
      sql = `UPDATE user SET money = money + '${score}' WHERE pseudo = '${socket.pseudo}'`;
      conn.query(sql);
      socket.emit("money", rows[0].money, scorePersistent);
    });
  });
  socket.on("pseudo", function(pseudo) {
    let sql = `SELECT count(*) as nb FROM user WHERE pseudo = '${pseudo}'`;
    conn.query(sql, function(err, rows, fields) {
      if (err) throw err;
      if (rows[0].nb == "0") {
        let sql = `INSERT INTO user(pseudo,money) VALUES('${pseudo}','0')`;
        conn.query(sql);
      }
      socket.pseudo = pseudo;
    });
  });

  socket.on("initial", function() {
    if (socket.pseudo == undefined) {
        return false;
      }
    socket.scoreboard = [];
    socket.scoreboardDate = [];
    let sql = `SELECT id,money FROM user WHERE pseudo = '${socket.pseudo}'`;
    conn.query(sql, function(err, rows, fields) {
      socket.emit("money", rows[0].money);

      sql = `SELECT score,date_input FROM score WHERE userid = '${rows[0].id}' ORDER BY id DESC LIMIT 10`;
      conn.query(sql, function(err, rows2, fields) {
        for (var i = 0; i < rows2.length; i++) {
          socket.scoreboard.push(`${rows2[i].score}`);
          socket.scoreboardDate.push(`${rows2[i].date_input}`);
        }
        socket.emit("scoreboard", socket.scoreboard, socket.scoreboardDate);
      });
    });
  });
});

server.listen(8080);
