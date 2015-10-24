/**
 * Created by kevinholland on 10/23/15.
 */
var MenuState = new Kiwi.State('MenuState');

MenuState.create = function() {
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

MenuState.createBackground = function() {
    this.background = new Kiwi.HUD.Widget.MenuItem(this.game, "",
        this.game.stage.width / 2 - 200,
        this.game.stage.height / 2 - 100 - 30);
    this.background.style.backgroundColor = 'white';
    this.background.style.width = '400px';
    this.background.style.height = '200px';
    this.background.style.display = 'block';
    this.background.style.boxSizing = 'border-box';
    this.background.style.boxShadow = '0px 0px 15px #444';
    //this.background.style.zIndex = '-1';

    this.menu.addMenuItem(this.background);
};

MenuState.createPlayButton = function() {
    this.playButton = new Kiwi.HUD.Widget.MenuItem(this.game, "Play", 0, 0);
    styleButton(this.playButton);
    this.playButton.x = this.game.stage.width / 2 + 10;
    this.playButton.y = this.game.stage.height / 2;

    this.playButton.input.onDown.add(function() {
        //game.states.switchState("PlayState");
        this.startGameSegue();
    }, this);

    this.menu.addMenuItem(this.playButton);
};

MenuState.createTutorialButton = function() {
    this.tutButton = new Kiwi.HUD.Widget.MenuItem(this.game, "Tutorial", 0, 0);
    styleButton(this.tutButton);
    this.tutButton.x = this.game.stage.width / 2 - 140;
    this.tutButton.y = this.game.stage.height / 2;

    this.menu.addMenuItem(this.tutButton);
};

MenuState.drawGameText = function() {
    this.gameText = new Kiwi.HUD.Widget.TextField(this.game, "mini_fridge");
    styleHeader(this.gameText);

    this.gameText.x = this.game.stage.width / 2 - 100;
    this.gameText.y = this.game.stage.height / 2 - 100;

    this.menu.addMenuItem(this.gameText);
};

MenuState.hideElements = function() {
    var items = this.menu.menuItems;
    for (var i = 0; i < items.length; i++) {
        hideElement(items[i]);
    }
};

MenuState.startGameSegue = function() {
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
    //do animation
    this.startAnimation = true;
    //game.switchState('PlayState');
};

MenuState.update = function() {
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
    field.style.textShadow = '0px 0px 10px #888';
}

function styleButton(button) {
    button.style.color = 'white';
    button.style.display = 'block';
    button.style.boxSizing = 'border-box';
    button.style.fontFamily = '\'Roboto\', sans-serif';
    button.style.fontWeight = '200';
    button.style.fontSize = 'x-large';
    button.style.width = (this.menuWidth * 2).toString() + 'px';
    button.style.textAlign = 'center';
    button.style.cursor = 'pointer';
    button.style.padding = '0.5em 1em';
    button.style.backgroundColor = '#115B89';
    button.style.boxShadow = '0px 0px 10px #555';
}

