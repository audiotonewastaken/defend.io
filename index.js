Hours_Wasted_On_This_Useless_Project=Infinity 
playerX = 0
playerY = 0

var keymap = {}
hasMoved=true
learderboard = {}

canshoot = true;

var mouseX = width/2;
var mouseY = height/2;

shootangle = 0

direction = 0

speed = 5

maxLen = Math.max(width, height)

setInterval(function(){

	rect(mouseX, mouseY, 10, 10, "black")
	moveMe(playerX, playerY, direction)
	
}, 5000)

setInterval(function(){
	if(hasMoved){
		hasMoved=false
		moveMe(playerX, playerY, direction)
	}
}, 100)

document.addEventListener("mousemove", () => {
  mouseX = event.clientX; 
  mouseY = event.clientY; 
	
	direction = Math.atan2(
		mouseY-(height/2),
		mouseX-(width/2),
	)

});

function launchArrow(){
	if(canshoot){
		socket.send(
			"arrow "+(playerX+Math.cos(direction)*100)+","+(playerY+Math.sin(direction)*100)+","+direction
		)
		canshoot = false
		shootangle+=0.05
		setTimeout(function(){
			canshoot = true
		}, 100)
	}
}



speed = 2;
function checkkeys(){
	//console.log(keymap)
	if(kdown(38) || kdown(87)){
		playerY-=speed;
		hasMoved = true;
	}
	if(kdown(40) || kdown(83)){
		playerY+=speed;
		hasMoved = true;
	}
	if(kdown(37) || kdown(65)){
		playerX-=speed;
		hasMoved = true;
	}
	if(kdown(39) || kdown(68)){
		playerX+=speed;
		hasMoved = true;
	}

}
function canvas_click(){
	event.preventDefault();
  event.stopPropagation();
	launchArrow();
}
setInterval(checkkeys, 10)

function kdown(k){
	return keymap[k];
}