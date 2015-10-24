var PlayState = new Kiwi.State('PlayState');

/**
* The PlayState in the core state that is used in the game. 
*
* It is the state where majority of the functionality occurs 'in-game' occurs.
* 
*
* @class playState
* @extends State
* @constructor
*/

/**
* This create method is executed when Kiwi Game reaches the boot stage of the game loop.
* @method create
* @public
*/
PlayState.create = function () {


    //Switch the background colour back to white from purple
    this.game.stage.color = '999999';

    //Variables relating to the state of the game
    this.gameStarted = false;
    this.gameEnded = false;

    //Values pertaining to physics based logic 
    this.gravity = 1;
    this.xSpeed = 3;
    this.ySpeed = 0;
    this.maxYSpeed = 16;

    //speed that pushing a button makes
    this.moveSpeed = -5;


    this.flapSpeed = -16;
    this.pipeDistance = 200;
    this.pipeGap = 600;

    //The starting coordinates of the box.
    this.startX = (this.game.stage.width / 2);
    this.startY = (this.game.stage.height) - 200;

    //Background image
    //this.bg = new Kiwi.GameObjects.Sprite(this, this.textures.background, 0, 0);
    //this.addChild(this.bg);

   /* //Obstacles
    this.pipes = [];
    for (var j = 0; j < 3; j++) {
        var topPipe = new Kiwi.GameObjects.Sprite(this, this.textures.pipe, j * this.pipeDistance + 400 + this.game.stage.width, -Math.random() * 300 - 400);
        this.addChild(topPipe);
        topPipe.transform.rotation += Math.PI;
        this.pipes.push(topPipe);

        var bottomPipe = new Kiwi.GameObjects.Sprite(this, this.textures.pipe, j * this.pipeDistance + 400 + this.game.stage.width, topPipe.transform.y + topPipe.height + this.pipeGap);
        this.addChild(bottomPipe);
        bottomPipe.passed = false;
        bottomPipe.myTop = topPipe;
        this.pipes.push(bottomPipe);
    }*/

    //Scrolling floor
    /*this.tileWidth = 37;
    this.tiles = [];
    var tileCount = Math.ceil(this.game.stage.width / this.tileWidth);
    for (var i = 0; i <= tileCount;ß i++) {
        var t = new Kiwi.GameObjects.Sprite(this, this.textures.ground, i * this.tileWidth, this.game.stage.height - 128);
        this.addChild(t);
        this.tiles.push(t);
    }
*/

    //FIXME(quinton): something is wrong here,

    //player box
    this.playerBox = new Kiwi.Plugins.Primitives.Rectangle( {
        state: this,
        width: 100,
        height: 100,
        centerOnTransform: true,
        x: this.startX,
        y: this.startY
    });

    this.addChild(this.playerBox);

    //Input event for the flapper
    //this.game.input.onDown.add(this.flap, this);

    //create key objects for input
    this.DKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.D);
    this.FKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.F);
    this.GKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.G);
    this.HKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.H);
    this.JKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.J);
    this.KKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.K);


    //create, then hide buttons
    this.buttonX = this.game.stage.width / 2 - 107;
    this.restartBtn = new Kiwi.GameObjects.Sprite(this, this.textures.restart, -217, this.game.stage.height / 2 - 150, true);
    this.addChild(this.restartBtn);
    this.restartBtn.input.onDown.add(this.restartGame, this);

    this.shareBtn = new Kiwi.GameObjects.Sprite(this, this.textures.share, -217, this.game.stage.height / 2 - 50, true);
    this.addChild(this.shareBtn);
    this.shareBtn.input.onDown.add(this.shareGame, this);

    //Score
    this.score = 0;
    this.scoreText = new Kiwi.GameObjects.Textfield(this, '0', 50, 50, '#FFF');
    this.addChild(this.scoreText);
}

/*
Move box methods
 */

PlayState.moveMiddleBoxLeft = function () {
    this.gameStarted = true;
    this.xSpeed =  this.moveSpeed;

}

PlayState.moveMiddleBoxRight = function () {
    this.gameStarted = true;
    this.xSpeed = -1 * this.moveSpeed;

}



PlayState.keyPressed = function (keycode, object) {

    if (this.GKey.isDown) {
        this.moveMiddleBoxLeft();
    }

    if (this.HKey.isDown) {
        this.moveMiddleBoxLeft();
    }

}

/**
* This method is executed when the player resets the game.
* @method restartGame
* @public
*/
PlayState.restartGame = function () {
    this.gameStarted = false;
    this.gameEnded = false;
    this.score = 0;
    this.scoreText.text = this.score;

    for (var p in this.pipes) {
        var pipe = this.pipes[p];
        pipe.transform.x += 400 + this.game.stage.width;
        if (pipe.transform.rotation == 0) pipe.passed = false;
    }

    this.playerBox.transform.x = this.startX;
    this.playerBox.transform.y = this.startY;
    this.playerBox.transform.rotation = 0;

    this.restartBtn.transform.x = -217;
    this.shareBtn.transform.x = -217;
}


/**
* This method is executed when the user presses the share game button.
* @method shareGame
* @public
*/
PlayState.shareGame = function () {
    //Custom code relating to how you want to 'share' the game will need to go here.
    //Right now we are just going to redirect the user to kiwi.js.org :P
    window.open("http://www.kiwijs.org");
}



/**
* This method is executed when the user clicks.
* @method flap
* @public
*/
PlayState.flap = function () {
    this.gameStarted = true;
    this.ySpeed = this.flapSpeed;
}


/**
* This method is the main update loop. Move scrolling items here
* @method update
* @public
*/
PlayState.update = function () {
    Kiwi.State.prototype.update.call(this);

    if (this.gameStarted) {

        if (this.playerBox.transform.x < this.game.stage.width) {

            this.playerBox.transform.x += this.xSpeed;

        }

        //FIXME(quinton): this is not when this should be happening
        //make playerBox face up
        this.playerBox.transform.rotation = -Math.PI / 2;
    }



    if (this.GKey.isDown) {
        this.moveMiddleBoxLeft();
    }

    else if (this.HKey.isDown) {
        this.moveMiddleBoxRight();
    }

    else {

        if (this.xSpeed > 0) {
            this.xSpeed -= 1;
        }

        else if (this.xSpeed < 0) {
            this.xSpeed += 1;
        }
    }

    //move tiles
    if (!this.gameEnded) {
        for (var t in this.tiles) {
            var tile = this.tiles[t];
            tile.transform.x -= this.xSpeed;
            if (tile.transform.x <= -this.tileWidth) tile.transform.x += this.tileWidth * this.tiles.length;
        }
        if (this.gameStarted) {
            //move pipes
            for (var p in this.pipes) {
                var pipe = this.pipes[p];
                pipe.transform.x -= this.xSpeed;
                if (pipe.transform.rotation == 0) {
                    if (pipe.transform.x < -pipe.width) {
                        pipe.transform.x += this.pipeDistance * 3;
                        pipe.passed = false;
                        pipe.myTop.transform.x = pipe.transform.x;
                        var rand = -Math.random() * 300 - 400;
                        pipe.myTop.transform.y = rand;
                        pipe.transform.y = pipe.myTop.transform.y + pipe.myTop.height + this.pipeGap;
                    }

                    if (pipe.transform.x < this.playerBox.transform.x && !pipe.passed) {
                        this.score++;
                        this.scoreText.text = this.score;
                        console.log('score:', this.score);
                        pipe.passed = true;
                    }
                }



            }
        }
    }
}


