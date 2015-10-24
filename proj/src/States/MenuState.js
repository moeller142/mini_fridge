/**
 * Created by kevinholland on 10/23/15.
 */
var MenuState = new Kiwi.State('MenuState');

MenuState.create = function() {
    //Switch the background colour back to white from purple
    this.game.stage.color = 'FFEDD1';

    this.menu = new Kiwi.HUD.Widget.Menu(this.game, 0, 0);
    this.game.huds.defaultHUD.addWidget(this.menu);

    this.createPlayButton();
    this.createTutorialButton();
    this.drawGameText();
};

MenuState.createPlayButton = function() {
    this.playButton = new Kiwi.HUD.Widget.MenuItem(this.game, "Play", 0, 0);
    styleButton(this.playButton);
    this.playButton.x = this.game.stage.width / 2 + 10;
    this.playButton.y = this.game.stage.height / 2;

    this.playButton.input.onDown.add(function() {
        game.states.switchState("PlayState");
        this.hideButtons();
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

MenuState.hideButtons = function() {
    var items = this.menu.menuItems;
    for (var i = 0; i <  items.length; i++) {
        items[i].style.display = 'none';
    }
};

function styleHeader(field) {
    field.style.display = 'block';
    field.style.fontFamily = '\'Roboto\', sans-serif';
    field.style.fontWeight = '300';
    field.style.fontSize = 'xx-large';
    field.style.textAlign = 'center';
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

