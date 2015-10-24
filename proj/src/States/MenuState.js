/**
 * Created by kevinholland on 10/23/15.
 */
var MenuState = new Kiwi.State('MenuState');

MenuState.create = function() {
    //Switch the background colour back to white from purple
    this.game.stage.color = '999999';
    this.playButton = new Kiwi.GameObjects.Sprite(this, this.textures.restart, game.stage.width / 20, true);
    this.addChild(this.playButton);
    this.playButton.input.onDown.add(function() {
        game.states.switchState("PlayState");
    }, this);
};


/*

//create, then hide buttons
this.buttonX = this.game.stage.width / 2 - 107
this.restartBtn = new Kiwi.GameObjects.Sprite(this, this.textures.restart, -217, this.game.stage.height / 2 - 150, true);
this.addChild(this.restartBtn);
this.restartBtn.input.onDown.add(this.restartGame, this);
*/
