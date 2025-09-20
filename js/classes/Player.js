class Player extends Sprite{
	constructor({
		position, 
		collisionBlocks, 
		platformCollisionBlocks, 
		imageSrc, 
		frameRate, 
		scale = 0.5, 
		animations
	}) {
		super({imageSrc, frameRate, scale})
		this.position = position;
		this.velocity = {
			x: 0,
			y: 1,
		}
		this.direction = 'right'
		this.jumpCount = 2;
		this.collisionBlocks = collisionBlocks
		this.platformCollisionBlocks = platformCollisionBlocks
		this.hitbox = {
			position: {
				x: this.position.x,
				y: this.position.y,
			},
			width: 16,
			height: 27,
		}

		this.animations = animations
		
		for (let key in this.animations) {
			const image = new Image()
			image.src = this.animations[key].imageSrc

			this.animations[key].image = image
		}

		this.camerabox = {
			position: {
				x: this.hitbox.position.x,
				y: this.hitbox.position.y,
			},
			width: 200,
			height: 80,
		}
	}

	switchSprite(key) {
		if(this.image === this.animations[key].image || !this.loaded) return

		this.currentFrame = 0
		this.image = this.animations[key].image
		this.frameBuffer = this.animations[key].frameBuffer
		this.frameRate = this.animations[key].frameRate
	}

	checkForHorizontalCanvasCollision() {
		if(player.direction == 'right' && this.hitbox.position.x + this.hitbox.width >= 576)
			this.velocity.x = 0

		if(player.direction == 'left' && this.hitbox.position.x <= 0)
			this.velocity.x = 0
	}

	shouldPanCameraToTheLeft({canvas, camera}) {
		const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width
		const scaledDownCanvasWidth = canvas.width / 4

		if(cameraboxRightSide >= 576) return

		if (cameraboxRightSide >= scaledDownCanvasWidth + Math.abs(camera.position.x)) {
			camera.position.x -= this.velocity.x
		}
	}

	shouldPanCameraToTheRight({canvas, camera}) {
		const cameraboxLeftSide = this.camerabox.position.x

		if(cameraboxLeftSide <= 0) return

		if (cameraboxLeftSide <= Math.abs(camera.position.x)) {
			camera.position.x -= this.velocity.x
		}
	}

	shouldPanCameraDown({canvas, camera}) {
		const cameraboxTopSide = this.camerabox.position.y

		if(cameraboxTopSide + this.velocity.y <= 0) return

		if (cameraboxTopSide <= Math.abs(camera.position.y)) {
			camera.position.y -= this.velocity.y
		}
	}

	shouldPanCameraUp({canvas, camera}) {
		const cameraboxDownSide = this.camerabox.position.y + this.camerabox.height
		const scaledDownCanvasHeight = canvas.height / 4

		if(cameraboxDownSide + this.velocity.y >= 432) return

		if (cameraboxDownSide >= scaledDownCanvasHeight + Math.abs(camera.position.y)) {
			camera.position.y -= this.velocity.y
		}
	}

	update() {
		this.updateFrames()
		this.updateHitbox()
		this.updateCamerabox()


		// // draws out the image
		// c.fillStyle  = 'rgba(0, 255, 0, 0.2)'
		// c.fillRect(this.position.x, this.position.y, this.width, this.height)

		// // draws out the hitbox
		// c.fillStyle  = 'rgba(255, 0, 0, 0.2)'
		// c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height)

		// // draws out the camerabox
		// c.fillStyle  = 'rgba(0, 0, 255, 0.2)'
		// c.fillRect(this.camerabox.position.x, this.camerabox.position.y, this.camerabox.width, this.camerabox.height)


		this.draw()

		this.position.x += this.velocity.x
		this.updateHitbox()
		this.checkForHorizontalCollisions()
		this.applyGravity()
		this.updateHitbox()
		this.checkForVerticalCollisions()
	}

	updateHitbox() {
		this.hitbox = {
			...this.hitbox,
			position: {
				x: this.position.x + 32,
				y: this.position.y + 26,
			},
		}
	}

	updateCamerabox() {
		this.camerabox = {
			...this.camerabox,
			position: {
				x: this.hitbox.position.x - (this.camerabox.width - this.hitbox.width)/2,
				y: this.hitbox.position.y - (this.camerabox.height - this.hitbox.height)/2,
			},
		}
	}

	checkForHorizontalCollisions() {
		for(let i = 0; i < this.collisionBlocks.length; i++) {
			const collisionBlock = this.collisionBlocks[i]
		
			if(collision({
				object1: this.hitbox,
				object2: collisionBlock,
			})
			) {
				// console.log('we are colliding horizontally');
				if(this.velocity.x > 0) {
					this.velocity.x = 0

					const offset = this.hitbox.position.x - this.position.x + this.hitbox.width

					this.position.x = collisionBlock.position.x - offset - 0.01
					break;
				}

				if(this.velocity.x < 0) {
					this.velocity.x = 0

					const offset = this.hitbox.position.x - this.position.x 

					this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01
					break;
				}
			}
		}
	}

	applyGravity() {
		this.velocity.y += gravity;
		this.position.y += this.velocity.y
	}

	checkForVerticalCollisions() {
		for(let i = 0; i < this.collisionBlocks.length; i++) {
			const collisionBlock = this.collisionBlocks[i]
		
			if(collision({
				object1: this.hitbox,
				object2: collisionBlock,
			})
			) {
				// console.log('we are colliding vertically');
				if(this.velocity.y > 0) {
					this.velocity.y = 0
					this.jumpCount = 2;

					const offset = this.hitbox.position.y - this.position.y + this.hitbox.height

					this.position.y = collisionBlock.position.y - offset - 0.01
					break;
				}

				if(this.velocity.y < 0) {
					this.velocity.y = 0

					const offset = this.hitbox.position.y - this.position.y 

					this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01
					break;
				}
			}
		}

		// Platform collisions
		for(let i = 0; i < this.platformCollisionBlocks.length; i++) {
			const platformCollisionBlock = this.platformCollisionBlocks[i]
		
			if(platformCollision({
				object1: this.hitbox,
				object2: platformCollisionBlock,
			})
			) {
				// console.log('we are colliding vertically with platform');
				if(this.velocity.y > 0) {
					this.velocity.y = 0
					this.jumpCount = 2;

					const offset = this.hitbox.position.y - this.position.y + this.hitbox.height

						this.position.y = platformCollisionBlock.position.y - offset - 0.01
					break;
				}
			}
		}
	}
}