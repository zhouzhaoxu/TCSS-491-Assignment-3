function GameOver(game, spritesheet) {
    this.numPlayer = 2;
    this.clockTick = 0;
    //this.gameOver = new Animation(spritesheet, 333, 289, 620, 120, 1, 0.30, 1, true);
    this.game = game;
    this.spritesheet = spritesheet;
    //Entity.call(this, game, 0, 0);
};

GameOver.prototype = new Entity();
GameOver.prototype.constructor = GameOver;

GameOver.prototype.update = function () {
	
    Entity.prototype.update.call(this);
    var currentNumPlayer = 0;
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if(ent instanceof Base) {
        	currentNumPlayer++;
        }
    }
    if(currentNumPlayer < this.numPlayer) {
    	game_Over = true;     	
    }
};

GameOver.prototype.draw = function (ctx) {
	if(game_Over) {
		this.gameOver = new Animation(this.spritesheet, 333, 289, 620, 120, 1, 0.30, 1, true);
		this.gameOver.drawFrame(this.game.clockTick, ctx, 200, 300, 0.6);
		Entity.prototype.draw.call(this)
	}   
};