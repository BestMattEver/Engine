
// IF SOMETHING IS DRAWN TO THE SCREEN, THE FUNCTION THAT CONTROLS THAT DRAWING IS IN THIS FILE


//this function is called at the end of the game loop and collects all the actual drawing functions and runs them in order.
//It takes an object that defines which rendering subs should be run on each pass. (so, for instnace, we can turn off grid drawing)
//first, it draws the basic grid (just squares w/ colors)
//second, it draws the static objects on that grid (like background sprites)
//third, it draws the mobile objects/entities on the canvas (like the player, enemies and items)
//fourth, it draws obscuring foreground stuff (clouds? tall buildings? UI?)
function render(renderThese, grid, canvas, entities, changed, playTime, cameraOffset) {

	var camOffset = processCameraOffset(cameraOffset);

	//if we're showing everything, make sure all objects have visible set to true (this affects drawing entities...)
	if(!renderThese.visibleOnly){
		for(var i=0; i<grid.length; i++)
		  {
			for(var f=0; f<grid[i].length; f++)
			{
				if(grid[i][f].object){
				grid[i][f].object.visible = true;
				}
			}
		  }
	}

	//this is the location on screen for the UI (right now just in game time)
	var timeLocX=0;
	var timeLocy=40;
	if(renderThese.ui) {
	// this adds the cells under the x y location (and all the cells that would be covered by the full time)
	// to the changed list so they get re-rendered
		for(var i = 0; i < 15; i++) {
			changed.push(findCellAt(grid, timeLocX+(i*16), timeLocy)); //16 is the size of the cells. this should be grabbed from the grid itself, in case the cell size changes.
			changed.push(findCellAt(grid, timeLocX+(i*16), (timeLocy-16))); // for now its fine...
		}
	}

	//if gird is true in the renderThese object, draw the grid.
	if(renderThese.grid){
		drawGrid(canvas, grid, true, camOffset);
	}
	//if objects is true in renderThese object, draw the objects
	if(renderThese.objects && !renderThese.onlyChanged){

		drawObjects(grid, canvas, renderThese.visibleOnl, camOffset);// if onlyChanged is false, draw all objects
	}
	else if(renderThese.objects && renderThese.onlyChanged, camOffset){
		//if only rendering the changed AND the visible, clear out the rest with shadow
		if(renderThese.visibleOnly){
			canvas.fillStyle = "#555";
			canvas.fillRect(0, 0, width1, height1);
		}
		drawChangedObjects(canvas, renderThese.visibleOnly, changed, camOffset);//if onlyChanged is true, only draw the objects in the changed array
	}

	//draw the UI and obscuring stuff here.
	if(renderThese.ui) {
			drawTime(timeLocX, timeLocy, canvas, playTime, changed, grid, camOffset);
	}


//draw the entities/mobile objects here
	if(renderThese.entities){
		drawEntities(grid, entities, canvas, camOffset);
	}

//draw the particles
	if(renderThese.particles){
		drawParticles(particleSystems, canvas, grid)
	}

//we need to reset the changed array for the next frame
//simply setting changed = [] only affects the refrenced copy, but not the value of the global version.
//we need to clear the GLOBAL version of this array. stack overflow suggests the following:
changed = changed.splice(0,changed.length);
//and it seems to work.
}

//---------------------------------------BELOW THIS LINE ARE FUNCTIONS FOR ACTUALLY DRAWING THINGS TO THE SCREEN-------------------------
//this function just draws the grid, wall by wall
//it takes the canvas you want to draw on, a grid to draw (generated by grid init) and a boolean indicating if you want walls drawn or not.
function drawGrid(canvas, grid, drawWalls, camOffset)
{//grid is a grid array generated by the gridInit function.
		  //console.log("drawing grid...");
		  canvas.strokeStyle = '#ffffff';

		  for(var i=0; i<grid.length; i++)
		  {
			for(var f=0; f<grid[i].length; f++)
			{
			  //draw a background for this cell.
			  //console.log("drawing the regular background");
			  canvas.fillStyle = grid[i][f].fillColor;
			  canvas.fillRect(grid[i][f].x+camOffset.x, grid[i][f].y+camOffset.y, grid[i][f].w, grid[i][f].h);

			  var wallSTruth = grid[i][f].wallS;
			  var wallNTruth = grid[i][f].wallN;
			  var wallETruth = grid[i][f].wallE;
			  var wallWTruth = grid[i][f].wallW;

			 if(drawWalls){
			  //draw northwall
			  //console.log("drawing north wall of cell: ["+i+","+f+"]");
			  if(wallNTruth)
			  { canvas.strokeStyle = grid[i][f].edgeColor;
				canvas.beginPath();
				canvas.moveTo(grid[i][f].x+camOffset.x, grid[i][f].y+camOffset.y);
				canvas.lineTo((grid[i][f].x+grid[i][f].w+camOffset.x),grid[i][f].y+camOffset.y);
				canvas.stroke();
				canvas.closePath();
			  }//end draw north wall

			  //draw eastwall
			  //console.log("drawing east wall of cell: ["+i+","+f+"]");
			  if(wallETruth)
			  {
				//console.log("wallE: "+grid[i][f].wallE);
				canvas.strokeStyle = grid[i][f].edgeColor;
				canvas.beginPath();
				canvas.moveTo((grid[i][f].x+grid[i][f].w+camOffset.x), grid[i][f].y+camOffset.y);
				canvas.lineTo((grid[i][f].x+grid[i][f].w+camOffset.x),(grid[i][f].y+grid[i][f].h+camOffset.y));
				canvas.stroke();
				canvas.closePath();
			  }//end draw east wall

			  //draw southwall
			  //console.log("drawing south wall of cell: ["+i+","+f+"]");
			  if(wallSTruth)
			  { canvas.strokeStyle = grid[i][f].edgeColor;
				canvas.beginPath();
				canvas.moveTo((grid[i][f].x+grid[i][f].w+camOffset.x),(grid[i][f].y+grid[i][f].h+camOffset.y));
				canvas.lineTo(grid[i][f].x+camOffset.x,(grid[i][f].y+grid[i][f].h+camOffset.y));
				canvas.stroke();
				canvas.closePath();
			  }//end draw south wall

			  //draw westwall
			  //console.log("drawing west wall of cell: ["+i+","+f+"]");
			  if(wallWTruth)
			  {
				//console.log("wallW: "+grid[i][f].wallW);
				canvas.strokeStyle = grid[i][f].edgeColor;
				canvas.beginPath();
				canvas.moveTo(grid[i][f].x+camOffset.x,(grid[i][f].y+grid[i][f].h+camOffset.y));
				canvas.lineTo(grid[i][f].x+camOffset.x,grid[i][f].y+camOffset.y);
				canvas.stroke();
				canvas.closePath();
			  }//end draw west wall
			 }//end drawWalls check.

			}//end x for loop
		  }//end y for loop

}//end drawGrid

function drawChangedObjects(canvas, visibleOnly, changed, camOffset){
	//console.log("drawing changed objects only...");
	for(var p = 0; p<changed.length;p++){
		//if this cell has an object, draw the object in the cell.
			 if(changed[p].object){
				 //if the object is a proper game object with a sprite, draw the sprite
				 if(typeof(changed[p].object) == "object"){
					 //drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
					 if(visibleOnly){
						if(changed[p].object.visible){
							canvas.drawImage(sprites, changed[p].object.spritex, changed[p].object.spritey, changed[p].object.spriteSize, changed[p].object.spriteSize, changed[p].x+camOffset.x, changed[p].y+camOffset.y, changed[p].w, changed[p].h);
						}
						else {
							canvas.fillStyle = "#555";
							canvas.fillRect(changed[p].x+camOffset.x, changed[p].y+camOffset.y, changed[p].w, changed[p].h);
							//draw the image ANYWAY, just draw it at a very low transparency, so its hard to see.
							//this keeps the game from having huge ugly swaths of solid 'shadow'
							// canvas.globalAlpha = 0.04;
							// canvas.drawImage(sprites, grid[i][f].object.spritex, grid[i][f].object.spritey, grid[i][f].object.spriteSize, grid[i][f].object.spriteSize, grid[i][f].x, grid[i][f].y, grid[i][f].w, grid[i][f].h);
							// canvas.globalAlpha = 1;

						}
					 }//end visible only check
					 else {
						 canvas.drawImage(sprites, changed[p].object.spritex, changed[p].object.spritey, changed[p].object.spriteSize, changed[p].object.spriteSize, changed[p].x+camOffset.x, changed[p].y+camOffset.y, changed[p].w, changed[p].h);
					 }
				 }
				 else{//if the object is not a proper game object, just draw the text of whatever is in there
					console.log('non-game object object found');
					canvas.fillStyle = "#aaa";
					canvas.fillRect(changed[p].x+camOffset.x,changed[p].y+camOffset.y, changed[p].w, changed[p].h);
					//this sets the font to arial and the size to 70% of the average of the height and width.
					canvas.font = parseInt((((changed[p].h+changed[p].w)/2)*.7),10)+"px Arial";
					//this writes the text of the object at the 20% more than cell's x and y locations (ie: toward the center of the cell).
					canvas.fillText(changed[p].object,(changed[p].x+camOffset.x)+(parseInt((changed[p].w*.2),10)),(changed[p].y+camOffset.y)-(parseInt((changed[p].h*.2),10)));
				 }

				 changed[p].changed = false;
			 }//end object draw if
	}
	//here we should clear out changed, to keep changed from growing from frame to frame. BUT
	// we do it at the end of the render function instead of here, because using some render configs,
	//changed is still populated, but this sub is never called, leading to changed growing larger and larger every frame.

}//end drawChangedObjects

function drawObjects(grid, canvas, visibleOnly, camOffset){

	 for(var i=0; i<grid.length; i++)
	{
		for(var f=0; f<grid[i].length; f++)
		{//if this cell has an object, draw the object in the cell.
			 if(grid[i][f].object){
				 //if the object is a proper game object with a sprite, draw the sprite
				 if(typeof(grid[i][f].object) == "object"){
					 //drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
					 if(visibleOnly){
						if(grid[i][f].object.visible){
							canvas.drawImage(sprites, grid[i][f].object.spritex, grid[i][f].object.spritey, grid[i][f].object.spriteSize, grid[i][f].object.spriteSize, grid[i][f].x+camOffset.x, grid[i][f].y+camOffset.y, grid[i][f].w, grid[i][f].h);
						}
						else {
							canvas.fillStyle = "#555";
							canvas.fillRect(grid[i][f].x+camOffset.x, grid[i][f].y+camOffset.y, grid[i][f].w, grid[i][f].h);
							//draw the image ANYWAY, just draw it at a very low transparency, so its hard to see.
							//this keeps the game from having huge ugly swaths of solid 'shadow'
							// canvas.globalAlpha = 0.04;
							// canvas.drawImage(sprites, grid[i][f].object.spritex, grid[i][f].object.spritey, grid[i][f].object.spriteSize, grid[i][f].object.spriteSize, grid[i][f].x, grid[i][f].y, grid[i][f].w, grid[i][f].h);
							// canvas.globalAlpha = 1;

						}
					 }//end visible only check
					 else {
						 canvas.drawImage(sprites, grid[i][f].object.spritex, grid[i][f].object.spritey, grid[i][f].object.spriteSize, grid[i][f].object.spriteSize, grid[i][f].x+camOffset.x, grid[i][f].y+camOffset.y, grid[i][f].w, grid[i][f].h);
					 }
				 }
				 else{//if the object is not a proper game object, just draw the text of whatever is in there
					console.log('non-game object object found');
					canvas.fillStyle = "#aaa";
					canvas.fillRect(grid[i][f].x+camOffset.x, grid[i][f].y+camOffset.y, grid[i][f].w, grid[i][f].h);
					//this sets the font to arial and the size to 70% of the average of the height and width.
					canvas.font = parseInt((((grid[i][f].h+grid[i][f].w)/2)*.7),10)+"px Arial";
					//this writes the text of the object at the 20% more than cell's x and y locations (ie: toward the center of the cell).
					canvas.fillText(grid[i][f].object,(grid[i][f].x+camOffset.x)+(parseInt((grid[i][f].w*.2),10)),(grid[i][f].y+camOffset.y)-(parseInt((grid[i][f].h*.2),10)));
				 }
			 }//end object draw if
		}
	}

}//end drawObjects

function drawEntities(grid, entities, canvas, camOffset){
	for(var e =0; e < entities.length; e++){
		var halfsize = Math.floor(entities[e].spriteSize/2);
		var cellEntityIsOn = findCellAt(grid, entities[e].x, entities[e].y)
		if(cellEntityIsOn.object.visible){//dont draw the entity if the cell its on isnt visible anyway.
			canvas.save();//set a translation save point...d
			//rotate and translate the canvas context to match the rotation and location of the entity before we draw..
			canvas.translate(entities[e].x+camOffset.x,entities[e].y+camOffset.y); //CAMOFFSET NEEDED?
			canvas.rotate(entities[e].rotation);
			//find the spritesheet x and y for this entity's animation frame
			var animX = (entities[e].animations[entities[e].currentAnim].spriteX) + (entities[e].currentFrame * entities[e].spriteSize);
			var animY = entities[e].animations[entities[e].currentAnim].spriteY;
			//draw the sprite image for this entity
			canvas.drawImage(sprites, animX, animY, entities[e].spriteSize, entities[e].spriteSize, -1*halfsize+camOffset.x, -1*halfsize+camOffset.y, entities[e].spriteSize, entities[e].spriteSize)
			// canvas.drawImage(sprites, entities[e].spriteX, entities[e].spriteY, entities[e].spriteSize, entities[e].spriteSize, -1*halfsize, -1*halfsize, entities[e].spriteSize, entities[e].spriteSize)
			//rotate the canvas context back to what it was after we draw...
			canvas.restore();//restore the translation save point.
		}
	}//end draw entities loop
}

//this function draws the in game time in the corner of the canvas.
function drawTime(x, y, canvas, playTime, changed, grid) {
	var timeString = findInGameTime(playTime);

	canvas.fillStyle = "#fff";
	//this sets the font to arial and the size to 70% of the average of the height and width.
	canvas.font = "20px Arial";
	//this writes the text of the object at the 20% more than cell's x and y locations (ie: toward the center of the cell).


	canvas.fillText(timeString, x, y);
}

function drawParticles(particleSystems, canvas, grid) {

	//this is wildly unpreformant because its 3 nested for loops for a n^3 efficency. not sure how to optimize but def need to...
	var keys = Object.keys(particleSystems);
	for(var l = 0; l < keys.length; l++) {
		var system = particleSystems[keys[l]];
		system.activeEmitters.forEach(emitter => {
				emitter.particles.forEach(particle => {
					//if the particle is actually alive,
					if(particle.alive){
						//draw the particle, for this emitter, in this system.
						canvas.beginPath();
						canvas.arc(particle.x, particle.y, particle.size/2, 0, 2 * Math.PI);
						canvas.fillStyle = 'rgb('+particle.r+','+particle.g+','+particle.b+','+particle.a+')';
						canvas.fill();
					}
				})//end particles for loop
		})//end emitter for loop
	}//end system for loop
}
