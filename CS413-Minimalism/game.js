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
	.load(setup);
	
	
function setup() {
	var block = new Sprite(resources["images/SmallBlock.png"].texture);
	stage.addChild(block);
	renderer.render(stage);
}
	


