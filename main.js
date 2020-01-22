let game = new Phaser.Game(600, 600,Phaser.AUTO,'content');
let speed = 300;
let southPark = {
    preload: function() {
        game.load.image('background2', 'assets/fond.png');
        game.load.image('background1', 'assets/bg1.png');
        game.load.image('background3', 'assets/bg3.png');
        game.load.image('player', 'assets/player.png');
        game.load.image('badguy', 'assets/kyle.png');
    },
    create: function() {

        game.physics.startSystem(Phaser.Physics.ARCADE);
        test = 1;
        game.add.sprite(0, 0, "background" + entierAleatoire(1, 3));

        this.player = game.add.sprite(300, 500, 'player');
        this.player.anchor.set(0.35);
        game.physics.arcade.enable(this.player);
        this.cursors = game.input.keyboard.createCursorKeys();

        this.badGuys = game.add.group();

        this.timer = game.time.events.loop(200, this.addBadGuy, this);
        this.score = 0;
    },
    update: function() {
        game.physics.arcade.overlap(this.player, this.badGuys, this.restartGame, null, this);
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        if (this.cursors.left.isDown){
            this.player.body.velocity.x = -speed;
        }   
        if (this.cursors.right.isDown){
            this.player.body.velocity.x = speed;
        }
        if (this.cursors.up.isDown){
            this.player.body.velocity.y = -speed;
        }   
        if (this.cursors.down.isDown){
            this.player.body.velocity.y = speed;
        }
        if (this.player.inWorld == false){
            this.restartGame();
        }
        
    },
    restartGame: function(){
        game.state.start('southPark');
    },
    addBadGuy: function(){
        let position = Math.floor(Math.random() * 550) + 1;
        let badGuy = game.add.sprite(position, -50, 'badguy');
        game.physics.arcade.enable(badGuy);
        badGuy.body.gravity.y = 200;

        this.badGuys.add(badGuy);

        this.score += 20;
        document.querySelector('#score').innerHTML = this.score;

        badGuy.checkWorldBounds = true;
        badGuy.outOfBoundsKill = true;
    }
};

function entierAleatoire(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
game.state.add('southPark', southPark);
game.state.start('southPark');