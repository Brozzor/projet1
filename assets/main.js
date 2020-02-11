function go() {
  game = new Phaser.Game(600, 600, Phaser.AUTO, "content");
  let speed = 300; // vitesse de déplacement du joueur
  let northPark = {
    preload: function() {
      game.load.image("background2", "assets/bg2.png");
      game.load.image("background1", "assets/bg1.png");
      game.load.image("background3", "assets/bg3.png");
      game.load.image("player", "assets/player.png");
      game.load.image("badguy", "assets/kyle.png");
    },
    create: function() {
      game.physics.startSystem(Phaser.Physics.ARCADE);
      test = 1;
      game.add.sprite(0, 0, "background" + entierAleatoire(1, 3));

      this.player = game.add.sprite(300, 500, "player");
      this.player.anchor.set(0.30);
      game.physics.arcade.enable(this.player);
      this.cursors = game.input.keyboard.createCursorKeys();

      this.badGuys = game.add.group();

      this.timer = game.time.events.loop(300, this.addBadGuy, this);
      this.score = 0;
    },
    update: function() {
      game.physics.arcade.overlap(this.player, this.badGuys, this.endGame, null, this);
      this.player.body.velocity.x = 0;
      this.player.body.velocity.y = 0;
      if (this.cursors.left.isDown) {
        this.player.body.velocity.x = -speed;
      }
      if (this.cursors.right.isDown) {
        this.player.body.velocity.x = speed;
      }
      if (this.cursors.up.isDown) {
        this.player.body.velocity.y = -speed;
      }
      if (this.cursors.down.isDown) {
        this.player.body.velocity.y = speed;
      }
      if (this.player.inWorld == false) {
        this.endGame();
      }
    },
    restartGame: function() {
      addScoreInPlayer(this.score);
      game.state.start("northPark");
    },
    endGame: function() {
      addScoreInPlayer(this.score);
      game.destroy();
      end();
    },
    addBadGuy: function() {
      let position = Math.floor(Math.random() * 550) + 1;
      let badGuy = game.add.sprite(position, -50, "badguy");
      game.physics.arcade.enable(badGuy);
      badGuy.body.gravity.y = 200;

      this.badGuys.add(badGuy);

      this.score += 20;
      if (document.querySelector("#score").innerHTML != null){document.querySelector("#score").innerHTML = this.score;}
      

      badGuy.checkWorldBounds = true;
      badGuy.outOfBoundsKill = true;
    }
  };

  function entierAleatoire(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  game.state.add("northPark", northPark);
  game.state.start("northPark");
}

function receptionPseudo() {
  pseudo = document.getElementById("inputPseudo").value;
  if (pseudo != "") {
    socket.emit("pseudo", pseudo);
    play();
    //setTimeout(`socket.emit('initial') `, 500);
  } else {
    alert("Vous devez mettre un pseudo valide");
  }
}

function addScoreInPlayer(score) {
  socket.emit("score", score);
 // socket.emit("initial");
}

function initShop() {

  let i = 0;
  
  let maps = {
    name: ['terre', 'espace', 'mars', 'neptune'],
    tarif: ['0', '1000', '1500', '5000'] 
};

let skins = {
  tarif: ['0', '1000', '1500', '5000'] 
};

  while (i < 4){
  document.getElementById("skins").innerHTML += `
  <tr>
          <th><img src="/assets/${i+1}.png"></img></th>
          <td>${skins.tarif[i]}</td>
          <td><button id="skinBtn" value="${i}" class="btn btn-warning">Acheter</button></td>
        </tr>`;
  
  document.getElementById("maps").innerHTML += `
  <tr>
    <th>${maps.name[i]}</th>
    <td>${maps.tarif[i]}</td>
    <td><button id="mapBtn" value="${i}" class="btn btn-warning">Acheter</button></td>
  </tr>`;
  i++;
  }
}

socket.on("money", function(nb,score2) {
  document.getElementById("moneyDisplay").innerHTML = `${nb}`;
  document.getElementById("score").innerHTML = `${score2}`;
});

socket.on("moneyDisplay", function(nb,score2) {
  document.getElementById("moneyDisplay").innerHTML = `${nb}`;
});

socket.on("scoreboard", function(score, date_input) {
  let i = 0;
  document.getElementById("scoreboard").innerHTML = null;
  while (i < score.length) {
    let t = Date.now() - Date.parse(`'${date_input[i]}'`);
    let s = Math.floor(t / 1000) % 60;
    let m = Math.floor(t / 60000) % 60;
    let displayTime = `<p>${score[i]} il y a ${m} minutes et ${s} secondes</p><hr>`;
    if (m == '0'){displayTime = `<p>${score[i]} il y a ${s} secondes</p><hr>`;}

    document.getElementById("scoreboard").innerHTML += displayTime;
    i++;
  }
});

function paused()
{
  if (game.paused == false){
    game.paused = true;
    document.getElementById('stateBtn').className = 'btn btn-success';
    document.getElementById('stateBtn').innerText = 'play';
  }else{
    game.paused = false;
    document.getElementById('stateBtn').className = 'btn btn-warning';
    document.getElementById('stateBtn').innerText = 'pause';
  }
  
}