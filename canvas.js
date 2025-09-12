// console.log("r/place")

const canvas = document.querySelector("canvas");
c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


// c.fillStyle = 'rgba(255, 0, 0, 0.2)'
// c.fillRect(100, 100, 100, 100)
// c.fillStyle = 'rgba(0, 0, 255, 0.2)'
// c.fillRect(400, 200, 100, 100)
// c.fillRect(200, 400, 100, 100)
// c.fillStyle = 'rgba(0, 255, 0, 0.2)'
// c.fillRect(300, 300, 100, 100)

// console.log(canvas);


// Line

// c.beginPath();
// c.moveTo(50, 300);
// c.lineTo(300, 100);
// c.lineTo(400, 300)
// c.strokeStyle = "#fa34a3"
// c.stroke();

// Arc

// c.beginPath();
// c.arc(300, 300, 30, 0, Math.PI * 2, false);
// c.strokeStyle = "blue";
// c.stroke()

// for(let i = 0; i < 10; i++) {
// 	let x = Math.random() * (window.innerWidth - 60) + 30;
// 	let y = Math.random() * (window.innerHeight - 60) + 30;
// 	c.beginPath();
// 	c.arc(x, y, 30, 0, Math.PI * 2, false);
// 	c.strokeStyle = "blue";
// 	c.stroke()
// }

// let radius = 30;
// console.log(window.innerWidth);

// let circlesX = Array.from(Array(window.innerWidth - 60)).map((e,i)=> i + radius)
// let circlesY = Array.from(Array(window.innerHeight - 60)).map((e,i)=> i + radius)

// for(let i = 0; i < 1000; i++) {
// 	let arrayXElement = Math.floor(Math.random() * (circlesX.length - 1))
// 	let arrayYElement = Math.floor(Math.random() * (circlesY.length - 1))
// 	let x = circlesX[arrayXElement];
// 	let y = circlesY[arrayYElement];

// 	circlesX.splice(arrayXElement, 30)
// 	circlesX.splice(arrayYElement, 30)

// 	c.beginPath();
// 	c.arc(x, y, 30, 0, Math.PI * 2, false);
// 	c.strokeStyle = "blue";
// 	c.stroke()
// }

// console.log(circlesX);
// console.log(circlesX.splice(10 - 60, 5))
// console.log(circlesX);


// let x = Math.random() * (window.innerWidth - 60) + 30;
// let y = Math.random() * (window.innerHeight - 60) + 30;
// let dx = Math.random() - 0.5 * 20;
// let dy = Math.random() - 0.5 * 20;
// var radius = 30;
let mouse = {
	x: undefined,
	y: undefined,
	click: false,
	clickCount: 0,
}
let maxRadius = 40;

let colorArray = [
	'#012030',
	'#13678A',
	'#45C4B0',
	'#9AEBA3',
	'#DAFDBA'
]

window.addEventListener('mousemove', function(event) {
	mouse.x = event.x
	mouse.y = event.y
	// console.log(mouse);
});

window.addEventListener('mousedown', function(event) {
	mouse.click = true;
	let explosionAudio = new Audio('audios/fast_explosion.mp3')
	mouse.clickCount++;
	if(mouse.clickCount%20 == 0) {
		let gostrogonocoff = new Audio('audios/gostrogonocoff.mp3')
		gostrogonocoff.play()
	}
	explosionAudio.play();

	console.log(mouse);
});

let circleQuantity = Math.floor(window.innerWidth * window.innerHeight / 800);
// console.log(circleQuantity);

window.addEventListener('resize', function(event) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	circleQuantity = Math.floor(window.innerWidth * window.innerHeight / 800);
	// console.log(circleQuantity);

	init();
})


function Circle(x, y, dx, dy, radius) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.radius = radius;
	this.minRadius = radius;
	this.initialAbsDx = Math.abs(dx);
	this.initialAbsDy = Math.abs(dy);
	this.explosionAcceleration = 18;
	this.returnAcceleration = 0.5;
	this.color = colorArray[Math.floor(Math.random() * (colorArray.length))];

	this.draw = function() {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		c.fillStyle = this.color;
		c.fill()
	}

	this.update = function() {
		//quicando nas bordas
		if(this.x + this.radius > innerWidth || this.x - this.radius < 0) {
			this.dx = -this.dx;
		}
		if(this.y + this.radius > innerHeight || this.y - this.radius < 0) {
			this.dy = -this.dy;
		}
		this.x += this.dx;
		this.y += this.dy;

		// interatividade
		if(mouse.x - this.x < 50 
			&& mouse.x - this.x > -50
			&& mouse.y - this.y < 50 
			&& mouse.y - this.y > -50
		) {
			if(mouse.click == true) this.explode();
			if(this.radius < maxRadius) this.radius += 1;
		} else {
			if(this.radius > this.minRadius) this.radius -= 1;
			this.return()
		}

		this.draw();
	}

	this.explode = function() {
		if(mouse.x - this.x < 0) {
			this.dx = this.explosionAcceleration * Math.abs(dx);
		}
		if(mouse.x - this.x > 0) {
			this.dx = -this.explosionAcceleration * Math.abs(dx);
		}
		if(mouse.y - this.y < 0) {
			this.dy = this.explosionAcceleration * Math.abs(dy);
		}
		if(mouse.y - this.y > 0) {
			this.dy = -this.explosionAcceleration * Math.abs(dy);
		}

		//console.log("blow");
	}

	this.return = function() {
		if(Math.abs(this.dx) >= (this.initialAbsDx + this.returnAcceleration)){
			if(this.dx >= 0) this.dx -= this.returnAcceleration;
			else this.dx += this.returnAcceleration;
		} else {
			if(this.dx >= 0) this.dx = this.initialAbsDx;
			else this.dx = -this.initialAbsDx;
		}
		if(Math.abs(this.dy) >= (this.initialAbsDy + this.returnAcceleration)){
			if(this.dy >= 0) this.dy -= this.returnAcceleration;
			else this.dy += this.returnAcceleration;
		} else {
			if(this.dy >= 0) this.dy = this.initialAbsDy;
			else this.dy = -this.initialAbsDy;
		}
	}
}



//console.log(circleArray);

let circleArray = []


function init() {

	circleArray = [];
	for (let i = 0; i < circleQuantity; i++) {
		let radius = (Math.random() * 3 + 1);
		let x = Math.random() * (window.innerWidth - 2 * radius) + radius;
		let y = Math.random() * (window.innerHeight - 2 * radius) + radius;
		let dx = (Math.random() - 0.5) * 4;
		let dy = (Math.random() - 0.5) * 4;
		circleArray.push(new Circle(x, y, dx, dy, radius))
	}
}

function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, innerWidth, innerHeight);

	for(let i = 0; i < circleArray.length; i++) {
		circleArray[i].update()
	}
	mouse.click = false
}


animate()
init()