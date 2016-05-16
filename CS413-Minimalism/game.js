// Attach to the HTML document via gameport ID
var gameport = document.getElementById("gameport");

// Create the Renderer
// 400x400 pixel with a black background
var renderer = PIXI.autoDetectRenderer(400, 400, {BackgroundColor: 0x3344ee});

// Apply to the HTML view
gameport.appendChild(renderer.view);

// Create the stage using the Container object
var stage = new PIXI.Container();

// Creating a texture from the SmallBlock Image
var texture = PIXI.Texture.fromImage("SmallBlock.png")

// Applying the texture to a sprite
var sprite = new PIXI.Sprite(texture);

// Anchoring a pivot point in the middle
sprite.anchor.x = 0.5;
sprite.anchor.y = 0.5;


// Placing the sprite at location x=200, y=200
sprite.position.x = 200;
sprite.position.y = 200;

// Adding to the stage
stage.addChild(sprite);

function animate() {
	requestAnimationFrame(animate);
	sprite.rotation += 0.1;
	
	// Renderer 'renders' the stage.
	renderer.render(stage);
}

animate();