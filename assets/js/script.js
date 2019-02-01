
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

//this offsets the camera. used primarily for camera shake
var cameraOffset = {
	active: false, //do we even have to bother trying to offset?
	random: true, //is the offset random within the x y range?
	frames: 0, // how many frames will the offset last?
	x: 0, //if random, this is the max x offset, if not, it IS the offset.
	y: 0 //same as above but for y
};

//this is the total elapsed play time in frames.
//we use it for day/night cycle, and for determining how far along in the narrative we should be.
var playTime = 0;

//our game loop is below.
//this calls the loop function every 17 miliseconds (about 60fps). (33 ms for 30fps)
//loop takes care of the game logic, and also re-renders the screen.
var gameLoopInterval = setInterval(loop, 30, grid, context1, entities, changed, cameraOffset);

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

		applyImpulseToEntity(entity, .7, entity.x+xdir, entity.y+ydir);
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
function findCollisionsThenAdjustVelocity(entity, grid, bounce, cameraOffset){
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
		//the next lines cause camera shake.
		cameraOffset.active = true;
		cameraOffset.frames = 4;
		cameraOffset.x = 2;
		cameraOffset.y = 2;
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
function processEntities(entities, grid, bounce, mag, friction, cameraOffset){

	//thanks to https://www.quora.com/In-JavaScript-how-do-you-create-an-empty-2D-array for helping me figure out how to make an empty 2d array. :(
	var collisionArray = Array(entities.length).fill(false).map(()=>Array(entities.length).fill(false));

	//iterate through all the entities
	for(var i =0; i<entities.length;i++){
		//first: figure out if the entity is at rest.
		if(entities[i].xVec === 0 && entities[i].yVec === 0){
			entities[i].currentAnim = "idle1";
		}

		//check/incriment the animation frame of this entity
		if(entities[i].animations[entities[i].currentAnim].totalFrames > entities[i].currentFrame) {entities[i].currentFrame++}
		else { entities[i].currentFrame = 0;}

		//console.log("dealing with entity: "+i);
		//first, tick down each entity's cooldowns, so abilities can be used if possible. .17 is the amount of seconds per frame.
		tickDownCooldowns(entities[i], .17);

		//next, find where/if the entity/player is colliding with env objects and adjust the velocity to keep him from going through stuff
		findCollisionsThenAdjustVelocity(entities[i], grid, bounce, cameraOffset);

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
						collisionArray[i][j] = true;
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

// this function is called in the game loop and iterates through all the particle systems, and each active emitter for that
// particle system, and each particle in each of those systems and updates all of it based on the the rules in the config for
// each particle system.
function processParticleSystems(particleSystems, changed, grid){
	//for each particle system...
	particleSystems.forEach(system => {
		if(system.activeEmitters.length > 0) {
			//each active emitter IN that particle system
			system.activeEmitters.forEach(emitter => {
				// TODO: check if life is -1 (meaning always on)
				//if the emitter isnt old...
				if(emitter.age <= emitter.life) {
					emitter.age++;
					if(emitter.newParticlesThisFrame == 0){
						//if exactly 0 particles are needed, add the rate of emission to the new particles needed var.
						emitter.newParticlesThisFrame = emitter.rate;
					}
					//check if the emitter requires a whole new particle this frame
					if(emitter.newParticlesThisFrame > 1) {
						
						var newParticlesNeeded = Math.floor(emitter.newParticlesThisFrame);
						for(var j =0; j)
						emitter.particles.forEach(particle => {
							if(!particle.alive){
								particle.alive = true;
							}
						}
						//make a dead particle alive for each newparticle needed.
						emitter.newParticlesThisFrame = (newParticlesThisFrame-emitter.newParticlesNeeded);
					}
					//otherwise, add the rate to the newparticle number so eventually it will be over 1.
					else{
						emitter.newParticlesThisFrame += emitter.rate;
					}
				}
				//if the emitter is too old, slice it out of the active emitters array forever.
				else{

				}
				//and for each particle in THAT active emitter...
				emitter.particles.forEach(particle => {
					//if the particle isnt dead or too old.
					if(!particle.alive){
						//do nothing
					}
					else if(particle.age <= particle.maxlife){
						particle.alive = false;
					}
					else {
						particle.age++;
						particle.r = particle.r + emitter.rDelta;
						particle.g = particle.g + emitter.gDelta;
						particle.b = particle.b + emitter.bDelta;
						particle.a = particle.a + emitter.aDelta;
					}
				})
			})
		}
	})
}

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

function loop(grid, canvas, entities, changed, cameraOffset){
	//-------------------------------------THIS IS WHERE THE GAME LOGIC WOULD GO------------------------------------------
	if(!loop.hasOwnProperty("playTime")){
		loop.playTime = 0;
	}
	else{
		loop.playTime++;
	}

	//adjust velocity is called here to make sure we properly accelerate the entity/player EVERY frame. this avoids weird halting behavior when changing direction.
	var delta = 2; //working value: 1
	var max = 6;// working value: 3
	adjustVelocityOnKeypress(entities[0], keysPressed, delta, max);

	//this function iterates over all the entities and checks their collisions and updates their positions and vectors. it also ticks down their cooldowns
	var bounce = 3; //how much to bounce an entity off of a solid object. working value: 1
	var mag = .9;//this is the magnitude of impulses. logically, 1 would be elastic collisions. so this is slightly more flubbery?
	var friction = .6;//The amount by which all velocities are reduced every frame. working value: .3
	processEntities(entities, grid, bounce, mag, friction, cameraOffset);

	//----------------------------------------------end the game logic----------------------------------------------------

	//----------------------------------------------start render config--------------------------------------------------
	//define the object that describes what we want to render:
	var renderThese = {
		grid: false,
		objects: true,
		entities: true,
		visibleOnly: false,
		onlyChanged: cameraOffset.active ? false : true, // this needs to be turned off to see the camera offset.
		ui: true,
	};
	//warning, setting grid to true REALLY eats up computer power and causes frame rate drop

	if(renderThese.visibleOnly){
		//this shoots A BUNCH of rays. no need to do it if we'll see everything anyway.
		var radius = 250;
		var visibleCells = markObjectsVisibleToEntity_radius(grid, entities[0], radius, changed);
		findVisionConesFromEntity(grid, visibleCells, entities[0], radius, changed);
		//markObjectsVisibleToEntity(grid, entities[0]);
	}

	//finally, at the end we render all graphics
	render(renderThese, grid, canvas, entities, changed, loop.playTime, cameraOffset);
}//END GAME LOOP



// this takes the global cameraoffset object and figures out the exact offset of the camera for this particular frame
function processCameraOffset(cameraOffset) {
	//if the cameraoffset is active, figure out what it is for this frame, and count its frames down.
	var camOffsetX = 0;
	var camOffsetY = 0;
	//if we have a valid offset...
	if(cameraOffset.active && cameraOffset.frames > 0){
		console.log("wiggle");
		//if the offset is random, choose what it should be.
		if(cameraOffset.random){
			camOffsetX = Math.floor(Math.random() * Math.floor(cameraOffset.x));
			camOffsetY = Math.floor(Math.random() * Math.floor(cameraOffset.y));
		}
		// if its active but NOT random
		else {
			camOffsetX = cameraOffset.x;
			camOffsetY = cameraOffset.y;
		}
		//remove a frame from the camera offset frames timer
		cameraOffset.frames--;
	}
	// if the cam offset is not valid or active,
	else {
		camOffsetX = 0;
		camOffsetY = 0;
		cameraOffset.active = false;
	}

	return {x: camOffsetX, y: camOffsetY};
}

//this takes the total playtime and parses it into an in game time, for day/night cycle and narrative pacing.
function findInGameTime(playTime) {
	//we're going to go with 1 frame real world time = 1 sec game time, so:
	//hold up, this counts frames not ms. so, at 60fps...
	var elapsedGameSecs = playTime; //this converts 'frames' to time. to slow down or speed up elapsed game time calcs, change this line
	var elapsedGameMins = elapsedGameSecs/60;
	var elapsedGameHours = elapsedGameMins/60;
	var elapsedGameDays = elapsedGameHours/24;

	var displayDays = Math.floor(elapsedGameDays);
	var displayHours = Math.floor(elapsedGameHours - (displayDays*24));
	var displayMins = Math.floor(elapsedGameMins - ((displayHours+(displayDays*24))*60));

	return "Day "+displayDays+", "+displayHours+":"+displayMins;
}

//this function will initialize a particle emitter in the particleSystems object. essentially placing it on the map. 
function particleEmitterInit(particleSystems, xLoc, yLoc, system) {
	var newEmitter = {

		life: system.config.systemLife,
		particleNum: Math.floor(Math.random() * (system.config.particleNumMax - system.config.particleNumMin + 1)) + system.config.particleNumMin,
		particles: [],
		age: 0,
		rate: 0,
		rDelta: Math.floor((system.config.rEnd - system.config.rStart) / system.config.systemLife), 
		gDelta:  Math.floor((system.config.gEnd - system.config.gStart) / system.config.systemLife), 
		bDelta:  Math.floor((system.config.bEnd - system.config.bStart) / system.config.systemLife),
		aDelta:  Math.floor((system.config.aEnd - system.config.aStart) / system.config.systemLife), 
		x1: xLoc,
		y1: yLoc,
		x2: xLoc + system.config.xSize,
		y2: yLoc + system.config.ySize,
		newParticlesThisFrame: 0;
	};
	// finding the emission rate represented as "particles per frame"
	newEmitter.rate = newEmitter.particleNum/system.config.systemLife

	for(var i = 0; i > newEmitter.particleNum; i++){
		newEmitter.particles.push({
			alive: false,
			age: 0,
			maxlife: Math.floor(Math.random() * (system.config.lifeMax - system.config.lifeMin + 1)) + system.config.lifeMin, 
			r: system.config.rStart,
			g: system.config.gStart,
			g: system.config.bStart,
			a: system.config.aStart,
			x: Math.floor(Math.random() * (newEmitter.x1 - newEmitter.x2 + 1)) + newEmitter.x2, 
			y: Math.floor(Math.random() * (newEmitter.y1 - newEmitter.y2 + 1)) + newEmitter.y2, 
			xVel: Math.floor(Math.random() * (system.config.yVelMax - system.config.yVelMin + 1)) + system.config.yVelMin, 
			yVel: Math.floor(Math.random() * (system.config.yVelMax - system.config.yVelMin + 1)) + system.config.yVelMin,
			size: Math.floor(Math.random() * (system.config.sizeMax - system.config.sizeMin + 1)) + system.config.sizeMin,

		});
	}

	particleSystems[system].activeEmitters.push(newEmitter);
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
