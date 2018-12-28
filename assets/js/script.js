
console.log("is js working?");

//this is the canvas we've defined in our html
var gameCanvas1 = $("#gameCanvas1")[0];

//we now give that canvas a 'context' and save it in a variable. The context is what we actually use to do the 'drawing'
var context1 = gameCanvas1.getContext("2d");
var width1 = gameCanvas1.width;
var height1 = gameCanvas1.height;

//initialize the grid
var grid = girdInit(16,85,50,'#0b175b',"#2b43c6");

//this is the global array of all changed cells. it is updated/added to as the cells are changed every frame
// so we dont have to search through all cells to FIND the changed ones.
var changed =[];

//our game loop is below.
//this calls loop every 17 miliseconds (about 60fps).
//loop takes care of the game logic, and also re-renders the screen.
var gameLoopInterval = setInterval(loop, 30, grid, context1, entities, changed);

//====================================================PLAYER INPUT HERE=======================================================
var keysPressed = []; //this is the global array that holds all the keys that are pressed inbetween each frame.
var mousePos = {}; //this is the global mouseposition holding variable.

//----------------THE FOLLOWING JQUERY EVENT HANDLERS CAPTURE THE INPUT EVENTS------------------
//--------------------this captures mouse clicks------------------- i should break this out into mousedown and mouse up. maybe even right and left...
$(gameCanvas1).on("click", function(e){
	//where is the click on the canvas/grid?
	mousePos = getMousePos(gameCanvas1, e);
	mouseClickHandler(entities, mousePos.x, mousePos.y);
});

//----------------this captures mouse movement-----------------
$("body").mousemove(function(e){
	mousePos = getMousePos(gameCanvas1, e);
	mouseMoveHandler(entities, mousePos.x, mousePos.y);
});

//------------this captures all the keydown events-------------------
$("body").keydown(function(e){
	keysPressed[e.which] = true;
	//console.log(e.which);
	keydownHandler(entities, keysPressed);
});

//------------this captures all the keyup events-------------------
$("body").keyup(function(e){
	keysPressed[e.which] = false;
	//keyupHandler(entities, keysPressed);
});

//------------------------THESE FUNCTIONS DO STUFF WITH THE CAPTURED EVENTS------------------------
//the usefulness of having these in their own subs is that they can be offloaded to a different file later on.

//this is where we'd put whatever code we want to run when the mouse moves.
function mouseMoveHandler(entities, mousex, mousey){
	//console.log("we move mouse: x="+mousex+", y="+mousey);

	//when the cursor moves, make the player face it.
	faceEntityToLoc(entities[0], mousex, mousey);
	//facePlayerToCursor(entities, mousex, mousey);

}//end mouseMoveHandler

function mouseClickHandler(entities, mousex, mousey){
	//this is where we put whatever code we want to run when the mouse is clicked.

	var foundCell = findCellAt(grid, mousex, mousey);
	//shoot a ray from the position of the player to the mouse.
	var hitcoords = castRay(grid, entities[0].x, entities[0].y, mousex, mousey);
	var hitcell = findCellAt(grid,hitcoords.x, hitcoords.y);
	console.log(hitcell.object);

}//end mouseclickhandler

//we run this function every time a key is pressed
function keydownHandler(entities, keysPressed){

}//end keydownhandler

//we run this function every time a key is pressed
function keyupHandler(entities, keysPressed){

}//end keyuphandler

//==============================================END PLAYER INPUT=============================================================

//this function applies a force to an entity by changing its x and y velocity, direction is based on the x,y location given in paramaters. 
function applyImpulseToEntity(entity, mag, x,y){
	console.log("applying impulse");
	var maxVec = 50;
	var xslope = (entity.x-x);
	var yslope = (entity.y-y);
	//if the entity is going slower than the (arbitrarily defined) maxVec above, add the slope times the mag to its vec.
	if(entity.xVec < maxVec){entity.xVec += Math.floor(xslope*mag);}
	if(entity.yVec < maxVec){entity.yVec += Math.floor(yslope*mag);}
	
}

//this just function takes an entity and changes its x and y location by its x and y velocity
function moveEntityByVelocity(entity){
	//before applying the new x and y, find the cells that the entity is curretly on, and set them to changed, so they get re-rendered.
	setCellsOnFourCornersToChanged(entity, grid, changed);
	//move the character by their vector magnitudes
	entity.x += entity.xVec;
	entity.y += entity.yVec;
	//after applying the new x and y, find the cells that the entity is curretly on, and set them to changed, so they get re-rendered.
	setCellsOnFourCornersToChanged(entity, grid, changed);
}//end moveEntityByVelocity

//this function runs every frame and takes an entity and reduces its x and y velocity by a the entered 'friction' to mimic friction
function applyFrictionToVelocity(entity, friction){
	//friction is the friction to apply every frame.
	//these 4 lines normalize the x and y vectors of the character a bit each frame until theyre both close to 0
	if(entity.yVec > 0){entity.yVec -= friction;}
	if(entity.yVec < 0){entity.yVec += friction;}
	if(entity.xVec > 0){entity.xVec -= friction;}
	if(entity.xVec < 0){entity.xVec += friction;}
	//these two lines catch a case where a very small friction can cause a permanent velocity because the previous 4 lines vassilate over the 0 threshold
	if(entity.xVec > 0 && entity.xVec <= friction){entity.xVec = 0;}
	if(entity.yVec > 0 && entity.yVec <= friction){entity.yVec = 0;}
}//end applyFrictionToVelocity

function adjustVelocityOnKeypress(entity, keysPressed, delta, max){
	//this function adjusts an entity's velocity depending on which key is pressed
	//max is the maximum speed,
	//delta is... essentially acceleration.
	
	//if the movement keys are pressed...
	if(keysPressed[65] || keysPressed[68] || keysPressed[83] || keysPressed[87]){
		//facePlayerToCursor(entities, mousePos.x, mousePos.y);
		faceEntityToLoc(entities[0], mousePos.x, mousePos.y);
		if(Math.abs(entity.xVec) <= max){//so long as the xvelocity isnt greater than the allowed max
			if(keysPressed[65]){//A pressed
				entity.xVec -= delta;
			}
			if(keysPressed[68]){//d pressed
				entity.xVec += delta;
			}
		}
		if(Math.abs(entity.yVec) <= max){//so long as the y velocity isnt greater than the allowed max
			if(keysPressed[83]){//s pressed
				entity.yVec += delta;
			}
			if(keysPressed[87]){//w pressed
				entity.yVec -= delta;
			}
		}
		if(entity.animations[entity.currentAnim].interruptible) { entity.currentAnim = "move"};
	}
	//roll/dodge
	if(keysPressed[32] && entity.cooldowns.rollDodge == 0){//spacebar
		var xdir = 0;
		var ydir = 0;
		if(keysPressed[65]){xdir = xdir+4;}
		if(keysPressed[68]){xdir = xdir-4;}
		if(keysPressed[83]){ydir = ydir-4;}
		if(keysPressed[87]){ydir = ydir+4;}
		
		console.log("we rollin', dey hatin'");
		applyImpulseToEntity(entity, 1.3, entity.x+xdir, entity.y+ydir);
		entity.cooldowns.rolldodge = 10;
		entity.currentAnim = "rollDodge";
	}

}//end adjustPlayerVelocity

//this function iterates over an entity's cooldown object and ticks down each timer to 0.
function tickDownCooldowns(entity, speed){
	$.each(entity.cooldowns, function(p, k){
		if(k == 0){}//do nothing.
		else if(k < 0){
			entity.cooldowns[p] = 0
		}
		else if(k > 0){
			entity.cooldowns[p] = k-speed
		}
	});
}//end tickDownCoolDowns

//this function finds the cells at the 4 corners of a particular entity,
//then it figures out if those cells are collidable, and if so, changes the entity's velcity by the bounce arg
//such that the entity wont intersect with the cell/object
function findCollisionsThenAdjustVelocity(entity, grid, bounce){
	//find the cells at 4 corners of the player's sprite and check them for collisions.
	var fourCornersCollisions = findCollisionsOnFourCorners(entity,grid);

	//adjust velocity based on which of the 4 corners has collided with something
	if(fourCornersCollisions.nwCell || fourCornersCollisions.neCell || fourCornersCollisions.swCell || fourCornersCollisions.seCell){
		//-----------------------THREE CORNER COLLISION ADJUSTMENTS---------------------------
		//if 3 of the 4 corners are currently colliding in the top left, push them away HARD!!!
		if(!fourCornersCollisions.seCell && fourCornersCollisions.nwCell && fourCornersCollisions.neCell && fourCornersCollisions.swCell){
			entity.yVec = 2*bounce;
			entity.xVec = 2*bounce;
		}
		//if 3 of the 4 corners are currently colliding in the top right, push them away HARD!!!
		else if(fourCornersCollisions.seCell && fourCornersCollisions.nwCell && fourCornersCollisions.neCell && !fourCornersCollisions.swCell){
			entity.yVec = 2*bounce;
			entity.xVec = -2*bounce;
		}
		//if 3 of the 4 corners are currently colliding in the bottom right, push them away HARD!!!
		else if(fourCornersCollisions.seCell && !fourCornersCollisions.nwCell && fourCornersCollisions.neCell && fourCornersCollisions.swCell){
			entity.yVec = -2*bounce;
			entity.xVec = -2*bounce;
		}
		//if 3 of the 4 corners are currently colliding in the bottom left, push them away HARD!!!
		else if(fourCornersCollisions.seCell && fourCornersCollisions.nwCell && !fourCornersCollisions.neCell && fourCornersCollisions.swCell){
			entity.yVec = -2*bounce;
			entity.xVec = 2*bounce;
		}
		//----------------------------TWO CORNER COLLISION ADJUSTMENTS----------------------------------
		//if both top corners are colliding, negate upward velocity
		else if(fourCornersCollisions.nwCell && fourCornersCollisions.neCell && !fourCornersCollisions.swCell && !fourCornersCollisions.seCell){
			entity.yVec = bounce;
		}
		//if both right corners are colliding, negate rightward velocity
		else if(fourCornersCollisions.neCell && fourCornersCollisions.seCell && !fourCornersCollisions.nwCell && !fourCornersCollisions.swCell){
			entity.xVec =  -1*bounce;
		}
		//if both bottom corners are colliding, negate downward velocity
		else if(fourCornersCollisions.seCell && fourCornersCollisions.swCell && !fourCornersCollisions.nwCell && !fourCornersCollisions.neCell){
			entity.yVec = -1*bounce;
		}
		//if both left corners are colliding, negate leftward velocity
		else if(fourCornersCollisions.swCell && fourCornersCollisions.nwCell && !fourCornersCollisions.seCell && !fourCornersCollisions.neCell){
			entity.xVec = bounce;
		}
		//-------------------------------------ONE CORNER COLLISION ADJUSTMENTS---------------------------------------
		//if ONLY the NE corner is colliding, negate leftward AND upward velocities
		else if(fourCornersCollisions.neCell && !fourCornersCollisions.nwCell && !fourCornersCollisions.swCell && !fourCornersCollisions.seCell){
			entity.xVec = -1*bounce;
			entity.yVec = bounce;
		}
		//if ONLY the NW corner is colliding, negate rightward AND upward velocities
		else if(fourCornersCollisions.nwCell && !fourCornersCollisions.neCell && !fourCornersCollisions.swCell && !fourCornersCollisions.seCell){
			entity.xVec = bounce;
			entity.yVec = bounce;
		}
		//if ONLY the SW corner is colliding, negate leftward AND downward velocities
		else if(fourCornersCollisions.swCell && !fourCornersCollisions.nwCell && !fourCornersCollisions.neCell && !fourCornersCollisions.seCell){
			entity.xVec = bounce;
			entity.yVec = -1*bounce;
		}
		//if ONLY the SE corner is colliding, negate rightward AND downward velocities
		else if(fourCornersCollisions.seCell && !fourCornersCollisions.nwCell && !fourCornersCollisions.neCell && !fourCornersCollisions.swCell){
			entity.xVec = -1*bounce;
			entity.yVec = -1*bounce;
		}
	}
}//end adjustEntityVelocityWithCollisions

function markObjectsVisibleToEntity_radius(grid, entity, radius, changed){
	var radiusCells =[]; //this is an array of all the cells in the visible radius
	for(var i=0; i<grid.length; i++)
	{
		for(var f=0; f<grid[i].length; f++)
		{
			if(grid[i][f].object){//if there's nothing to show why bother with this at all?
				//start by setting the cell to invisible
				grid[i][f].object.visible = false;
				//then find the distance to this cell
				var dist = eucledianDistance({x:entity.x, y:entity.y}, {x:grid[i][f].x, y:grid[i][f].y});
				//if the distance is less than the radius, mark it as visible
				if(dist <= radius){
					radiusCells.push(grid[i][f]);
					//if this cell is changing from false to true, then add it to the changed array for re-rendering.
					if(grid[i][f].object.visible == false){
						grid[i][f].object.changed = true;
						changed.push(grid[i][f]);
					}
					//regardless of the above, change the visibility to true.
					grid[i][f].object.visible = true;
				}
			}
		}
	}
return radiusCells;

}//end markObjectsVisibleToEntity_radius

//this function is used to figure out which of the tile objects in the visible cells are visible from the an entity's position.
function findVisionConesFromEntity(grid, visibleCells, entity, radius, changed){

		for(var u =0; u<visibleCells.length; u++){
			//does this cell even have an object in it to show?
			if(typeof(visibleCells[u].object) == "object"){
				//cast a ray from the player toward this object, and get the location where it intersects -something-
				var endlocs = [];
				//cast from the entity to the center of the cell
				endlocs.push(castRay(grid, entity.x+Math.floor(entity.spriteSize/2), entity.y+Math.floor(entity.spriteSize/2), visibleCells[u].centerX, visibleCells[u].centerY));
				//cast from the entity to the top left of the cell
				endlocs.push(castRay(grid, entity.x+Math.floor(entity.spriteSize/2), entity.y+Math.floor(entity.spriteSize/2), visibleCells[u].x, visibleCells[u].y));
				//cast from the entity to the top right of the cells
				endlocs.push(castRay(grid, entity.x+Math.floor(entity.spriteSize/2), entity.y+Math.floor(entity.spriteSize/2), visibleCells[u].x+visibleCells[u].object.spriteSize, visibleCells[u].y));
				//cast from the entity to the bottom right of the cells
				endlocs.push(castRay(grid, entity.x+Math.floor(entity.spriteSize/2), entity.y+Math.floor(entity.spriteSize/2), visibleCells[u].x+visibleCells[u].object.spriteSize, visibleCells[u].y+visibleCells[u].object.spriteSize));
				//cast from the entity to the bottom left of the cells
				endlocs.push(castRay(grid, entity.x+Math.floor(entity.spriteSize/2), entity.y+Math.floor(entity.spriteSize/2), visibleCells[u].x, visibleCells[u].y+visibleCells[u].object.spriteSize));
				//console.log(endlocs);
				//find the cell at the intersection location
				var flag;
				for(var p = 0; p<endlocs.length; p++){
					var cell = findCellAt(grid, endlocs[p].x, endlocs[p].y);
					//if the cell at the intersection location is this very same cell, mark it as visible
					//(since an unbroken line from the player to it is possible).
					if(visibleCells[u] == cell){
						flag = true;
						p = endlocs.length; //pop out if we find an end location that hits the player. he should be able to see this cell.
					}
					else{
						flag = false;
					}
				}//end endloc for
					//first if the visibility of this cell isnt already what the flag is, then add the cell to the changed array, for re-rendering.
					if(!visibleCells[u].object.visible == flag){
						visibleCells[u].object.changed = true;
						changed.push(visibleCells[u]);

					}
					//regardless of the above, assign flag to visible
					visibleCells[u].object.visible = flag;
			}
		}//end for

}

//this function finds the cells at the 4 corners of an entity and returns an object of trues and falses, showing if the entity collides with them
//this basically works as AABB collision detection between an entity and static grid objects.
function findCollisionsOnFourCorners(entity, grid){
	//initialize the return object as all false
	var returnObj = {neCell: false, nwCell: false, seCell: false, swCell: false};
	if(entity.solid){//make sure the entity is solid first...
		var halfSize = Math.floor(entity.spriteSize/2);

		//find the cells we need to check
		var nwCell = findCellAt(grid, entity.x-halfSize, entity.y-halfSize);
		var neCell = findCellAt(grid, entity.x+halfSize, entity.y-halfSize);
		var swCell = findCellAt(grid, entity.x-halfSize, entity.y+halfSize);
		var seCell = findCellAt(grid, entity.x+halfSize, entity.y+halfSize);

		//check the cells for solid-ness and alter return object accordingly
		if(nwCell && nwCell.object.solid){returnObj.nwCell = true;}
		if(neCell && neCell.object.solid){returnObj.neCell = true;}
		if(swCell && swCell.object.solid){returnObj.swCell = true;}
		if(seCell && seCell.object.solid){returnObj.seCell = true;}
		//return the object of cells
	}
	return returnObj;
}

function setCellsOnFourCornersToChanged(entity, grid, changed){
		var halfSize = Math.floor(entity.spriteSize/2);

		//find the cells we need to check
		var nwCell = findCellAt(grid, entity.x-halfSize, entity.y-halfSize);
		var neCell = findCellAt(grid, entity.x+halfSize, entity.y-halfSize);
		var swCell = findCellAt(grid, entity.x-halfSize, entity.y+halfSize);
		var seCell = findCellAt(grid, entity.x+halfSize, entity.y+halfSize);

		//add the nw cell to the changed array for re-rendering
		if (nwCell) {
			nwCell.changed = true;
			changed.push(nwCell);
		}
		//add the ne cell to the changed array for re-rendering
		if (neCell) {
			neCell.changed = true;
			changed.push(neCell);
		}
		//add the se cell to the changed array for re-rendering
		if (seCell) {
			seCell.changed = true;
			changed.push(seCell);
		}
		//add the sw cell to the changed array for re-rendering
		if (nwCell) {
			swCell.changed = true;
			changed.push(swCell);
		}
}

//this function takes a 2d level array and an object list to assign the correct object to each cell in the grid based on the 2d level array
function assignLevelToGrid(grid, level, objs, changed){
	//for each index in the 2d level array...
	for(var j = 0; j<level.length; j++){
		for(var k = 0; k<level[0].length; k++){
				if(typeof level[j][k] === 'undefined'){
				//do nothing, since the object doesnt exist.
				}
				else{//assign the correct object to the cell, based on what is found in the level array.
					var cellObject;
					for(var q = 0; q<objs.length; q++){
						if(level[j][k] === objs[q].rep){
							cellObject = objs[q];
						}
					}//end object search for loop
					if(cellObject){//if an object was found that matches the 2d level array's representation, assign that object to this cell
						grid[k][j].object = Object.assign({}, cellObject);//object.assign makes a DEEP copy/copy by value of the object.
						grid[k][j].object.changed = true;
						changed.push(grid[k][j]);
					}
					else{//otherwise, just assign the level array's represenation to the cell.
						grid[k][j].object = level[l][k];
						grid[k][j].object.changed = true;
						changed.push(grid[k][j]);
					}
				}//end exists else
		}//end k loop
	}//end assignment (j) loop
};

//this function takes the entities array, and does collision detection, movement, cooldown reduction, and other things to each one.
//this function should run every frame as it takes care of moment by moment movement and collision for entities. 
function processEntities(entities, grid, bounce, mag, friction){
	
	//thanks to https://www.quora.com/In-JavaScript-how-do-you-create-an-empty-2D-array for helping me figure out how to make an empty 2d array. :(
	var collisionArray = Array(entities.length).fill(false).map(()=>Array(entities.length).fill(false));
	
	//iterate through all the entities
	for(var i =0; i<entities.length;i++){
		//first: assign the proper animation to the entity for this frame.
		if(entities[i].xVec === 0 && entities[i].yVec === 0){
			entities[i].currentAnim = "idle1";
		}
		// else {
		// 	entities[i].currentAnim = "move"
		// }
		//check/incriment the animation frame of this entity
		if(entities[i].animations[entities[i].currentAnim].totalFrames > entities[i].currentFrame) {entities[i].currentFrame++}
		else { entities[i].currentFrame = 0;}
		
		//console.log("dealing with entity: "+i);
		//first, tick down each entity's cooldowns, so abilities can be used if possible. .17 is the amount of seconds per frame.	
		tickDownCooldowns(entities[i], .17);
		
		//next, find where/if the entity/player is colliding with env objects and adjust the velocity to keep him from going through stuff
		findCollisionsThenAdjustVelocity(entities[i], grid, bounce);
		
		//here we check if any entities are colliding with this entity. 
		for(var j = 0; j<entities.length; j++){
			//if this entity isnt itself, continue checking...
			if(!i == j){
				//now make sure we havent already collided these two entities (see below)...
				//if(collisionArray[j][i] == false){
					var playerCollide = CheckAABBCollision(entities[i], entities[j]);
					if(playerCollide){
						//we use the indicies of the two colliding entities in the entity array as the x/y coordinates
						//of the collision in the 2d collision array. that way, if we want to check for previous collisions between two entities
						//we just have to check collisionArray[j][i] for true (NOT [i][j], as we put it into the array. the oppsite),
						//to see if those two entities already collided this frame. 
						//collisionArray[i][j] = true;
						console.log(i+" collided with "+j);
						
						//ideally, we'd figure out what kind of collision this is, 
						//then call a variable in the entity the contains the function to run when it got collided with in a spceific way. 
						applyImpulseToEntity(entities[j], mag/2, entities[i].x,entities[i].y);//the static entity (ball)
						applyImpulseToEntity(entities[i], mag, entities[j].x,entities[j].y);//the moving entity (player)
					}//end collision if
				//}//end previously collided check
			}//end self check.
		}//end inner for loop
		
		//this function applies a small reduction to the x and y velocities of an entity to mimic friction. its how entities stop moving.
		applyFrictionToVelocity(entities[i], friction);
		
		//this function (FINALLY) actually changes the x and y location of an entity by its x and y velocity
		moveEntityByVelocity(entities[i]);
	}//end outer for loop
	
	
}//end processEntities

//this function checks collision between an entity and a cell, returns a true or false if the entity is colliding with the cell
function CheckAABBCollision(entity1, entity2){
	//first make sure both the cell and the entity should be colliding at all.
	var collide = false;
	if(entity2.solid && entity1.solid){
		if(//then check their 'Axis Aligned Bounding Box' collision.
			entity1.x < entity2.x + entity2.spriteSize &&
			entity1.x + entity1.spriteSize > entity2.x &&
			entity1.y < entity2.y + entity2.spriteSize &&
			entity1.y + entity1.spriteSize > entity2.y
		  ){
			//it collides
			console.log("COLLISION:");
			console.log(entity1);
			console.log(entity2);
			collide = true;
		}
	}
	return collide;
}

function castRay(grid, startx, starty, linex, liney){
	//y=mx+b
	var slope = (linex-startx)/(liney-starty);
	var b = -1*((slope*(linex))-liney);
	//lines above this are extra, but maybe useful in future?

	//Thanks to https://stackoverflow.com/questions/18775787/drawing-along-an-equation-of-a-line-in-html5-canvas for the help on this.
	//to 'cast' the ray, we take the the line segment made by the start point and end point.
	//then we use a for loop and f, to find a bunch of points along that line.
	//the amount f incriments in the for loop is the distance of each 'hop' on the between points we check
	//if any of those points occur in an unwalkable tile, we eject out, and return that point as the collision point.
	for(var f = 0; f < 1; f +=.01){
		//these two lines choose new x and y coords based on the line segment and f
		var newx = startx + (linex - startx) * f;
		var newy = starty + (liney - starty) * f;
		//here we check if that point is in an unwalkable tile.
		var foundCell = findCellAt(grid, newx, newy);
		if(foundCell && foundCell.object && foundCell.object.solid){
			liney=newy;
			linex=newx;
			f=1;
		}
	}

	//return the collision point OR the origional clicked point.
	return ({x:linex,y:liney});
}

function faceEntityToLoc(entity, x, y){
	//make an entity face toward an x,y position, by changing its rotation key
	var rad_90 = 90*0.0174533; //this is the radian value of 90 degrees.
	var slope = (entity.y - y)/(entity.x - x);
	//thanks to http://www.gamefromscratch.com/post/2012/11/18/GameDev-math-recipes-Rotating-to-face-a-point.aspx for the tip about atan2
	//var rads = Math.atan(slope);//using atan causes the sprite to 'flip' weirdly at certain angles. it can never point left?
	var rads2 = Math.atan2(entity.y - y,entity.x - x)//atan 2 on the other hand gives us the correct radians. this is weird. 
	//for some reason my math here is about 90 degrees off... this is a shim to fix it...ya know... instead of just fixing my math...
	entity.rotation = rads2-rad_90; //we save the rotation of the entity in radians.
	
	//to convert radians to degrees: 1 radian = 57.2958 degrees
	//to convert degrees to radians: 1 degree = 0.0174533 radians
}

//this function finds the manhattan distance (orthagonal travel only, no diagonal) from one CELL to another.
//we can think of this as the H() portion (heuristic) of our A* algorithm.
function manhattanDistance(fromCell, toCell){
	var xDist = Math.abs(fromCell.indexX - toCell.indexX);
	var yDist = Math.abs(fromCell.indexY - toCell.indexY);

	return xDist+yDist;
}
//this function finds the eucledian distance (direct, as the bird flies) between two POINTS on the canvas.
//startpos and endpos are both objects with an x and y key and represent points
function eucledianDistance(startpos, endpos){
	var xstuff = Math.pow((endpos.x - startpos.x),2);
	var ystuff = Math.pow((endpos.y - startpos.y),2);
	var dist = Math.sqrt(xstuff+ystuff);

	return Math.abs(dist);
}

//this function follows a cell's previous link all the way back to the start cell and just return the number of steps: our g(n).
function walkBack(fromCell, startCell){
	var steps = 0;
	console.log("in walkback");
	console.log(fromCell.previous);
	while(fromCell.previous != 0){
		steps++;
		fromCell = fromCell.previous;
	}
	console.log(steps);
	return steps;
}

function loop(grid, canvas, entities, changed){
	//-------------------------------------THIS IS WHERE THE GAME LOGIC WOULD GO------------------------------------------
	
	//adjust velocity is called here to make sure we properly accelerate the entity/player EVERY frame. this avoids weird halting behavior when changing direction.
	var delta = 3; //working value: 1
	var max = 9;// working value: 3
	adjustVelocityOnKeypress(entities[0], keysPressed, delta, max);

	//this function iterates over all the entities and checks their collisions and updates their positions and vectors. it also ticks down their cooldowns
	var bounce = 3; //how much to bounce an entity off of a solid object. working value: 1 
	var mag = 1.3;//this is the magnitude of impulses. logically, 1 would be elastic collisions. so this is slightly more flubbery?
	var friction = 1;//The amount by which all velocities are reduced every frame. working value: .3
	processEntities(entities, grid, bounce, mag, friction);

	//----------------------------------------------end the game logic----------------------------------------------------

	//----------------------------------------------start render config--------------------------------------------------
	//define the object that describes what we want to render:
	var renderThese = {grid: false, objects: true, entities: true, visibleOnly: false, onlyChanged: true};
	//warning, setting grid to true REALLY eats up computer power and causes frame rate drop

	if(renderThese.visibleOnly){
		//this shoots A BUNCH of rays. no need to do it if we'll see everything anyway.
		var radius = 250;
		var visibleCells = markObjectsVisibleToEntity_radius(grid, entities[0], radius, changed);
		findVisionConesFromEntity(grid, visibleCells, entities[0], radius, changed);
		//markObjectsVisibleToEntity(grid, entities[0]);
	}

	//finally, at the end we render all graphics
	render(renderThese, grid, canvas, entities, changed);
}//END GAME LOOP

//this function is called at the end of the game loop and collects all the actual drawing functions and runs them in order.
//It takes an object that defines which rendering subs should be run on each pass. (so, for instnace, we can turn off grid drawing)
//first, it draws the basic grid (just squares w/ colors)
//second, it draws the static objects on that grid (like background sprites)
//third, it draws the mobile objects/entities on the canvas (like the player, enemies and items)
//fourth, it draws obscuring foreground stuff (clouds? tall buildings? UI?)
function render(renderThese, grid, canvas, entities, changed){
	
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

	//if gird is true in the renderThese object, draw the grid.
	if(renderThese.grid){
		drawGrid(canvas, grid, true);
	}
	//if objects is true in renderThese object, draw the objects
	if(renderThese.objects && !renderThese.onlyChanged){

		drawObjects(grid, canvas, renderThese.visibleOnly);// if onlyChanged is false, draw all objects
	}
	else if(renderThese.objects && renderThese.onlyChanged){
		//if only rendering the changed AND the visible, clear out the rest with shadow
		if(renderThese.visibleOnly){
			canvas.fillStyle = "#555";
			canvas.fillRect(0, 0, width1, height1);
		}
		drawChangedObjects(canvas, renderThese.visibleOnly, changed);//if onlyChanged is true, only draw the objects in the changed array
	}

//draw the entities/mobile objects here
	if(renderThese.entities){
		drawEntities(grid, entities, canvas);
	}

//draw the UI and obscuring stuff here.


//we need to reset the changed array for the next frame
//simply setting changed = [] only affects the refrenced copy, but not the value of the global version.
//we need to clear the GLOBAL version of this array. stack overflow suggests the following:
changed = changed.splice(0,changed.length);
//and it seems to work.
}

//---------------------------------------BELOW THIS LINE ARE FUNCTIONS FOR ACTUALLY DRAWING THINGS TO THE SCREEN-------------------------
//this function just draws the grid, wall by wall
//it takes the canvas you want to draw on, a grid to draw (generated by grid init) and a boolean indicating if you want walls drawn or not.
function drawGrid(canvas, grid, drawWalls)
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
			  canvas.fillRect(grid[i][f].x, grid[i][f].y, grid[i][f].w, grid[i][f].h);

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
				canvas.moveTo(grid[i][f].x, grid[i][f].y);
				canvas.lineTo((grid[i][f].x+grid[i][f].w),grid[i][f].y);
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
				canvas.moveTo((grid[i][f].x+grid[i][f].w), grid[i][f].y);
				canvas.lineTo((grid[i][f].x+grid[i][f].w),(grid[i][f].y+grid[i][f].h));
				canvas.stroke();
				canvas.closePath();
			  }//end draw east wall

			  //draw southwall
			  //console.log("drawing south wall of cell: ["+i+","+f+"]");
			  if(wallSTruth)
			  { canvas.strokeStyle = grid[i][f].edgeColor;
				canvas.beginPath();
				canvas.moveTo((grid[i][f].x+grid[i][f].w),(grid[i][f].y+grid[i][f].h));
				canvas.lineTo(grid[i][f].x,(grid[i][f].y+grid[i][f].h));
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
				canvas.moveTo(grid[i][f].x,(grid[i][f].y+grid[i][f].h));
				canvas.lineTo(grid[i][f].x,grid[i][f].y);
				canvas.stroke();
				canvas.closePath();
			  }//end draw west wall
			 }//end drawWalls check.

			}//end x for loop
		  }//end y for loop

}//end drawGrid

function drawChangedObjects(canvas, visibleOnly, changed){
	//console.log("drawing changed objects only...");
	for(var p = 0; p<changed.length;p++){
		//if this cell has an object, draw the object in the cell.
			 if(changed[p].object){
				 //if the object is a proper game object with a sprite, draw the sprite
				 if(typeof(changed[p].object) == "object"){
					 //drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
					 if(visibleOnly){
						if(changed[p].object.visible){
							canvas.drawImage(sprites, changed[p].object.spritex, changed[p].object.spritey, changed[p].object.spriteSize, changed[p].object.spriteSize, changed[p].x, changed[p].y, changed[p].w, changed[p].h);
						}
						else {
							canvas.fillStyle = "#555";
							canvas.fillRect(changed[p].x, changed[p].y, changed[p].w, changed[p].h);
							//draw the image ANYWAY, just draw it at a very low transparency, so its hard to see.
							//this keeps the game from having huge ugly swaths of solid 'shadow'
							// canvas.globalAlpha = 0.04;
							// canvas.drawImage(sprites, grid[i][f].object.spritex, grid[i][f].object.spritey, grid[i][f].object.spriteSize, grid[i][f].object.spriteSize, grid[i][f].x, grid[i][f].y, grid[i][f].w, grid[i][f].h);
							// canvas.globalAlpha = 1;

						}
					 }//end visible only check
					 else {
						 canvas.drawImage(sprites, changed[p].object.spritex, changed[p].object.spritey, changed[p].object.spriteSize, changed[p].object.spriteSize, changed[p].x, changed[p].y, changed[p].w, changed[p].h);
					 }
				 }
				 else{//if the object is not a proper game object, just draw the text of whatever is in there
					console.log('non-game object object found');
					canvas.fillStyle = "#aaa";
					canvas.fillRect(changed[p].x,changed[p].y, changed[p].w, changed[p].h);
					//this sets the font to arial and the size to 70% of the average of the height and width.
					canvas.font = parseInt((((changed[p].h+changed[p].w)/2)*.7),10)+"px Arial";
					//this writes the text of the object at the 20% more than cell's x and y locations (ie: toward the center of the cell).
					canvas.fillText(changed[p].object,(changed[p].x)+(parseInt((changed[p].w*.2),10)),(changed[p].y)-(parseInt((changed[p].h*.2),10)));
				 }

				 changed[p].changed = false;
			 }//end object draw if
	}
	//here we should clear out changed, to keep changed from growing from frame to frame. BUT
	// we do it at the end of the render function instead of here, because using some render configs,
	//changed is still populated, but this sub is never called, leading to changed growing larger and larger every frame.

}//end drawChangedObjects

function drawObjects(grid, canvas, visibleOnly){

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
							canvas.drawImage(sprites, grid[i][f].object.spritex, grid[i][f].object.spritey, grid[i][f].object.spriteSize, grid[i][f].object.spriteSize, grid[i][f].x, grid[i][f].y, grid[i][f].w, grid[i][f].h);
						}
						else {
							canvas.fillStyle = "#555";
							canvas.fillRect(grid[i][f].x, grid[i][f].y, grid[i][f].w, grid[i][f].h);
							//draw the image ANYWAY, just draw it at a very low transparency, so its hard to see.
							//this keeps the game from having huge ugly swaths of solid 'shadow'
							// canvas.globalAlpha = 0.04;
							// canvas.drawImage(sprites, grid[i][f].object.spritex, grid[i][f].object.spritey, grid[i][f].object.spriteSize, grid[i][f].object.spriteSize, grid[i][f].x, grid[i][f].y, grid[i][f].w, grid[i][f].h);
							// canvas.globalAlpha = 1;

						}
					 }//end visible only check
					 else {
						 canvas.drawImage(sprites, grid[i][f].object.spritex, grid[i][f].object.spritey, grid[i][f].object.spriteSize, grid[i][f].object.spriteSize, grid[i][f].x, grid[i][f].y, grid[i][f].w, grid[i][f].h);
					 }
				 }
				 else{//if the object is not a proper game object, just draw the text of whatever is in there
					console.log('non-game object object found');
					canvas.fillStyle = "#aaa";
					canvas.fillRect(grid[i][f].x, grid[i][f].y, grid[i][f].w, grid[i][f].h);
					//this sets the font to arial and the size to 70% of the average of the height and width.
					canvas.font = parseInt((((grid[i][f].h+grid[i][f].w)/2)*.7),10)+"px Arial";
					//this writes the text of the object at the 20% more than cell's x and y locations (ie: toward the center of the cell).
					canvas.fillText(grid[i][f].object,(grid[i][f].x)+(parseInt((grid[i][f].w*.2),10)),(grid[i][f].y)-(parseInt((grid[i][f].h*.2),10)));
				 }
			 }//end object draw if
		}
	}

}//end drawObjects

function drawEntities(grid, entities, canvas){
	for(var e =0; e < entities.length; e++){
		var halfsize = Math.floor(entities[e].spriteSize/2);
		var cellEntityIsOn = findCellAt(grid, entities[e].x, entities[e].y)
		if(cellEntityIsOn.object.visible){//dont draw the entity if the cell its on isnt visible anyway.
			canvas.save();//set a translation save point...
			//rotate and translate the canvas context to match the rotation and location of the entity before we draw..
			canvas.translate(entities[e].x,entities[e].y);
			canvas.rotate(entities[e].rotation);
			//find the spritesheet x and y for this entity's animation frame
			var animX = (entities[e].animations[entities[e].currentAnim].spriteX) + (entities[e].currentFrame * entities[e].spriteSize);
			var animY = entities[e].animations[entities[e].currentAnim].spriteY;
			//draw the sprite image for this entity
			canvas.drawImage(sprites, animX, animY, entities[e].spriteSize, entities[e].spriteSize, -1*halfsize, -1*halfsize, entities[e].spriteSize, entities[e].spriteSize)
			// canvas.drawImage(sprites, entities[e].spriteX, entities[e].spriteY, entities[e].spriteSize, entities[e].spriteSize, -1*halfsize, -1*halfsize, entities[e].spriteSize, entities[e].spriteSize)
			//rotate the canvas context back to what it was after we draw...
			canvas.restore();//restore the translation save point.
		}
	}//end draw entities loop
}


//-------------------------------------------BELOW THIS LINE ARE LOW LEVEL HELPER FUNCTIIONS AND CLASSES-----------------------------------
//initializes a grid for drawing.
function girdInit(size, cellsX, cellsY, fillColor, edgeColor)
{//size is the width and height of the square cells
 //cellsx is the number of horizontal cells in the grid
 //cellsy is the number of vertical cells in the grid
 //fillcolor is the color to fill each cell with (can represent cell states too)
 //edgecolor is the color of the cell's walls.
 console.log("initializing grid...");
  var gameGrid=[];//initializes the grid array

  for(var i=0; i<cellsX; i++)
  {
    //console.log("building col: "+i);
    gameGrid[i]=[]; //initializes each column in the grid array
    for(var f=0; f<cellsY; f++)
    {
      //console.log("building cell: "+"["+i+","+f+"]");
      gameGrid[i][f] = new Cell(size*i, size*f, size, size, i, f, fillColor, edgeColor);
      //console.log(gameGrid[i][f]);
    }//end x for loop
  }//end y for loop

  return gameGrid;
}//end gridInit

//this is the cell constructor. it represents and helps set up the info for each cell on our grid.
function Cell(x, y, h, w, indexX, indexY, fillColor, edgeColor)
{
  this.indexY = indexY; //this is the Y index of this cell on the grid
  this.indexX = indexX; //this is the X index of this cell on the Grid
  this.x = x; //this is the x pixel location of the top left corner of this cell on the canvas object
  this.y = y; //this is the y pixel location of the top left corner of this cell on the canvas object
  this.h = h; //how tall the cell is
  this.w = w; // how wide the cell is
  this.centerX = x+(Math.floor(w/2)); //the horizontal center of this cell
  this.centerY = y+(Math.floor(h/2)); //the vertical center of this cell
  this.fillColor = fillColor;
  this.edgeColor = edgeColor;

  //for use in maze gen.
  this.wallN = true; //is this cell's north wall up?
  this.wallE = true; //is this cell's east wall up?
  this.wallS = true; //is this cell's south wall up?
  this.wallW = true; //is this cell's west wall up?
  this.beenTo = false; //have we been to this cell before?

  //for use in A*
  this.previous = 0;
  this.next = 0;
  this.distToStart = 0; //our g(n)
  this.distToEnd = 0;// our h(n)
  this.f = 0; // g(n) + h(n)

  //for use in conway's game of life
  this.liveNeighbors = 0; //how many of this cell's Neighbors are alive?

  //for use in voronoi
  this.isSeed = false;
  this.siteColor = fillColor;
  this.nearestSeed = 0;

  //for use in game object assignment
  this.object = 0;

}//end constructor

//this function finds the grid cell at an x y position on the canvas
function findCellAt(grid, x, y){
//I think this can be optimized by dividing the mouse's x and y positions by the cell's size. this would give you the indicies of the cell you're on.
	//these next 6 lines make sure we're asking for a cell within the bounds of the grid.
	//if not, we change x and y to be NEAR the requested location but still on the grid.
	if(x < 0) {x = 0;}
	if(y < 0) {y = 0;}
	var height = (grid[0].length)*grid[0][0].w-1;
	var width = (grid.length)*grid[0][0].h-1;
	if(x > width) {x = width;}
	if(y > height) {y = height;}
	return grid[Math.floor(x/grid[0][0].w)][Math.floor(y/grid[0][0].h)]; //spoiler alert: it can.

	//old implimentation just in case i ever need it. it served me well.
	//but it was n^2 complexity and the above implimentation is 1 complexity
	/* for(var i =0;i<grid.length;i++){
		for(var k=0;k<grid[i].length;k++){
			//here we find this cells max boundries
			var cellXmin = grid[i][k].x;
			var cellXmax = grid[i][k].x + grid[i][k].w;
			var cellYmin = grid[i][k].y;
			var cellYmax = grid[i][k].y + grid[i][k].h;

			//if the passed in x and y are within the height and width of this cell's x and y, its a match.
			if((x >= cellXmin && x <= cellXmax) && (y >= cellYmin && y <= cellYmax)){
				return grid[i][k];
			}
		}
	} */
};

//this function finds the position of the mouse on the canvas
//in order to find the position of the mouse on the canvas, we have to subtract the position of the canvas from the global position of the mouse on the screen
function getMousePos(canvas, e){
	var rect = canvas.getBoundingClientRect();
	return {
		x: e.clientX - rect.left,
		y: e.clientY - rect.top
	}
};
