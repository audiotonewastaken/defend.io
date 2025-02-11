let socket = new WebSocket("wss://defendws.herokuapp.com/");

lose = false;

isconnected=false;


players = []

socket.onopen = function(e) {
  console.log("[open] Connection established");
  socket.send("name "+myname);
};

function createPlayers(){
	ctx.clearRect(0, 0, width, height)
	for(xgrass=-10000;xgrass<10000;xgrass+=500){
		for(ygrass=-10000;ygrass<10000;ygrass+=500){
			ctx.drawImage(grass, xgrass-playerX+width/2, ygrass-playerY+height/2);
		}
	}

	objects.forEach(function(play){
		//console.log(play["type"])
		if(play["type"]=="player"){
			playerpos = [
				mathmap(play["x"]-playerX, width/maxLen*-1000, width/maxLen*1000, 0, width), 
				mathmap(play["y"]-playerY, height/maxLen*-1000, height/maxLen*1000, 0, height)
			]


			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.moveTo(playerpos[0]+26, playerpos[1]-75);
			ctx.lineTo(playerpos[0]+26,
								 playerpos[1]-10);
			ctx.stroke();
			
			rect(playerpos[0]+48, playerpos[1]-60, 32, 42, "black")//flag
			rect(playerpos[0]+48, playerpos[1]-60, 30, 40, play["color"])
			
			angleBetween = Math.atan2(playerpos[1]-height/2, playerpos[0]-width/2)
			if(Math.abs(playerpos[0]-width/2)>width/4 && Math.abs(playerpos[1]-height/2)>height/4){
				rect(
					(Math.cos(angleBetween)*width/2.2)+width/2,
					(Math.sin(angleBetween)*height/2.2)+height/2,
					20, 20, "black")
				rect(
					(Math.cos(angleBetween)*width/2.2)+width/2,
					(Math.sin(angleBetween)*height/2.2)+height/2,
					10, 10, play["color"])
			}
			for(g in play["guards"]){
				guardpos = [
					mathmap(play["guards"][g][0]-playerX, width/maxLen*-1000, width/maxLen*1000, 0, width), 
					mathmap(play["guards"][g][1]-playerY, height/maxLen*-1000, height/maxLen*1000, 0, height)
				]
				rect(guardpos[0], guardpos[1], 20, 20, "black")
				rect(guardpos[0], guardpos[1], 10, 10, play["color"])
			}


		
			
			ctx.drawImage(playerimg,
										(playerpos[0])-playerimg.width/2,
										(playerpos[1])-playerimg.height/2, 
										playerimg.width,
										playerimg.height);


			ctx.restore();


			healthbar = mathmap(play["health"], 0, 100, 0, 70)
			
			rect(
				playerpos[0],
				playerpos[1]-90,
				25, 75,
				"black"
			)

			ctx.rect(playerpos[0]-35,playerpos[1]-100, healthbar, 20);
			ctx.fillStyle = "green"
			ctx.fill()

			ctx.fillStyle = "black"
			ctx.font = '10px san-serif';
    	ctx.fillText(play["name"], playerpos[0],playerpos[1]+40);

			
		}
		else if(play["type"]=="arrow"){
			arrowpos = [
				mathmap(play["x"]-playerX, width/maxLen*-1000, width/maxLen*1000, 0, width), 
				mathmap(play["y"]-playerY, height/maxLen*-1000, height/maxLen*1000, 0, height)
			]

			// rect(
			// 	arrowpos[0],
			// 	arrowpos[1],
			// 	30, 30, "black"
			// )
			
			// rect(
			// 	arrowpos[0],
			// 	arrowpos[1],
			// 	20, 20, "brown"
			// )
			circle(arrowpos[0], arrowpos[1], 15, "black");
			circle(arrowpos[0], arrowpos[1], 10, "brown");

		}
		else if(play["type"]=="castle"){
			castlepos = [
				mathmap(play["x"]-playerX, width/maxLen*-1000, width/maxLen*1000, 0, width), 
				mathmap(play["y"]-playerY, height/maxLen*-1000, height/maxLen*1000, 0, height)
			]

			ctx.beginPath();
			ctx.moveTo(castlepos[0]+62, castlepos[1]-120);
			ctx.lineTo(castlepos[0]+62,
								 castlepos[1]-castleimg.height/3);
			ctx.stroke();
			
			rect(castlepos[0]+80, castlepos[1]-100, 32, 42, "black")//flag
			rect(castlepos[0]+80, castlepos[1]-100, 30, 40, play["color"])
			ctx.drawImage(castleimg,
										castlepos[0]-castleimg.width/3,
										castlepos[1]-castleimg.height/3, 
										castleimg.width/1.5,
										castleimg.height/1.5);

			
			healthbar = mathmap(play["health"], 0, 100, 0, 70)
			
			rect(
				castlepos[0],
				castlepos[1]-110,
				25, 75,
				"black"
			)

			ctx.rect(castlepos[0]-35,castlepos[1]-120, healthbar, 20);
			ctx.fillStyle = "green"
			ctx.fill()
			
			ctx.fillStyle = "black"
			ctx.font = '10px san-serif';
    	ctx.fillText(play["ownername"], castlepos[0],castlepos[1]+100);
		}
	})
}

socket.onmessage = function(event) {
	console.log("*")
	if(event.data == "lose"){
		lose=true
		document.body.innerHTML = "You lost :("
		window.location = 'http://defendio.herokuapp.com/lost.html' 
		console.log("lost")
		
	}

	else if(event.data.startsWith("leader")){
		leaderboard = JSON.parse(event.data.substring(6))
		document.getElementById("leaderboard").innerText = JSON.stringify(leaderboard, null, '\t')
	}
	else if(event.data.startsWith("id")){
		//do nothing there is no use 
	}
	else if(event.data.startsWith("sound ")){
		playSound(event.data.split(" ")[1])
	}
	else{
		isconnected = true;
		objects = JSON.parse(event.data)
		createPlayers()
	}
};
cansend=true
function moveMe(myX, myY, myAngle){
	if(!isconnected){
		console.log(".")
	}
	if(!cansend){
		return;
	}
	if(!lose){
		socket.send("move "+myX+","+myY);
		socket.send("angle "+myAngle);
		cansend=false
		setTimeout(function(){cansend=true},100)
	}
}

