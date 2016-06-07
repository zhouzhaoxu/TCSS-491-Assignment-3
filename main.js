var AM = new AssetManager();
//var gameEngine = new GameEngine();
//the "main" code begins here
var friction = 1;
var acceleration = 1000000;
var game_Over = false;
var freeze = false;
//var maxSpeed = 300;

//function loadAssets() {
	AM.queueDownload("./img/health bar_BW.png");
	AM.queueDownload("./img/Game_Over.png");
	//AM.downloadAll(startGame);
//}

//WEB ASPECT
var socket = io.connect("http://76.28.150.193:8888");

socket.on("load", function (data) {
    console.log(data);
});

window.onload = function () {
    var gameEngine = new GameEngine();
    AM.downloadAll(function () {
    	console.log("starting up da sheild");
        var canvas = document.getElementById('gameWorld');
        var ctx = canvas.getContext('2d');
     
        //var base = new Base(gameEngine, 0);
        //base.setIt();
        //gameEngine.addEntity(circle);
        end = new GameOver(gameEngine, AM.getAsset("./img/Game_Over.png"));
        gameEngine.addEntity(end);
        for (var i = 0; i < 2; i++) {
        	base = new Base(gameEngine, i, AM.getAsset("./img/health bar_BW.png"), 11);
        	base.setColor(i);
            gameEngine.addEntity(base);
        }
        gameEngine.init(ctx);
        gameEngine.start();

        //getting the pause play button
        var stop = document.getElementById("PausePlay");
        //listener for the pause play button
        stop.addEventListener("click", function(e) {
            e.preventDefault();
            console.log(freeze);
            freeze = !freeze;
        }, false);

        //what happen when loading
        socket.on("load", function(data) {
            var entities = data.gameState;
            //reset the entities to none so you can add the loaded data in
            gameEngine.entities = [];
            end = new GameOver(gameEngine, AM.getAsset("./img/Game_Over.png"));
            gameEngine.addEntity(end);

            //add the data in
            for (var i = 0; i < entities.length; i++) {
                if (entities[i].name === "circle") {
                    console.log(entities[i].name);
                    var circle = new Circle(gameEngine, entities[i].team, entities[i].radius, 
                    		entities[i].x, entities[i].y, 
                    		entities[i].xVelocity, entities[i].yVelocity, true);
                    gameEngine.addEntity(circle);
                } else if (entities[i].name === "base") {
                	var base = new Base(gameEngine, entities[i].position, 
                			AM.getAsset("./img/health bar_BW.png"), entities[i].health);
                	base.setColor(entities[i].position);
                    gameEngine.addEntity(base);
                }
            }

        });

        //what happen when saving
        document.getElementById("save").onclick = function(e) {
            e.preventDefault();
            console.log("Trying to save");
            console.log(gameEngine.entities);
            var entities = gameEngine.entities;
            //the data that is to be sended
            var saveState = {studentname: "Alan Reilly", statename: "entityData", gameState: []};
            for (var i = 0; i < gameEngine.entities.length; i++) {
                if (gameEngine.entities[i] instanceof Circle) {
                    var circle = gameEngine.entities[i];
                    saveState.gameState.push({name: "circle", team: circle.team, radius: circle.radius, 
                    	x: circle.x, y: circle.y, 
                    	xVelocity: circle.velocity.x, yVelocity: circle.velocity.y});
                    console.log("Data saved for Circle");
                } else if(gameEngine.entities[i] instanceof Base) {
                	var base = gameEngine.entities[i];
                	saveState.gameState.push({name: "base", position: base.position, health: base.health});
                	console.log("Data saved for Base");
                }
            }

            //send the data to the server to be saved
            socket.emit("save", saveState);  
        }

        document.getElementById("load").onclick = function(e) {
            e.preventDefault();
            console.log("Trying to load");
            socket.emit("load", {studentname: "Alan Reilly", statename: "entityData"});
        }


        socket.on("connect", function () {
            console.log("Socket connected.")
        });
        socket.on("disconnect", function () {
            console.log("Socket disconnected.")
        });
        socket.on("reconnect", function () {
            console.log("Socket reconnected.")
        });
    });

};
