// Attach to the HTML document via gameport ID
var gameport = document.getElementById("gameport");

// Create the Renderer
// 400x400 pixel with a black background
var renderer = PIXI.autoDetectRenderer(400, 400, {BackgroundColor: 0x3344ee});

// Apply to the HTML view
gameport.appendChild(renderer.view);

// Create the stage using the Container object
var stage = new PIXI.Container();

var texture = PIXI.Texture.fromImage("SmallBlock.png")

var sprite = new PIXI.Sprite(texture);

sprite.anchor.x = 0.5;
sprite.anchor.y = 0.5;

sprite.position.x = 200;
sprite.position.y = 200;

stage.addChild(sprite);

function animate() {
	requestAnimationFrame(animate);
	sprite.rotation += 0.1;
	
	// Renderer 'renders' the stage.
	renderer.render(stage);
}

animate();