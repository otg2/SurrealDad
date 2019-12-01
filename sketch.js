
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

var drawingRender;
var isMobile = false;


function preload()
{
	drawImage = loadImage('img/teikn2.png'); 
	realImage = loadImage('img/adal.png'); 
}

$(window).resize(function(){
	drawImage = loadImage('img/teikn2.png'); 
	realImage = loadImage('img/adal.png'); 
	var drawingSize = $(".outsideWrapper")[0];
	
	resizeCanvas(drawingSize.clientWidth, drawingSize.clientHeight);
	drawImage.resize(drawingSize.clientWidth, drawingSize.clientHeight); 
	realImage.resize(drawingSize.clientWidth, drawingSize.clientHeight);
	
	canvasImage.resize(drawingSize.clientWidth, drawingSize.clientHeight);
	
	
	if(drawState == "_PASSIVE" || managaTransition) 
	{	ypos = height/2;
		xpos = width/2;
	}
});

function setup() {
  
	  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
		|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
		isMobile = true;
	}
	
	z_off = 0;
	drawState = localStorage["__CURR_STATE"] === null ? "_ACTIVE" : localStorage["__CURR_STATE"];
	$("#cmn-toggle-1")[0].checked = drawState ==  "_PASSIVE";
	dirIndex = 2;
	
	var drawingSize = $(".outsideWrapper")[0];
	var canvas = createCanvas(drawingSize.clientWidth, drawingSize.clientHeight);
	canvas.parent('wrappHolder');

	$("#cmn-toggle-2")[0].checked = localStorage["__CURR_IMAGE"] == "realImage";
	drawingRender = localStorage["__CURR_IMAGE"] == "realImage" ?  true :  false;
	
	drawImage.resize(drawingSize.clientWidth, drawingSize.clientHeight); 
	realImage.resize(drawingSize.clientWidth, drawingSize.clientHeight); 
	
	canvasImage = drawingRender ?  drawImage :  realImage;
	
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

	var particleNumber = isMobile ? 10 : 70;

	for (var i = 0; i < particleNumber; i++) {
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
		
		if(isMobile && drawState=="_PASSIVE")
		{
			ypos = height/2;
			xpos = width/2;
		}
});


function manageBackgroundDrawing()
{
		
	lerpState = !lerpState;
	if(!drawingRender)
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
	drawingRender =! drawingRender;
	
	localStorage["__CURR_IMAGE"] = !drawingRender ? "drawImage" : "realImage";
	manageBackgroundDrawing();
	
	var drawingSize = $(".outsideWrapper")[0];
	
	drawImage.resize(drawingSize.clientWidth, drawingSize.clientHeight); 
	realImage.resize(drawingSize.clientWidth, drawingSize.clientHeight);
	
	canvasImage = drawingRender ? drawImage : realImage;
	
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




