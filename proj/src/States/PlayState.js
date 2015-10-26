var PlayState = new Kiwi.State('PlayState');

/**
 * The PlayState in the core state that is used in the game.
 *
 * It is the state where majority of the functionality occurs 'in-game' occurs.
 *
 * TODO: change can move logic to a function, not properties
 *
 * @class playState
 * @extends State
 * @constructor
 */

var backgroundColor = 'FFEDD1';
var playerColor = [17 / 255, 91 / 255, 137 / 255];
var splitterColor = [215 / 255, 2 / 255, 48 / 255];

/**
 * This create method is executed when Kiwi Game reaches the boot stage of the game loop.
 * @method create
 * @public
 */
PlayState.create = function () {
    //Switch the background colour back to white from purple
    game.stage.color = backgroundColor;
    //Variables relating to the state of the game
    this.gameStarted = false;
    //keep track of how many frames of the game has gone by
    this.frameCount = 0;
    //Score
    this.score = 0;
    this.scoreText = new Kiwi.GameObjects.Textfield(this, 'quintonio!', 50, 50, '#000');
    this.addChild(this.scoreText);

    //variables for keeping track of play time
    //this.date = new Date();
    //this.gameStartTime = 0;

    this.leftStageBound = 0;
    this.rightStageBound = game.stage.width;

    //Values pertaining to physics based logic 
    this.xAcceleration = .5;
    this.friction = .1;
    this.maxXSpeed = 9;
    //enemy descriptions
    this.enemyFallSpeed = 5;
    this.enemyWidth = 60;
    this.enemyHeight = 50;

    //The starting coordinates of player box
    this.startX = (game.stage.width / 2);
    this.startY = (game.stage.height) - 70;
    //player boxes
    this.playerBoxes = [];

    //enemies (FIFO queue)
    this.splitters = [];

    //TODO MANAGE KEYS PER BOX
    /* playerBox could have left and right keys for easy input checking */
    //create key objects for input
    this.keyArray = [];
    this.keyArray.push(game.input.keyboard.addKey(Kiwi.Input.Keycodes.D));
    this.keyArray.push(game.input.keyboard.addKey(Kiwi.Input.Keycodes.F));
    this.keyArray.push(game.input.keyboard.addKey(Kiwi.Input.Keycodes.G));
    this.keyArray.push(game.input.keyboard.addKey(Kiwi.Input.Keycodes.H));
    this.keyArray.push(game.input.keyboard.addKey(Kiwi.Input.Keycodes.J));
    this.keyArray.push(game.input.keyboard.addKey(Kiwi.Input.Keycodes.K));

    //create initial player box
    this.addPlayerBox(4, this.startX);
    this.assignControls();
};

/**
 *  sets the velocity of param box, based on param direction.
 * @param direction
 * @param box
 */
PlayState.moveBox = function (direction, box) {//first key press should start game
    if (direction == "left") {
        if (Math.abs(box.velocity) < this.maxXSpeed) box.velocity -= this.xAcceleration;
    } else if (direction == "right") {
        if (Math.abs(box.velocity) < this.maxXSpeed) box.velocity += this.xAcceleration;
    } else if (direction == "stop") {
        if (Math.abs(box.velocity) < .2) {
            box.velocity = 0;
        }
        if (box.velocity < 0) {
            box.velocity += this.friction;
        } else if (box.velocity > 0) {
            box.velocity -= this.friction;
        }
    }
    box.transform.x += box.velocity;
};

/**
 *  checks keyboard input and moves appropriate box.
 */
PlayState.checkInput = function () {
    this.gameStarted = true;

    for (var i=0; i < this.playerBoxes.length; i++) {
        var box = this.playerBoxes[i];
        if (this.canMove(box)) {
            if (box.leftKey.isDown && !box.rightKey.justPressed()) {
                this.moveBox("left", box);
                break;
            }
            if (box.rightKey.isDown && !box.leftKey.justPressed()) {
                this.moveBox("right", box);
                break;
            }
            this.moveBox("stop", box);
        }
    }
};

/**
 * moves any enemies which are on screen
 */
PlayState.moveSplitters = function () {
    for (var i = 0; i < this.splitters.length; i++) {
        //if splitter is on screen
        if (this.splitters[i].y - this.enemyHeight < game.stage.height) {
            this.splitters[i].transform.y += this.enemyFallSpeed;
        } else {
            this.splitters.shift().destroy();
        }
    }
};

/**
 * Creates new enemy and adds it to the splitters queue
 *
 */
PlayState.addSplitter = function () {
    //create a new enemy
    this.splitter1 = new Kiwi.Plugins.Primitives.Triangle({
        state: this,
        points: [[0, 0], [this.enemyWidth / 2, this.enemyHeight * -1], [this.enemyWidth / 2 * -1, this.enemyHeight * -1]],
        x: Math.floor(Math.random() * game.stage.width),
        y: this.startY - 900,
        color: splitterColor,
        strokeColor: splitterColor,
        drawFill: true,
        drawStroke: true
    });
    this.addChild(this.splitter1);
    this.splitters.push(this.splitter1);
};

PlayState.randomGenSplitter = function() {
    // figure out if a new enemy should spawn
    if ((this.frameCount % 10 == 0 && this.frameCount != 0) && (Math.random() <= .7)) {
        this.addSplitter();
    }
};

/**
 * check to see if a box and a splitter collide. Returns true if they do
 *
 * @param box
 * @param splitter
 * @returns {boolean}
 */
PlayState.splitterOverBox = function (box, splitter) {
    return (splitter.x > box.x - 1 / 2 * box.width) &&
        (splitter.x < box.x + 1 / 2 * box.width);
};

/**
 *
 * @param box
 * @param posInArray
 * @returns {boolean}
 */
PlayState.splitBox = function (box) {
    var posInArray = this.playerBoxes.indexOf(box);
    //if the box can be split into 2
    if (box.weight > 1 && this.playerBoxes.length < 3) {
        //remove the box from the array of boxes
        this.playerBoxes.splice(posInArray, 1);

        //create two new boxes
        var leftBox = this.addPlayerBox(box.weight / 2, box.x - box.width / 2);
        var rightBox = this.addPlayerBox(box.weight / 2, box.x + box.width / 2);
        leftBox.velocity = -3;
        rightBox.velocity = 3;
        //delete the box
        box.destroy();
    }
    // if the box can be made into one smaller box
    else if (box.weight == 2) {
        //remove the box from the array of boxes
        this.playerBoxes.splice(posInArray, 1);

        //create a new box
        this.addPlayerBox(box.weight / 2, box.x);

        //delete the box
        box.destroy();
    }
    // the box must be destroyed
    else {
        this.playerBoxes.splice(posInArray, 1);
        box.destroy();
    }
    this.assignControls();

    //return false if there are no more boxes
    return (this.playerBoxes.length > 0)
};

PlayState.assignControls = function () {
    //sort the player boxes so key presses do the correct thing
    this.playerBoxes.sort(function (a, b) {
        return a.x - b.x;
    });

    for (var i=0; i < this.playerBoxes.length; i++) {
        var box = this.playerBoxes[i];
        box.leftKey = this.keyArray[i * 2];
        box.rightKey = this.keyArray[i * 2 + 1];
    }
};

/**
 * this method will create a box with param weight at position xPos
 * @param mass
 * @param xPos
 *
 * Box params should be like this
 * state: this,
 * width: mass * 25,
 * height: 100,
 * centerOnTransform: true,
 * x: xPos,
 * y: this.startY,
 * drawFill: true,
 * drawStroke: false,
 * color: playerColor
 */
PlayState.addPlayerBox = function (mass, xPos) {
    var box = new Kiwi.Plugins.Primitives.Rectangle({
        state: this,
        width: mass * 25,
        x: xPos,
        y: this.startY,
        height: 100,
        centerOnTransform: true,
        drawFill: true,
        drawStroke: false,
        color: playerColor
    });

    box.velocity = 0;
    box.weight = mass;
    this.addChild(box);
    this.playerBoxes.push(box);
    return box;
};

PlayState.checkPlayerSplitterCollision = function() {
    //check to see if any of the splitters hit any of the player boxes
    var i=0;
    var splitter = this.splitters[i];
    while(typeof splitter != "undefined" && splitter.y > this.startY - 51) {
        if (splitter.y < this.startY - 49) {
            //could be a hit
            //check all player boxes
            for (var j=0; j < this.playerBoxes.length; j++) {
                if (this.splitterOverBox(this.playerBoxes[j], splitter)) {
                    //hit!
                    //if they do, split or destroy the box - if this is the last box,
                    // GAME OVER
                    if (!this.splitBox(this.playerBoxes[j])) {
                        this.gameOver();
                    }
                }
            }
        }
        splitter = this.splitters[i++];
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
        this.moveSplitters();

        this.randomGenSplitter();

        this.checkPlayerSplitterCollision();

        this.frameCount++;
    }
    //check for keyboard input and set box velocity based on key pressed
    this.checkInput();
};

PlayState.gameOver = function() {
    this.gameStarted = false;
    game.states.switchState("GameOverState");
};

/**
 * Checks if given player box can move
 * Player box cannot move if:
 * - Position (det. by velocity) on next frame will put it past a stage bound
 * - Position on next frame will put it past closest wall of closest player box
 * @param box
 * @param direction
 * @returns {boolean}
 */
PlayState.canMove = function (box, direction) {
    var canMove = true;
    if (leftWallX(box) + box.velocity < this.leftStageBound) {
        setBoxLeftWall(box, this.leftStageBound);
        canMove = false;
    } else if (rightWallX(box) + box.velocity > this.rightStageBound) {
        setBoxRightWall(box, this.rightStageBound);
        canMove = false;
    }
    var boxIndex = this.playerBoxes.indexOf(box);
    var numBoxes = this.playerBoxes.length;
    if (numBoxes > 1) {
        if (boxIndex == 0) {
            //check if box right wall hits playerBoxes[1] left wall
            if (rightWallX(box) + box.velocity > leftWallX(this.playerBoxes[1])) {
                setBoxRightWall(box, leftWallX(this.playerBoxes[1]));
                canMove = false;
            }
        } else if (boxIndex == 2) {
            //check if box left wall hits playerBoxes[1] right wall
            if (leftWallX(box) + box.velocity < rightWallX(this.playerBoxes[1])) {
                setBoxLeftWall(box, rightWallX(this.playerBoxes[1]));
                canMove = false;
            }
        } else { //index must be 1 here
            //check if box left wall hits [0] right wall
            if (leftWallX(box) + box.velocity < rightWallX(this.playerBoxes[0])) {
                setBoxLeftWall(box, rightWallX(this.playerBoxes[0]));
                canMove = false;
            }
            if  (numBoxes == 3) {
                //if box right wall hits [2] left wall
                if (rightWallX(box) + box.velocity > leftWallX(this.playerBoxes[2])) {
                    setBoxRightWall(box, leftWallX(this.playerBoxes[2]));
                    canMove = false;
                }
            }
        }
    }
    if (!canMove) box.velocity = 0;
    return canMove;
};

function setBoxLeftWall(box, pos) {
    box.x = pos + box.width /2;
}
function setBoxRightWall(box, pos) {
    box.x = pos - box.width / 2;
}
function leftWallX(box) {
    return box.x - box.width / 2;
}
function rightWallX(box) {
    return box.x + box.width / 2;
}
