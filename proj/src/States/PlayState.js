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
    this.xAcceleration = .5;
    this.friction = .1;
    this.maxXSpeed = 9;

    //enemy descriptions
    this.enemyFallSpeed = 5;
    this.enemyWidth = 60;
    this.enemyHeight = 50;

    //keep track of how many frames of the game has gone by
    this.frameCount = 0;

    //The starting coordinates of the box.
    this.startX = (this.game.stage.width / 2);
    this.startY = (this.game.stage.height) - 70;

    //player boxes
    this.playerBoxes =[];


    //create initial player box
    this.playerBox = new Kiwi.Plugins.Primitives.Rectangle( {
        state: this,
        width: 100,
        height: 100,
        centerOnTransform: true,
        x: this.startX,
        y: this.startY,
        drawFill:  true,
        drawStroke: false,
        color: [17/255, 91/255, 137/255]
    });

    this.playerBox.velocity = 0;
    this.playerBox.weight = 4;
    this.playerBox.canMoveLeft = true;
    this.playerBox.canMoveRight = true;
    this.addChild(this.playerBox);

    this.playerBoxes.push(this.playerBox);


    //enemies (FIFO queue)
    this.splitters = [];


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

/**
 *  sets the velocity of param box, based on param direction.
 * @param direction
 * @param box
 */

PlayState.moveBox = function (direction, box) {
    //first keypress should start game
    this.gameStarted = true;

    //move the box left
    if (direction == "left") {
        if (Math.abs(box.velocity) < this.maxXSpeed) box.velocity -= this.xAcceleration;
    } else if (direction == "right") {
        if (Math.abs(box.velocity) < this.maxXSpeed) box.velocity += this.xAcceleration;
    }

    else if (direction == "stop") {
        if (box.velocity < 0) {
            box.velocity += this.friction;
        } else if (box.velocity > 0) {
            box.velocity -= this.friction;

        } else {
            box.velocity = 0;
        }
    }

    box.transform.x += box.velocity;

    box.canMoveRight = true;
    box.canMoveLeft = true;

    if ((box.x - box.width/2) < 0 && direction == "left") {
        box.canMoveLeft = false;
        box.velocity = 0;
    }
    if ((box.x + box.width/2) > this.game.stage.width && direction == "right") {
        box.canMoveRight = false;
        box.velocity = 0;
    }
};


/**
 *  checks keyboard input and moves appropriate box.
 */

PlayState.checkInput = function() {

    if (this.GKey.isDown && this.playerBox.canMoveLeft) {
        this.moveBox("left", this.playerBox);
    }

    else if (this.HKey.isDown && this.playerBox.canMoveRight) {
        this.moveBox("right", this.playerBox);
    }

    else if (this.playerBox.velocity != 0) {

        this.moveBox("stop", this.playerBox);
    }


};

/**
 * moves any enemies which are on screen
 *
 */
PlayState.moveSplitters = function (splitters) {

    for (var i = 0; i<splitters.length; i++) {

        //if splitter is on screen
        if (splitters[i].y - this.enemyHeight < this.game.stage.height) {

            splitters[i].transform.y += this.enemyFallSpeed;

        }

        else {

            splitters.shift().destroy();


        }

    }

};

/**
 * Creates new enemy and adds it to the splitters queue
 *
 */
PlayState.createEnemy = function () {

    //create a new enemy
    this.splitter1 = new Kiwi.Plugins.Primitives.Triangle( {

        state: this,
        points: [ [0,0], [this.enemyWidth / 2, this.enemyHeight * -1], [this.enemyWidth / 2 * -1, this.enemyHeight * -1]],
        x: Math.floor(Math.random() * this.game.stage.width),
        y: this.startY - 750,
        color: [215/255, 2/255, 48/255],
        strokeColor: [215/255, 2/255, 48/255],
        drawFill: true,
        drawStroke: true

    });

    this.addChild(this.splitter1);
    this.splitters.push(this.splitter1);

}

/**
 * check to see if a box and a splitter collide. Returns true if they do
 *
 * @param box
 * @param splitter
 * @returns {boolean}
 */

PlayState.checkBoxSplitterCollision = function(box, splitter) {

    return (splitter.x > box.x - 1/2 * box.width) &&
        (splitter.x < box.x + 1/2* box.width) &&
        (splitter.y == box.y - 1/2* box.height);


};

/**
 *
 *@param box
 * @param posInArray
 * @returns {boolean}
 */

PlayState.splitBox = function(box, posInArray) {

    // if the box can be split into 2
    if (box.weight > 1 && this.playerBoxes.length < 3) {

        //if the box is a 4 or 2 weight box
        if (box.weight % 2 == 0) {

            //remove the box from the array of boxes
            this.playerBoxes.splice(posInArray, 1);

            //create two new boxes
            this.createBox(box.weight / 2, box.x - box.width / 2);
            this.createBox(box.weight / 2, box.x + box.width / 2);

            //delete the box
            box.destroy();

        }

    }

    // if the box can be made into one smaller box
    else if (box.weight == 2) {

        //remove the box from the array of boxes
        this.playerBoxes.splice(posInArray,1);

        //create a new box
        this.createBox(box.weight / 2, box.x + box.x);

        //delete the box
        box.destroy();
    }


    // the box must be destroyed
    else {
        this.playerBoxes.splice(posInArray, 1);
        box.destroy();
    }

    //return false if there are no more boxes
    return (this.playerBoxes.length > 0)
};

/**
 * this method will create a box with param weight at position xPos
 *
 * @param weight
 * @param xPos
 */
PlayState.createBox = function (weight, xPos) {

    this.playerBox = new Kiwi.Plugins.Primitives.Rectangle( {
        state: this,
        width: weight*25,
        height: 100,
        centerOnTransform: true,
        x: xPos,
        y: this.startY,
        drawFill:  true,
        drawStroke: false,
        color: [17/255, 91/255, 137/255]
    });

    this.playerBox.velocity = 0;
    this.playerBox.weight = weight;
    this.playerBox.canMoveLeft = true;
    this.playerBox.canMoveRight = true;
    this.addChild(this.playerBox);

    this.playerBoxes.push(this.playerBox);


}

/**
* This method is the main update loop. Move scrolling items here
* @method update
* @public
*/
PlayState.update = function () {
    Kiwi.State.prototype.update.call(this);

    if (this.gameStarted) {

        this.playerBox.transform.x += this.playerBox.velocity;
        this.moveSplitters(this.splitters);

        // figure out if a new enemy should spawn
        if ((this.frameCount % 20 == 0 && this.frameCount != 0) && (Math.random()  <= .7)) {

            this.createEnemy();

        }

        //check to see if any of the boxes hit any of the player boxes
        //for each block
        for (var j = 0; j < this.splitters.length; j++) {
            // for each player
            for (var i = 0; i < this.playerBoxes.length; i++ ){

                //check if they collide
                if (this.checkBoxSplitterCollision(this.playerBoxes[i], this.splitters[j])) {

                    //if they do, split or destroy the box - if this is the last box  - GAME OVER
                    if (!this.splitBox(this.playerBoxes[i])) {

                        this.gameStarted = false;
                        game.states.switchState("MenuState");

                    }

                    // make it so no other boxes can be split this frame
                    j = 4;
                    i = 4;
                }
            }



        }

        this.frameCount++;




    }

    //check for keyboard input and set box velocity based on key pressed
    this.checkInput();



};


