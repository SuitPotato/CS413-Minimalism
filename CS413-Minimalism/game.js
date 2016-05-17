/**********************************************************************************************************
Keith Saunders Project 1
**********************************************************************************************************/

// Attach to the HTML document via gameport ID
var gameport = document.getElementById("gameport");

// Using Aliasing 
var Container = PIXI.Container,
	autoDetectRenderer = PIXI.autoDetectRenderer,
	// Premade instance of the loader that can be used to load resources
	loader = PIXI.loader,
	resources = PIXI.loader.resources,
	// Texture cache is shared across the whole PIXI object
	TextureCache = PIXI.utils.TextureCache,
	// Stores the information that represents an image or part of an image.
	Texture = PIXI.Texture,
	Sprite = PIXI.Sprite;
	
// Creating the PIXI stage and renderer
var stage = new Container(),
	renderer = autoDetectRenderer(800, 600, {backgroundColor: 0x000000});
	
// Appying to the HTML view
gameport.appendChild(renderer.view);



/**********************************************************************************************************
Loader
**********************************************************************************************************/	
// Load a JSON file and run the setup function. 
// 'adds' the JSON sheet
loader
	.add("images/sheet.json")
	//.on("progress", loadProgressHandler)
	.load(setup);
/**********************************************************************************************************
Loading Progress Bar (?)
**********************************************************************************************************/	
/*	
function loadProgressHandler(loader, resource) {
	
	// Displays the file location that is being loaded
	console.log("Loading: " + resource.url);
	
	// Display the percentage of the total files currently loaded
	console.log("Progress: " + loader.progress + "%")
}
*/

// Defining several variables that will be used multiple times	
/***********************************************************************************************************
Variable Creation
***********************************************************************************************************/
// Ship = Player Ship
// Asteroid = Enemy Projectile
// Space = Background
// State = State in which the game is in.
var ship, asteroid, space, state;
var asteroids = [];

/**********************************************************************************************************
Setup Function
**********************************************************************************************************/
	
function setup() {
	
	/*******************************************************************************************************
	Scene Creations
	*******************************************************************************************************/
	// Actual Game scene
	gameScene = new Container();
	stage.addChild(gameScene);
	
	// Game Over scene, set to invisible!
	gameOverScene = new Container();
	stage.addChild(gameOverScene);
	gameOverScene.visible = false;
	
	/*******************************************************************************************************
	Sprite Creation Setup!
	*******************************************************************************************************/
	// Creating an alias to the texture atlas
	id = PIXI.loader.resources["images/sheet.json"].textures;
	
	/*******************************************************************************************************
	Space/Background Creation
	*******************************************************************************************************/
	// Creating space sprite and applying to GAMESCENE (not stage)
	space = new Sprite(id["Background.png"]);
	gameScene.addChild(space);
	
	/*******************************************************************************************************
	Game Over Text - Display score, however Game over is fine for now
	*******************************************************************************************************/
	
	gameOverMessage = new Text(
		"Game Over!",
		{font: "64px Arial", fill: "white"}
		);
		
	gameOverMessage.x = 400;
	gameOverMessage.y = 300;
	
	//gameOverScene.addChild(gameOverMessage);
	
	/*******************************************************************************************************
	Ship Creation
	*******************************************************************************************************/
	// Creating ship sprite and applying to stage.
	ship = new Sprite(id["Pship.png"]);
	ship.x = 300;
	ship.y = 480;
	// Setting Velocity to 0
	ship.vx = 0
	stage.addChild(ship);
	
	/*******************************************************************************************************
	Keyboard Control Definitions
	*******************************************************************************************************/
	// Variables storing Ascii keyCodes for arrow keys
	var left = keyboard(37),
		right = keyboard(39);
		
	left.press = function() {
		ship.vx = -5;
	}
	
	left.release = function() {
		// If right is not down, then set velocity (x) to 0.
		if(!right.isDown)
			ship.vx = 0;
	}
	
	right.press = function() {
		ship.vx = 5;
	}
	
	right.release = function() {
		// If left is not down, then set velocity (x) to 0.
		if(!left.isDown)
			ship.vx = 0;
	}
	/*******************************************************************************************************
	Render Setup!
	*******************************************************************************************************/
	
	spawnAsteroid(8,4);
	renderer.render(stage);
	state = play;
	gameLoop();
}

/**********************************************************************************************************
GameLoop Function
**********************************************************************************************************/
// Animate function recreated
function gameLoop() {
	
	// Constantly loop through this function
	requestAnimationFrame(gameLoop);
	
	state();
	
	// Render the stage
	renderer.render(stage);
}

/**********************************************************************************************************
Play Function and State
**********************************************************************************************************/
//Play needs to contain the movement of the player! 
function play() {
	
	// Add (or subtract) to the ship's x-axis based on input
	ship.x += ship.vx;
	
	
	
	for(var i = 0; asteroids.length; i++) {
		alert(asteroids[i]);
		asteroids[i].position.y += asteroids[i].position.vy;
	}
	
	// Calling contain function
	contain(ship, {x: 0, y:0, width: 800, height: 600})

}	

/**********************************************************************************************************
Helper Function
***********************************************************************************************************
***********************************************************************************************************
Contain Function
**********************************************************************************************************/
/* 
Need to detect if the ship is hitting the edge of the game stage.
Takes in two arguments, a sprite and an container object
Container has the following values:
x: x - offset
y: y - offset
width and height: Area defined
*/
function contain(sprite, container) {
	
	// Undef until collision, displays the collision location when a collision occurs
	var collision = undefined;
	
	// Left Side
	if (sprite.x < container.y){
		sprite.x = container.x;
		collision = 'left';
	}
	
	// Top Side
	if (sprite.y < container.y){
		sprite.y = container.y;
		collision = 'top';
	}
	
	// Right Side
	if (sprite.x + sprite.width > container.width){
		sprite.x = container.width - sprite.width;
		collision = 'right';
	}
	
	// Bottom Side
	if (sprite.y + sprite.height > container.height){
		sprite.y = container.height - sprite.height;
	}
	
	return collision
}


/**********************************************************************************************************
Keyboard Function
**********************************************************************************************************/
// Keyboard function to support general Ascii Key Codes function creation
function keyboard(keyCode) {
	// Empty Key Object
	var key = {};
	// Code:keyCode
	key.code = keyCode;
	
	// Default Settings for button positions
	key.isDown = false;
	key.isUp = true;
	key.press = undefined;
	key.release = undefined;
  
	// When the key is pressed, call the downHandler
	key.downHandler = function(event) {
		// Verify the keyCode parameter matches the object code
		if (event.keyCode === key.code) {
			// If the key is up then key press
			if (key.isUp && key.press) key.press();
			
			// Settings for button positions
			key.isDown = true;
			key.isUp = false;
		}
		// Cancels the event
		event.preventDefault();
	};

	//The is released, call the upHandler
	key.upHandler = function(event) {
		// Verify the keyCode parameter matches the object code
		if (event.keyCode === key.code) {
			// If the key is down and released then release
			if (key.isDown && key.release) key.release();
			
			// Setting for button positions
			key.isDown = false;
			key.isUp = true;
		}
	// Cancels the event
	event.preventDefault();
	};

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}
/**********************************************************************************************************
Random Integer Function - Use for Asteroid Speed + Position
**********************************************************************************************************/
// Generates a random number using the Math.random from Javascript
// Random generates a number from [0,1). Min and max reachable.
function randomInt(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**********************************************************************************************************
Hit Detection Function
**********************************************************************************************************/


/*******************************************************************************************************
Asteroid Creation - Need to have them spawn in and fly to the player 
*******************************************************************************************************/
function spawnAsteroid(count, maxSpeed) {
	
	
	// Empty asteroid array	declared in global.
	
	for(var i = 0; i<count; i++){
		// Asteroid sprite created
		var asteroid = new Sprite(id["asteroid.png"]);
		
		// Random x and set Y
		var x = randomInt(0, stage.width - asteroid.width);
		var y = 300;
		
		// Set the X and Y
		asteroid.x = x;
		asteroid.y = y;
		
		// Set the velocity
		asteroid.vy = randomInt(1,maxSpeed);
		
		// Push the asteroid
		asteroids.push(asteroid);
		
		// Add to gameScene
		gameScene.addChild(asteroid);
	}
}

/**********************************************************************************************************
Asteroid Contain Function
**********************************************************************************************************/
function asteroidContain(sprite, container) {
	
	// Undef until collision, displays the collision location when a collision occurs
	var collision = undefined;
	
	// Bottom Side
	if (sprite.y + sprite.height > container.height){
		sprite.y = container.height - sprite.height;
		sprite.x = randomInt(0, stage.width - asteroid.width);
	}
	
	return collision
}

