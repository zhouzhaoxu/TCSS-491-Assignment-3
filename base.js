// GameBoard code below

function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function Base(game, position, spritesheet, health) {
    this.side = 50;
    this.health = health;
    this.isAlive = true;
    //this.visualside = 500;
    this.clockTick = 0;
    this.position = position;
    this.spritesheet = spritesheet;
    this.colors = ["Red", "Blue", "Green", "White"];
    //this.gameOver = new Animation(spritesheet2, 333, 289, 620, 120, 1, 0.30, 1, true);
    //this.animation = new Animation(spritesheet, 169 - this.health * 15, 1, 98, 15, 1, 0.30, 1, true);
    switch(position) {
    	case 0: Entity.call(this, game, 0, 400); this.x = 0; this.y = 350; break;
    	case 1: Entity.call(this, game, 800, 400); this.x = 750; this.y = 350; break;
    	case 2: Entity.call(this, game, 400, 800); this.x = 375; this.y = 750; break;
    	case 3: Entity.call(this, game, 400, 0); this.x = 375; this.y = 0; break;
    	default: console.log("something else");
    }
};

Base.prototype = new Entity();
Base.prototype.constructor = Base;

Base.prototype.setColor = function (num) {
	this.color = num;
};

Base.prototype.collide = function (other) {
    return distance(this, other) < this.side + other.radius;
};

Base.prototype.collideLeft = function () {
    return (this.x - this.side) < 0;
};

Base.prototype.collideRight = function () {
    return (this.x + this.side) > 800;
};

Base.prototype.collideTop = function () {
    return (this.y - this.side) < 0;
};

Base.prototype.collideBottom = function () {
    return (this.y + this.side) > 800;
};

Base.prototype.touchCircle = function (circle) {
    if (this.health < 10) {
    	circle.removeFromWorld = true;
    	circle.isAlive = false;
        this.health -= circle.radius / 10;
    }
}
Base.prototype.update = function () {
	
    Entity.prototype.update.call(this);
    //console.log(this.game.clockTick);

    if(!freeze) {
	    this.animation = new Animation(this.spritesheet, 169 - this.health * 15, 1, 98, 15, 1, 0.30, 1, true);
	    this.clockTick++;
	    //console.log(this.clockTick);
	    //this.x += this.velocity.x * this.game.clockTick;
	    //this.y += this.velocity.y * this.game.clockTick;
	    //making circle
	    if(this.clockTick > Math.random() * 2500 + 100) {
	    	var size = Math.floor(Math.random() * 3 + 1) * 10;
	    	//console.log(size);
	    	var circle = new Circle(this.game, this.position, size, 0, 0, Math.random() * 200 + 30, 
	    			Math.random() * 200 + 30, false);
	    	//console.log("here");
	    	//circle.setColor(this.position);
	    	this.game.addEntity(circle);
	        this.clockTick = 0;
	    	//this.lastClockTick = this.game.clockTick;
	    }
	    //checking if the base still alive if not remove from entities.
	    for (var i = 0; i < this.game.entities.length; i++) {
	        var ent = this.game.entities[i];
	        if(ent == this && !this.isAlive) {
	        	this.game.entities[i].removeFromWorld = true;
	        }
	        if (ent !== this && this.collide(ent)) {
	        	//console.log(this.color, this.health);
	            if(this.color !== ent.color) {
	                this.touchCircle(ent);
	            }
			    if (this.health <= 4) {
			    	this.isAlive = false;
			    }
	        }
	    }
    }
};

Base.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.colors[this.color];
    //ctx.arc(this.x, this.y, this.side, 0, Math.PI * 2, false);
    ctx.rect(this.x, this.y, this.side, this.side);
    ctx.fill();
    ctx.closePath();
    if(this.position) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x - 40, this.y - 20);
    } else {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y - 20);
    }
    Entity.prototype.draw.call(this)
};