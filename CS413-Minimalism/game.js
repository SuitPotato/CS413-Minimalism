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


// Defining several variables that will be used multiple times	
/***********************************************************************************************************
Variable Creation
***********************************************************************************************************/
// Ship = Player Ship
// Asteroid = Enemy Projectile
// Space = Background
// State = State in which the game is in.
var ship, asteroid, space, state;

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
	Asteroid Creation - Need to have them spawn in and fly to the player 
	*******************************************************************************************************/
	asteroid = new Sprite(id["asteroid.png"]);
	stage.addChild(asteroid);
	
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

function play() {
	ship.x += ship.vx;
}	


