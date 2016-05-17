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
	
// Load a JSON file and run the setup function. 
// 'adds' the JSON sheet
loader
	.add("images/sheet.json")
	//.on("progress", loadProgressHandler)
	.load(setup);
	
/*	
function loadProgressHandler(loader, resource) {
	
	// Displays the file location that is being loaded
	console.log("Loading: " + resource.url);
	
	// Display the percentage of the total files currently loaded
	console.log("Progress: " + loader.progress + "%")
}
*/

// Defining several variables that will be used multiple times	
var playership, asteroid, space;
	
function setup() {
	
	
	
	// Accessing TextureCache directly to grab the Background/Ship/Asteroid.
	var spaceTexture = TextureCache["Background.png"];
	var shipTexture = TextureCache["Pship.png"];
	var asteroidTexture = TextureCache["asteroid.png"];
	
	// Creating space sprite and applying to stage.
	space = new Sprite(spaceTexture);
	stage.addChild(space);
	
	// Creating ship sprite and applying to stage.
	ship = new Sprite(shipTexture);
	ship.x = 300;
	ship.y = 300;
	stage.addChild(ship);
	
	
	id = PIXI.loader.resources["images/sheet.json"].textures;
	asteroid = new Sprite(id["asteroid.png"]);
	stage.addChild(asteroid);
	

	renderer.render(stage);
}

// Animate function recreated
function gameLoop() {
	
	// Constantly loop through this function
	requestAnimationFrame(gameLoop);
	
	// Shift the ship .10 of a pixel to the right each loop
	ship.x += 0.1;
	
	// Render the stage
	renderer.render(stage);
}

gameLoop();
	


