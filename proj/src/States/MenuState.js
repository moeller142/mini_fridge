/**
 * Created by kevinholland on 10/23/15.
 */
var MenuState = new Kiwi.State('MenuState');

MenuState.create = function() {
    //Switch the background colour back to white from purple
    this.game.stage.color = 'FFEDD1';

    this.playButton = new Kiwi.HUD.Widget.MenuItem(this.game, "Play", 0 ,0);
    this.playButton.style.color = 'white';
    this.playButton.style.display = 'block';
    this.playButton.style.boxSizing = 'border-box';
    this.playButton.style.fontFamily = '\'Roboto\', sans-serif';
    this.playButton.style.fontWeight = '300';
    this.playButton.style.width = (this.menuWidth * 2).toString() + 'px';
    this.playButton.style.textAlign = 'center';
    this.playButton.style.cursor = 'pointer';
    this.playButton.style.padding = '0.5em 1em';
    this.playButton.style.backgroundColor = '#115B89';
    this.playButton.style.boxShadow = '0px 0px 5px #555';


    this.menu = new Kiwi.HUD.Widget.Menu(this.game, game.stage.width/2, game.stage.width/2);
    this.menu.addMenuItem(this.playButton);
    this.game.huds.defaultHUD.addWidget(this.menu);
    this.playButton.input.onDown.add(function() {
        game.states.switchState("PlayState");
        this.playButton.style.display = 'none';
    }, this);
};
