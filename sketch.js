
// python -m http.server 5200
let drawImage; 
let realImage;

let canvasImage;

let drawState = "_ACTIVE";

let lerpState = true;

let maskColor;

let circle = [];
let square = [];
let morph = [];

let dirIndex;

let drawFlow;
let drawNoise;
var inc = 0.1;
var scl = 10;
var cols, rows;

var zoff = 0;
var particles = [];
var flowfield;

let rad = 60; 
let xpos, ypos; 

let xspeed = 3.8; 
let yspeed = 3.2; 

let xdirection = 1; 
let ydirection = 1; 

let initSize = 150;
let currSliderVal = 1;

let noiseVal;
let x_increment = 0.01;
let z_increment = 0.02;
let z_off, y_off, x_off;
let managaTransition = false;
let volume = 100; 
let easing = 0.15;
let radius = 24;
let edge = 110;
let inner = edge + radius;
let ellipse_xoff = 0;
let tempScale = 1;
let activeZoom = 1;

let mx;
let my;

function preload()
{
	drawImage = loadImage('img/teikn2.png'); 
	realImage = loadImage('img/adal.png'); 
}

function setup() {
  
	z_off = 0;
	drawState = localStorage["__CURR_STATE"] === null ? "_ACTIVE" : localStorage["__CURR_STATE"];
	$("#cmn-toggle-1")[0].checked = drawState ==  "_PASSIVE";
	dirIndex = 2;
	
	var drawingSize = $(".outsideWrapper")[0];
	var canvas = createCanvas(drawingSize.clientWidth, drawingSize.clientHeight);
	canvas.parent('wrappHolder');

	$("#cmn-toggle-2")[0].checked = localStorage["__CURR_IMAGE"] == "realImage";
	canvasImage = localStorage["__CURR_IMAGE"] == "realImage" ?  drawImage :  realImage;
	manageBackgroundDrawing();
	
	maskColor = color(255,255,255,255);
	
	xpos = width / 2;
	ypos = height / 2;
	mx = xpos;
	my = ypos;
	mouseX = mx;
	mouseY = my;
	
	// Set up flow fields
	cols = floor(width / scl);
	rows = floor(height / scl);

	flowfield = new Array(cols * rows);
	drawFlow = true;

	for (var i = 0; i < 100; i++) {
		particles[i] = new Particle();
	}
	
	if(localStorage["__CURR_SLIDER"] != null) 
	{
		currSliderVal = localStorage["__CURR_SLIDER"];
		$("#slider1")[0].value = 50*currSliderVal;
	}
	
	for (let angle = 0; angle < 360; angle += 9) 
	{
		morph.push(createVector());
	}
	
	createActiveCircle(initSize );
	$("#curtain").fadeOut(2000,function() { $("#curtain").remove(); });
	
}

function createActiveCircle(activeSize)
{
	
	circle = [];
	square = [];
	
	for (let angle = 0; angle < 360; angle += 9) 
	{
		let v = p5.Vector.fromAngle(radians(angle - 135));
		v.mult(activeSize*1.2);
		circle.push(v);
	}
	let increment = 0.20*activeSize;
	
	for (let x = (-1)*activeSize; x < activeSize; x += increment) {
		square.push(createVector(x, (-1)*activeSize));
	}
	for (let y = (-1)*activeSize; y < activeSize; y += increment) {
		square.push(createVector(activeSize, y));
	}
	for (let x = activeSize; x > (-1)*activeSize; x -= increment) {
		square.push(createVector(x, activeSize));
	}
	for (let y = activeSize; y > (-1)*activeSize; y -= increment) {
		square.push(createVector((-1)*activeSize, y));
	}
}



$( "#cmn-toggle-1" ).click(function() {
  drawState = $("#cmn-toggle-1").is(':checked') == false
	? "_ACTIVE" 
	: "_PASSIVE";
	
	dirIndex = drawState ==  "_PASSIVE" ? 1 : 2;
	
	localStorage["__CURR_STATE"] = drawState;
	managaTransition = true;
		let fadeVolume = setInterval(function(){
			volume -= 5;
			if(volume < 0) {
			  clearInterval(fadeVolume);
			  managaTransition = false;
			  volume = 100;
			  dirIndex = 2;
			}
		}, 10);
});



function manageBackgroundDrawing()
{
		
	lerpState = !lerpState;
	if(canvasImage == realImage)
	{
		$("#realBackground").fadeOut(1000);//hide();
		$("#drawBackground").fadeIn(1000);//show();
	}
	else
	{
		$("#realBackground").fadeIn(1000);//show();
		$("#drawBackground").fadeOut(1000);//hide();
	}
}


$( "#cmn-toggle-2" ).click(function() 
{
	canvasImage = canvasImage == realImage ? drawImage : realImage;
	localStorage["__CURR_IMAGE"] = canvasImage == realImage ? "drawImage" : "realImage";
	manageBackgroundDrawing();
});
function handleSliderVal(val)
{
	currSliderVal = val / 50;
	localStorage["__CURR_SLIDER"] = currSliderVal;
}



function draw() {
	
	clear();
	blendMode(MULTIPLY);
	fill(0, 0, 0);
	smooth();
	
	
	if (abs(currSliderVal - tempScale) > 0.1) {
		tempScale += (currSliderVal - tempScale) * easing ;
	}
	
	let volScale;
	if(drawState ==  "_PASSIVE")
		volScale = dirIndex- (volume/100);
	else
		volScale = (volume/100);
	
	if(drawState == "_ACTIVE" || managaTransition)
	{
		let totalDistance = 0;
		
		if (abs(mouseX - mx) > 0.1) 
		{
			mx = mx + (mouseX - mx) * easing;
		}
		if (abs(mouseY - my) > 0.1) {
			my = my + (mouseY - my) * easing;
		}
		mx = constrain(mx, inner*currSliderVal, width - inner*currSliderVal);
		my = constrain(my, inner*currSliderVal, height - inner*currSliderVal);
		
		for (let i = 0; i < circle.length; i++) {
		let v1;
		if (lerpState) {
		  v1 = circle[i];
		} else {
		  v1 = square[i];
		}
		let v2 = morph[i];
		v2.lerp(v1, 0.15);
		totalDistance += p5.Vector.dist(v1, v2);
		}

		if (totalDistance < 0.9) {
		lerpState = !lerpState;
		}

		translate(mx, my);
		strokeWeight(1);
		beginShape();
		stroke(1);
		
		if(managaTransition) activeZoom= (1-volScale)*currSliderVal;
		else activeZoom = tempScale;
		
		morph.forEach(v => {
		vertex(v.x*activeZoom, v.y*activeZoom);
		});
		endShape(CLOSE);
		translate(-mx, -my);
		strokeWeight(1);
	}
	
	if(drawState == "_PASSIVE" || managaTransition)
	{
			
			let transitScale = volScale*volScale;
			  xpos = xpos + xspeed * xdirection;
			  ypos = ypos + yspeed * ydirection;

			  if (xpos > width - rad || xpos < rad) {
				xdirection *= -1;
			  }
			  if (ypos > height - rad || ypos < rad) {
				ydirection *= -1;
			  }

			  let n = noise(ellipse_xoff) * 10;
			  ellipse_xoff += 0.11;
			  
			  let radVal = (tempScale*(rad*tempScale*2 + n*5)*transitScale);
			  ellipse(xpos, ypos, radVal, radVal);
			
			var yoff = 0;
			for (var y = 0; y < rows; y++) 
			{
				var xoff = 0;
				for (var x = 0; x < cols; x++) 
				{
				  var index = x + y * cols;
				  var angle = noise(xoff, yoff, zoff) * PI * 4;
				  var v = p5.Vector.fromAngle(angle*0.5);
				  v.setMag(1);
				  flowfield[index] = v;
				  xoff += inc;
				}
				yoff += inc;
				zoff += 0.0003;
			}
			let activeScale = tempScale*3;
			for (var i = 0; i < particles.length; i++) 
			{
				particles[i].follow(flowfield);
				particles[i].update();
				particles[i].edges();
				particles[i].show(xpos, ypos, activeScale, transitScale);
			}
		
			strokeWeight(1);
	}
	
	
	// handle masking
	fill(maskColor);
	rect(0,0,canvasImage.width, canvasImage.height);
	blendMode(SCREEN   );
	image(canvasImage, 0, 0);
	loadPixels();
	let d = pixelDensity();
	let halfimage = 4 * (width * d * (height  * d));
	for(let i = 0; i < halfimage; i+= 4)
	{
		let absVal = 250;
		if(pixels[i] > absVal && pixels[i+1] > absVal && pixels[i+3] > absVal)
		{
			pixels[i+3] = 0;
		}
		else
			pixels[i+3] = 255;
	}
	
	updatePixels();
}




