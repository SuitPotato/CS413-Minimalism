/**********************************************************************************************************
Keith Saunders Project 1
**********************************************************************************************************/
/**********************************************************************************************************
Attaching to Gameport
**********************************************************************************************************/
// Attach to the HTML document via gameport ID
var gameport = document.getElementById("gameport");

/**********************************************************************************************************
Aliasing to Containte
**********************************************************************************************************/
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
	Sprite = PIXI.Sprite
	Text = PIXI.Text;

/**********************************************************************************************************
Creating the Stage and appending to Gameport
**********************************************************************************************************/	
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
	
/***********************************************************************************************************
Variable Creation
***********************************************************************************************************/
// Ship = Player Ship
// Asteroids = Enemy Projectile
// Space = Background
// State = State in which the game is in.
var ship, asteroid, space, state;
var asteroids = [];

/**********************************************************************************************************
Setup Function
**********************************************************************************************************/
// The setup function is called first and is used to setup the entire game.
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
	Game Over Text 
	*******************************************************************************************************/
	// Text added to gameOverScene that is displayed when the player loses the game.
	gameOverMessage = new Text(
		"Game Over!",
		{font: "64px Arial", fill: "white"}
		);
		
	gameOverMessage.x = 220;
	gameOverMessage.y = 250;
	
	gameOverScene.addChild(gameOverMessage); 
	
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
		restart = keyboard(82);
		
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
	
	restart.press = function() {
		// Do nothing on press
	}
	
	/*
	Refreshes the page instead of restarting the game. Game doesn't reinitialize
	well and was an after thought. Best method of restarting the game is to reload
	the page easily
	
	Refreshed the page on button release.
	*/
	restart.release = function() {
		window.location.reload();
	}
	/*******************************************************************************************************
	Asteroid Setup!
	*******************************************************************************************************/
	// Total of 10 asteroids
	var count = 10;
	
	for(var i = 0; i<count; i++){
		// Asteroid sprite created
		var asteroid = new Sprite(id["asteroid.png"]);
		
		// Random x and set Y
		var x = randomInt(0, stage.width - asteroid.width);
		
		// Above the game itself so it looks like it falls in
		var y = -100;
		
		// Set the X and Y
		asteroid.x = x;
		asteroid.y = y;
		
		// Set the velocity
		asteroid.vy = randomInt(1,10);
		
		// Push the asteroid
		asteroids.push(asteroid);
		
		// Add to gameScene
		gameScene.addChild(asteroid);
	}
	
	/*******************************************************************************************************
	Render Setup!
	*******************************************************************************************************/
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
	
	// Call the state
	state();
	
	// Render the stage
	renderer.render(stage);
}

/**********************************************************************************************************
Play Function and State
**********************************************************************************************************/
// Play contains the elements specific to gameplay such as player movement and handling what
// occurs if an asteroid hits a ship.
function play() {
	// Ship is defaulted to not being hit.
	shipHit = false;
	// Add (or subtract) to the ship's x-axis based on input
	ship.x += ship.vx;
	
	// Calling contain function
	contain(ship, {x: 0, y:0, width: 800, height: 700})
	
	// Calling a function on each asteroid in the asteroids[] array
	// asteroid[i].~ 
	asteroids.forEach(function(asteroid) {
		// Move each asteroid down 
		asteroid.y += asteroid.vy;
		
		// Contain the asteroids. Kept in var if needing to grab return values of asteroidContained
		var asteroidContained = asteroidContain(asteroid, {x: 0, y:0, width: 800, height: 700});
		
		// Check if the ship is hit by the asteroid
		if(hitTest(ship, asteroid)) {
			shipHit = true;
		}	
	});
	
	// If shiphit === true
	if(shipHit) {
		state = end;
	} 
}

// Ending function state
function end() {
	gameScene.visibile = false;
	gameOverScene.visible = true;
}	

/**********************************************************************************************************
Helper Functions
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
		collision = 'bottom';
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
// Takes in two rectangle sprites
// Doesn't work well with circles because it isn't a rectangle
function hitTest(r1, r2) {
	
	// Variables needed to test if there is a hit
	var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
	
	// Hit or not
	hit = false;
	
	// Finds the center of the rectangular sprites (only works with rectangles/boxes)
	r1.centerX = r1.x + r1.width / 2;
	r1.centerY = r1.y + r1.height / 2;
	r2.centerX = r2.x + r2.width / 2;
	r2.centerY = r2.y + r2.height / 2;
	
	// Divides the Height and Width by two and stores the values.
	r1.halfWidth = r1.width / 2;
	r1.halfHeight = r1.height / 2;
	r2.halfWidth = r2.width / 2;
	r2.halfHeight = r2.height / 2;
	
	// Checks the distances between centers on X and Y axis
	vx = r1.centerX - r2.centerX;
	vy = r1.centerY - r2.centerY;
	
	// Combination of sprite width's and heights
	combinedHalfWidths = r1.halfWidth + r2.halfWidth;
	combinedHalfHeights = r1.halfHeight + r2.halfHeight;
	
	// Collision on the x axis ?
	if (Math.abs(vx) < combinedHalfWidths) {
		// Collision on the y axis ?
		if (Math.abs(vy) < combinedHalfHeights) {
			  // Collision!
			  hit = true;
		} else {
			// No Collision
			hit = false;
    }
	} else {
		// No collision
		hit = false;
  }
	// Return true if hit
	return hit;
};
	
/**********************************************************************************************************
Asteroid Contain Function
**********************************************************************************************************/
// Function is used to contain the asteroids in the game space. This is also to reuse asteroids multiple
// times instead of constantly creating new asteroids.
function asteroidContain(sprite, container) {
	
	// Undef until collision, displays the collision location when a collision occurs
	var collision = undefined;
	
	// Bottom Side
	if (sprite.y + sprite.height > container.height){
		// Change the sprite location to a random y value in the range of [-500, -100]
		// Makes asteroids take longer or shorter depending on value.
		sprite.position.y = randomInt(-500, -100);
		// Random sprite x location.
		sprite.position.x = randomInt(0, stage.width - sprite.width);
		// Change the velocity within the value
		sprite.vy = randomInt(1, 10);
		//collision with the bottom
		collision = 'bottom';
	}
	return collision
}

