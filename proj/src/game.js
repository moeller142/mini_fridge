
/**
* The core EndlessRunner blueprint game file.
* 
* This file is only used to initalise (start-up) the main Kiwi Game 
* and add all of the relevant states to that Game.
*
*/

//Initialise the Kiwi Game. 
var game = new Kiwi.Game('content', 'Splittr', null, { renderer: Kiwi.RENDERER_CANVAS });

//Add all the States we are going to use.
game.states.addState(LoadingState);
game.states.addState(MenuState);
game.states.addState(PlayState);
game.states.addState(GameOverState);

game.states.switchState("LoadingState");
