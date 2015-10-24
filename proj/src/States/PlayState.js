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
    this.game.stage.color = 'FFEDD1';

    //Variables relating to the state of the game
    this.gameStarted = false;

    //Values pertaining to physics based logic 
    this.xAcceleration = 3;
    this.maxXSpeed = 9;


    //The starting coordinates of the box.
    this.startX = (this.game.stage.width / 2);
    this.startY = (this.game.stage.height) - 200;



    //player boxes
    this.playerBox = new Kiwi.Plugins.Primitives.Rectangle( {
        state: this,
        width: 100,
        height: 100,
        centerOnTransform: true,
        x: this.startX,
        y: this.startY,
        color: [17/255, 91/255, 137/255]
    });

    this.playerBox.velocity = 0;
    this.playerBox.canMoveLeft = true;
    this.playerBox.canMoveRight = true;


    this.addChild(this.playerBox);


    //create key objects for input
    this.DKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.D);
    this.FKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.F);
    this.GKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.G);
    this.HKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.H);
    this.JKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.J);
    this.KKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.K);



    //Score
    this.score = 0;
    this.scoreText = new Kiwi.GameObjects.Textfield(this, '0', 50, 50, '#000');
    this.addChild(this.scoreText);
}

/*
Move box methods
 */

PlayState.moveBox = function (direction, box) {

    //first keypress should start game
    this.gameStarted = true;

    //move the box left
    if (direction == "left") {

        if (Math.abs(box.velocity) < this.maxXSpeed) box.velocity -= this.xAcceleration;

    }

    else if (direction == "right") {

        if (Math.abs(box.velocity) < this.maxXSpeed) box.velocity += this.xAcceleration;

    }

    else if (direction == "stop") {

        if (box.velocity < 0) {

            box.velocity += 1;

        }

        else if (box.velocity > 0) {

            box.velocity -= 1;

        }

        else {

            box.velocity = 0;
        }

    }

    box.transform.x += box.velocity;


    box.canMoveRight = true;
    box.canMoveLeft = true;

    if ((box.x - box.width/2) < 0) {

        box.canMoveLeft = false;
        box.velocity = 0;


    }

    if ((box.x + box.width/2) > this.game.stage.width) {

        box.canMoveRight = false;
        box.velocity = 0;

    }

};


/**
 * this method checks for keyboard input and calls the appropriate move functions
 */
PlayState.checkInput = function() {

    if (this.GKey.isDown && this.playerBox.canMoveLeft) {
        this.moveBox("left", this.playerBox);
    }

    else if (this.HKey.isDown && this.playerBox.canMoveRight) {
        this.moveBox("right", this.playerBox);
    }

    else {

        this.moveBox("stop", this.playerBox);
    }


};


/**
* This method is the main update loop. Move scrolling items here
* @method update
* @public
*/
PlayState.update = function () {
    Kiwi.State.prototype.update.call(this);

    if (this.gameStarted) {

        this.playerBox.transform.x += this.playerBox.velocity;

    }

    //check for keyboard input and set box velocity based on key pressed
    this.checkInput();

};


