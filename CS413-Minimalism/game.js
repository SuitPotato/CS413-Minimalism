// Attach to the HTML document via gameport ID
var gameport = document.getElementById("gameport");

// Using Aliasing 
var Container = PIXI.Container,
	autoDetectRenderer = PIXI.autoDetectRenderer,
	loader = PIXI.loader,
	resources = PIXI.loader.resources,
	Sprite = PIXI.Sprite;
	
// Creating the PIXI stage and renderer
var stage = new Container(),
	renderer = autoDetectRenderer(800, 600, {backgroundColor: 0x000000});
// Appying to the HTML view
gameport.appendChild(renderer.view);
	
// Load an image and run the 'setup' when it's done
loader
	.add("images/SmallBlock.png")
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
	
function setup() {
	var block = new Sprite(resources["images/SmallBlock.png"].texture);
	
	
	// Location for Spaceship (idea)
	block.x = 400;
	block.y = 570;
	
	stage.addChild(block);
	renderer.render(stage);
}
	


