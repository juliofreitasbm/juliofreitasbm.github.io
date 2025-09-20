const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

// Deactivate WAD message
imgWAD = document.getElementById('wad');
setTimeout(() => {
	imgWAD.classList.add('fade-out');
},5000)
setTimeout(() => {
	imgWAD.style.display = 'none';
},6000)

// Background audio

let backgroundAudio = new Audio("audios/merry-wanderers.mp3")
backgroundAudio.loop = true;
backgroundAudio.volume = 0.1;
backgroundAudio.play()

window.addEventListener('focus', function(event){
	backgroundAudio.play()
})

window.addEventListener('blur', function(event){
	backgroundAudio.pause()
})

const scaledCanvas = {
	width: canvas.width/4,
	height: canvas.height/4
}

const floorCollisions2D = [];
for(let i = 0; i < floorCollisions.length; i += 36) {
	floorCollisions2D.push(floorCollisions.slice(i, i+36));
};
// console.log(floorCollisions2D);

const platformCollisions2D = [];
for(let i = 0; i < platformCollisions.length; i += 36) {
	platformCollisions2D.push(platformCollisions.slice(i, i+36));
};
// console.log(platformCollisions2D);


const collisionBlocks = []
floorCollisions2D.forEach((row, y) => {
	row.forEach((symbol, x) => {
		if(symbol === 192) {
			// console.log('draw a block');
			collisionBlocks.push(
				new CollisionBlock({position: {
					x: x * 16,
					y: y * 16,
				}})
			)
		}
	})
})

const platformCollisionBlocks = []
platformCollisions2D.forEach((row, y) => {
	row.forEach((symbol, x) => {
		if(symbol === 192) {
			platformCollisionBlocks.push(
				new CollisionBlock({
					position: {
						x: x * 16,
						y: y * 16,
					},
					height: 4
				})
			)
		}
	})
})

// console.log(collisionBlocks);


const gravity = 0.1;


const player = new Player({
	position:{
		x: 100,
		y: 300
	},
	collisionBlocks,
	platformCollisionBlocks,
	imageSrc: './img/warrior/Idle.png',
	frameRate: 8,
	animations: {
		Idle: {
			imageSrc: './img/warrior/Idle.png',
			frameRate: 8,
			frameBuffer: 3,
		},
		IdleLeft: {
			imageSrc: './img/warrior/IdleLeft.png',
			frameRate: 8,
			frameBuffer: 3,
		},
		Run: {
			imageSrc: './img/warrior/Run.png',
			frameRate: 8,
			frameBuffer: 5,
		},
		RunLeft: {
			imageSrc: './img/warrior/RunLeft.png',
			frameRate: 8,
			frameBuffer: 5,
		},
		Jump: {
			imageSrc: './img/warrior/Jump.png',
			frameRate: 2,
			frameBuffer: 3,
		},
		JumpLeft: {
			imageSrc: './img/warrior/JumpLeft.png',
			frameRate: 2,
			frameBuffer: 3,
		},		
		Fall: {
			imageSrc: './img/warrior/Fall.png',
			frameRate: 2,
			frameBuffer: 3,
		},
		FallLeft: {
			imageSrc: './img/warrior/FallLeft.png',
			frameRate: 2,
			frameBuffer: 3,
		},
	}
})


const keys = {
	d: {
		pressed: false,
	},
	a: {
		pressed: false,
	}
}

const background = new Sprite({
	position: {
		x: 0,
		y: 0,
	},
	imageSrc: './img/background.png'
})

const backgroundImageHeight = 432
const camera = {
	position: {
		x: 0,
		y: -backgroundImageHeight + scaledCanvas.height,
	}
}

function animate() {
	window.requestAnimationFrame(animate);

	c.fillStyle = 'white';
	c.fillRect(0, 0, canvas.width, canvas.height);

	c.save()
	c.scale(4, 4)
	c.translate(camera.position.x, camera.position.y)
	background.update()

	// collisionBlocks.forEach((collisionBlock) => {collisionBlock.update()})
	// platformCollisionBlocks.forEach((platformCollisionBlock) => {platformCollisionBlock.update()})

	player.checkForHorizontalCanvasCollision()
	player.update();

	player.velocity.x = 0;
	if (keys.d.pressed) {
		player.switchSprite('Run')
		player.velocity.x = 2
		player.direction = 'right'
		player.shouldPanCameraToTheLeft({canvas, camera})
	}
	else if(keys.a.pressed) {
		player.switchSprite('RunLeft')
		player.velocity.x = -2
		player.direction = 'left'
		player.shouldPanCameraToTheRight({canvas, camera})
	}
	else if(player.velocity.y === 0) {
		if(player.direction === 'right') player.switchSprite('Idle')
		else player.switchSprite('IdleLeft')
	}

	if(player.velocity.y < 0) {
		if(player.direction === 'right') player.switchSprite('Jump')
		else player.switchSprite('JumpLeft')

		player.shouldPanCameraDown({canvas, camera})
	}
	else if (player.velocity.y > 0){
		if(player.direction === 'right') player.switchSprite('Fall')
		else player.switchSprite('FallLeft')


		player.shouldPanCameraUp({canvas, camera})
		if(player.jumpCount > 1) player.jumpCount = 1
	} 

	c.restore()
}


animate()

window.addEventListener('keydown', (event) => {
	switch(event.key) {
		case 'd':
			keys.d.pressed = true;
			break;
		case 'a':
			keys.a.pressed = true;
			break;
		case 'w':
			if(player.jumpCount > 0) {
				player.velocity.y = -3.2;
				player.jumpCount--;
			}
	} 
})

window.addEventListener('keyup', (event) => {
	switch(event.key) {
		case 'd':
			keys.d.pressed = false;
			break;
		case 'a':
			keys.a.pressed = false;
			break;
	} 
})