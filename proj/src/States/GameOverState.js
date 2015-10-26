/**
 * Created by kevinholland on 10/23/15.
 */
var GameOverState = new Kiwi.State('GameOverState');

GameOverState.create = function() {
    //Switch the background colour back to white from purple
    this.game.stage.color = 'FFEDD1';

    this.menu = new Kiwi.HUD.Widget.Menu(this.game, 0, 0);
    this.game.huds.defaultHUD.addWidget(this.menu);

    this.createBackground();
    this.createPlayButton();
    this.createTutorialButton();
    this.drawGameText();

    this.animationStarted = false;
};

GameOverState.createBackground = function() {
    this.background = new Kiwi.HUD.Widget.MenuItem(this.game, "",
        this.game.stage.width / 2 - 200,
        this.game.stage.height / 2 - 100 - 30);
    this.background.style.backgroundColor = 'white';
    this.background.style.width = '400px';
    this.background.style.height = '200px';
    this.background.style.display = 'block';
    this.background.style.boxSizing = 'border-box';
    this.background.style.boxShadow = '0px 0px 15px #444';

    this.menu.addMenuItem(this.background);
};

GameOverState.createPlayButton = function() {
    this.playButton = new Kiwi.HUD.Widget.MenuItem(this.game, "play again.", 0, 0);
    this.playButton.x = this.game.stage.width / 2 + 10;
    this.playButton.y = this.game.stage.height / 2;
    this.playButton.input.onDown.add(function() {
        this.startGameSegue();
    }, this);
    this.addButton(this.playButton);
};

GameOverState.createTutorialButton = function() {
    this.tutButton = new Kiwi.HUD.Widget.MenuItem(this.game, "highscores.", 0, 0);
    this.tutButton.x = game.stage.width / 2 - 140;
    this.tutButton.y = game.stage.height / 2;
    this.addButton(this.tutButton);
};

GameOverState.addButton = function(button) {
    styleButton(button);

    button.input.onOver.add(function () {
        styleOnOver(button);
    }, this);
    button.input.onOut.add(function () {
        styleOnOut(button);
    }, this);

    this.menu.addMenuItem(button);
};

GameOverState.drawGameText = function() {
    this.gameText = new Kiwi.HUD.Widget.TextField(this.game, "you died.");
    styleHeader(this.gameText);

    this.gameText.x = this.game.stage.width / 2 - 70;
    this.gameText.y = this.game.stage.height / 2 - 100;

    this.menu.addMenuItem(this.gameText);
};

GameOverState.hideElements = function() {
    var items = this.menu.menuItems;
    for (var i = 0; i < items.length; i++) {
        hideElement(items[i]);
    }
};

GameOverState.startGameSegue = function() {
    //hide all elements that are not play button
    var items = this.menu.menuItems;
    for (var i = 0; i < items.length; i++) {
        if (items[i] !== this.playButton &&
            items[i] !== this.background) {
            hideElement(items[i]);
        }
    }

    this.playButton.text = '';
    this.playButton.style.width = '100px';
    this.playButton.style.height = '100px';
    styleOnOut(this.playButton);
    //do animation
    this.startAnimation = true;
    //game.switchState('PlayState');
};

GameOverState.update = function() {
    if (this.startAnimation) {
        //move background up
        this.background.y -= 40;

        //move player to desired spot
        if (this.playButton.x > this.game.stage.width / 2 - 50) {
            this.playButton.x -= 5;
        }
        if (this.playButton.y < this.game.stage.height - 130) {
            this.playButton.y += 20;
        }
        if (this.playButton.y >= this.game.stage.height - 130 &&
            this.playButton.x <= this.game.stage.width / 2 - 50) {
            hideElement(this.playButton);
            hideElement(this.background);
            game.states.switchState('PlayState');
        }
    }
};

function hideElement (element) {
    element.style.display = 'none';
}

function styleHeader(field) {
    field.style.display = 'block';
    field.style.fontFamily = '\'Roboto\', sans-serif';
    field.style.fontWeight = '300';
    field.style.fontSize = 'xx-large';
    field.style.textAlign = 'center';
    field.style.width = '160px';
    field.style.textShadow = '0px 0px 10px #888';
}

function styleButton(button) {
    button.style.color = 'white';
    button.style.display = 'block';
    button.style.fontFamily = '\'Roboto\', sans-serif';
    button.style.fontWeight = '200';
    button.style.fontSize = '20px';
    button.style.width = '100px';
    button.style.cursor = 'pointer';
    button.style.textAlign = 'center';
    button.style.padding = '0.5em 1em';
    button.style.backgroundColor = '#115B89';
    button.style.boxShadow = '0px 0px 10px #555';
}

function styleOnOver(button) {
    button.style.backgroundColor = '#100330';
}
function styleOnOut(button) {
    button.style.backgroundColor = '#115B89';
}
