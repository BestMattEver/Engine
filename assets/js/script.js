
//ideally, this would be a different file, but since chrome doesnt seem to support imports without cross domain issues, im putting it here for now...
const level1 = [
	['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['.','.','.','.','.','.','.','.','.','.','.','1','_','_','_','1','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['.','.','.','.','.','.','.','.','.','.','.','1','_','_','_','1','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['.','.','.','.','.','.','.','.','.','.','.','1','_','_','_','1','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['.','.','.','.','.','.','.','.','.','.','.','1','_','_','_','1','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['.','.','.','.','.','.','.','.','.','.','.','1','_','_','_','1','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['.','.','.','.','.','.','1','1','1','1','1','1','_','_','_','1','1','1','1','1','1','1','.','.','.','.','.','.','.','.'],
	['.','.','.','.','.','.','1','_','_','_','_','_','_','_','_','_','_','_','_','_','_','1','.','.','.','.','.','.','.','.'],
	['.','.','.','.','.','.','1','_','_','_','_','_','_','_','_','_','_','_','_','_','_','1','.','1','1','1','1','1','.','.'],
	['.','.','.','.','.','.','1','_','_','2','_','_','_','_','_','_','_','_','2','_','_','1','.','1','2','2','2','1','.','.'],
	['.','.','.','.','.','.','1','_','_','_','_','_','_','_','_','_','_','_','_','_','_','1','1','1','_','_','_','1','.','.'],
	['.','.','.','.','.','.','1','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','1','.','.'],
	['.','.','.','.','.','.','1','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','1','.','.'],
	['.','.','.','.','.','.','1','_','_','_','_','_','_','_','_','_','_','_','_','_','_','1','1','1','_','_','_','1','.','.'],
	['.','.','.','.','.','.','1','_','_','_','_','_','_','_','_','_','_','_','_','_','_','1','.','1','1','1','1','1','.','.'],
	['.','.','.','.','.','.','1','_','_','2','_','_','_','_','_','_','_','_','2','_','_','1','.','.','.','.','.','.','.','.'],
	['.','.','.','.','.','.','1','_','_','_','_','_','_','_','_','_','_','_','_','_','_','1','.','.','.','.','.','.','.','.'],
	['.','.','.','.','.','.','1','_','_','_','_','_','_','_','_','_','_','_','_','_','_','1','.','.','.','.','.','.','.','.'],
	['.','.','.','.','.','.','1','1','1','1','_','1','1','1','1','1','1','1','1','1','1','1','.','.','.','.','.','.','.','.'],
	['.','.','.','.','.','.','.','.','.','3','_','3','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['.','.','.','.','.','.','.','.','.','3','_','3','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['.','.','.','.','.','.','.','.','3','3','_','3','3','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['.','.','.','.','.','.','.','.','3','2','_','2','3','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['.','.','.','.','.','.','.','.','3','3','3','3','3','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
];
const level2 = [
	['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','4','.','.','.','.','.','.','.','.'],
	['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','4','.'],
	['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','4','.','.','.','.','.','.','.','.','.','.','.','.'],
	['.','.','.','4','.','4','.','.','.','.','.','.','.','4','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['.','.','.','1','.','1','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','4','.','.','.','.','4','.','.','.'],
	['.','.','1','_','_','_','1','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['.','.','1','_','_','_','1','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['.','1','_','_','_','_','_','1','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['.','1','_','_','_','_','_','1','.','.','.','.','4','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['.','1','_','3','3','9','_','_','.','.','.','.','.','.','4','.','.','.','.','.','.','4','.','.','.','.','.','.','.','.'],
	['1','_','_','3','3','9','_','_','.','.','.','.','4','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['1','_','_','_','_','_','_','_','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['1','_','_','_','_','_','_','_','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['1','_','_','_','_','_','_','_','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['.','1','_','_','3','3','_',',','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','4','4','.','.','.'],
	['.','1','_','_','3','3','_','1','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['.','1','_','_','_','_','_','1','.','.','.','.','.','.','.','.','.','4','4','.','.','.','.','.','.','.','.','.','.','.'],
	['.','.','1','_','_','_','1','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['.','.','1','2','2','2','1','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['.','.','.','1','2','1','.','.','.','.','.','.','.','.','.','4','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['.','.','.','.','1','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','4','.','.','.','4','.','.','.'],
	['.','.','4','.','.','.','.','.','.','.','.','.','4','.','.','.','.','.','.','.','.','.','4','.','.','.','.','.','.','.'],
	['.','.','.','4','.','.','.','.','.','.','.','.','.','4','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['.','.','.','4','.','.','.','.','.','4','.','.','.','.','.','.','.','.','4','.','.','.','.','4','.','.','.','4','4','.'],
	['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
	['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
];
//this is the image that contains all the 16x16 sprites
var sprites = new Image();
sprites.src = "assets/images/mySprites2.png";

//tileObjects contains objects that describe the attributes for each possible tile type.
//the objects will be added to the cell's object key to represent the sprite/object that should be in that cell.
//rep is the representation on the level array (it also happens to be the order in which the appear in the tileObject array, but in future it could be '}' or something)
//name is a human readable name
//spritex is the horizontal pixel where the sprite for this object starts (in the sprites img)
//spritey is the vertical pixel where the sprite for this object starts (in the sprites img)
//spriteSize is how long all 4 sides of the sprite are (no retangular sprites allowed, only squares.)
//walkable indicates if the object is walkable (ie: can the player move across it)
//damaging indicates if the object damages the player when touched.
var tileObjects =  [
	{"rep":".", "name":"floor", "spritex":64, "spritey" :16, "spriteSize":16, "solid":false, "damaging":false, "visible": false},
	{"rep":"_", "name":"floor2", "spritex":80, "spritey" :16, "spriteSize":16, "solid":false, "damaging":false, "visible": false},
	{"rep":"1", "name":"wall", "spritex":0, "spritey" :16, "spriteSize":16, "solid":true, "damaging":false, "visible": false},
	{"rep":"2", "name":"fount", "spritex":16, "spritey" :16, "spriteSize":16, "solid":true, "damaging":false, "visible": false},
	{"rep":"3", "name":"wall2", "spritex":32, "spritey" :16, "spriteSize":16, "solid":true, "damaging":false, "visible": false},
	{"rep":"4", "name":"tree", "spritex":48, "spritey" :16, "spriteSize":16, "solid":true, "damaging":false, "visible": false},
];

//this array holds information about all the interactible entities.
var entities = [
	{name: "player", x: 250, y: 250, xVec: 0, yVec: 0, spriteX: 0, spriteY: 0, spriteSize: 16, solid: true}
];
//IDEALLY everything above this line would be in a different file, and would instead be imported and used. but i was having trouble with cross domain issues, so it's here for now...
//=====================================================================================================================================================

console.log("is js working?");

//this is the canvas we've defined in our html
var gameCanvas1 = $("#gameCanvas1")[0];

//we now give that canvas a 'context' and save it in a variable. The context is what we actually use to do the 'drawing'
var context1 = gameCanvas1.getContext("2d");
var width1 = gameCanvas1.width;
var height1 = gameCanvas1.height;

//initialize the grid
var grid = girdInit(16,50,50,'#0b175b',"#2b43c6");

//our game loop is below.
//this calls loop every 17 miliseconds (about 60fps).
//loop takes care of the game logic, and also re-renders the screen.
var gameLoopInterval = setInterval(loop, 30, grid, context1, entities);

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
	facePlayerToCursor(entities, mousex, mousey);

}//end mouseMoveHandler

function mouseClickHandler(entities, mousex, mousey){
	//this is where we put whatever code we want to run when the mouse is clicked.
	
	var foundCell = findCellAt(grid, mousex, mousey);
	//shoot a ray from the position of the player to the mouse.
	var hitcoords = castRay(grid, context1, entities[0].x, entities[0].y, mousex, mousey);
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

//this just function takes an entity and changes its x and y location by its x and y velocity 
function moveEntityByVelocity(entity){
	//move the character by their vector magnitudes
	entity.x += entity.xVec;
	entity.y += entity.yVec;
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
		facePlayerToCursor(entities, mousePos.x, mousePos.y);
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
	}
	
}//end adjustPlayerVelocity

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

//this function is used to figure out which of the tile objects on the grid are visible from the an entity's position. 
function markObjectsVisibleToEntity(grid, entity){
	for(var i=0; i<grid.length; i++)
	{
		for(var f=0; f<grid[i].length; f++)
		{
			//does this cell even have an object in it to show?
			if(typeof(grid[i][f].object) == "object"){
				//cast a ray from the player toward this object, and get the location where it intersects -something-
				var endLoc = castRay(grid, entity.x, entity.y, grid[i][f].centerX, grid[i][f].centerY);
				//find the cell at the intersection location
				var cell = findCellAt(grid, endLoc.x, endLoc.y);
				//if the cell at the intersection location is this very same cell, mark it as visible
				//(since an unbroken line from the player to it is possible).
				if(grid[i][f] == cell){
					grid[i][f].object.visible = true;
				}
				else{
					grid[i][f].object.visible = false;
				}
			}
		}
	}
	/* //it works like this: it shoots 360 rays, evenly spaced, out from the player. any objects that are hit by a ray are marked as visible=true
	for(var a = 0; a<360; a++){
		//first we need to find a point on a circle around the player that is very large, so that we can cast a ray that goes across the whole game space.
		var radius = 1000;
		var rads = a*0.1745329252 //this converts the angle A into a radian value (I found the conversion constant online somewhere)
		var x = entity.x+(radius*Math.sin(rads)); //this uses the radius, player's x position, and the radian angle to find the x of the end point
	} */
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

//this function takes a 2d level array and an object list to assign the correct object to each cell in the grid based on the 2d level array
function assignLevelToGrid(grid, level, objs){
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
					}
					else{//otherwise, just assign the level array's represenation to the cell.
						grid[k][j].object = level[l][k];
					}
				}//end exists else
		}//end k loop
	}//end assignment (j) loop
};


//this function checks collision between an entity and a cell, returns a true or false if the entity is colliding with the cell
function CheckAABBCollision(entity, cell){
	//first make sure both the cell and the entity should be colliding at all. 
	var collide = false;
	if(cell.object.solid && entity.solid){
		if(//then check their 'Axis Aligned Bounding Box' collision. 
			entity.x < cell.x + cell.object.spriteSize &&
			entity.x + entity.spriteSize > cell.x &&
			entity.y < cell.y + cell.object.spriteSize &&
			entity.y + entity.spriteSize > cell.y
		  ){
			//it collides
			console.log("COLLISION:");
			console.log(cell);
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
		if(foundCell.object.solid){
			liney=newy;
			linex=newx;
			f=1;
		}
	}

	//return the collision point OR the origional clicked point.
	return ({x:linex,y:liney});
}

function facePlayerToCursor(entities, mousex, mousey){
//make the player's character sprite face the mouse cursor by changing the sprite depending on where the cursor is.
	var scalar = .3;
	var dist = eucledianDistance({x:entities[0].x, y:entities[0].y},{x:mousex,y:mousey});
	//console.log("mousex"+mousex);
	//console.log(dist*scalar);
	//is the mouse either upish or downish?
	if(mousex >= entities[0].x-(dist*scalar) && mousex <= entities[0].x+(dist*scalar)){
		if(mousey < entities[0].y){entities[0].spriteX = 0}//directly up
		if(mousey > entities[0].y){entities[0].spriteX = 64}//directly down
	}
	else{//no? then how about leftish or rightish?
		if(mousey >= entities[0].y-(dist*scalar) && mousey <= entities[0].y+(dist*scalar)){
			if(mousex < entities[0].x){entities[0].spriteX = 96}//directly left
			if(mousex > entities[0].x){entities[0].spriteX = 32}//directly right
		}
		else{//still no? then it must be on a diagnoal...
			if(mousex < entities[0].x && mousey < entities[0].y){entities[0].spriteX = 112}//down right
			else if(mousex > entities[0].x && mousey < entities[0].y){entities[0].spriteX = 16}//up right
			else if(mousex < entities[0].x && mousey > entities[0].y){entities[0].spriteX = 80}//down left
			else if(mousex > entities[0].x && mousey > entities[0].y){entities[0].spriteX = 48}//up left
		}
	}
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

function loop(grid, canvas, entities){
	//-------------------------------------THIS IS WHERE THE GAME LOGIC WOULD GO------------------------------------------

	//adjust velocity is called here to make sure we properly accelerate the entity/player EVERY frame. this avoids weird halting behavior when changing direction.
	var delta = 3; //working value: 1dwsawd
	var max = 9;// working value: 3
	adjustVelocityOnKeypress(entities[0], keysPressed, delta, max);
	
	//find where/if the entity/player is colliding with env objects and adjust the velocity to keep him from going through stuff
	var bounce = 3; //working value: 1
	findCollisionsThenAdjustVelocity(entities[0], grid, bounce);

	//this function applies a small reduction to the x and y velocities of an entity to mimic friction. its how entities stop moving.
	var friction = 1;//working value: .3
	applyFrictionToVelocity(entities[0], friction);
	
	//this function (FINALLY) actually changes the x and y location of an entity by its x and y velocity
	moveEntityByVelocity(entities[0]);
	
	
	
	//----------------------------------------------end the game logic----------------------------------------------------


	//define the object that describes what we want to render:
	var renderThese = {grid: true, objects: true, entities: true, visibleOnly: true};
	
	if(renderThese.visibleOnly){
		//this shoots A BUNCH of rays. no need to do it if we'll see everything anyway.
		markObjectsVisibleToEntity(grid, entities[0]);
	}
	
	//finally, at the end we render all graphics
	render(renderThese, grid, canvas, entities);
}

//this function is called at the end of the game loop and collects all the actual drawing functions and runs them in order.
//It takes an object that defines which rendering subs should be run on each pass. (so, for instnace, we can turn off grid drawing)
//first, it draws the basic grid (just squares w/ colors)
//second, it draws the static objects on that grid (like background sprites)
//third, it draws the mobile objects on the canvas (like the player, enemies and items)
//fourth, it draws obscuring foreground stuff (clouds? tall buildings? UI?)
function render(renderThese, grid, canvas, entities){
	//first thing first: clear the grid.
	canvas.clearRect(0, 0, width1, height1);

	//if gird is true in the renderThese object, draw the grid.
	if(renderThese.grid){
		drawGrid(canvas, grid, true);
	}
	//if objects is true in renderThese object, draw the objects
	if(renderThese.objects){
		drawObjects(grid, canvas, renderThese.visibleOnly);
	}

	if(renderThese.entities){
		drawEntities(entities, canvas);
	}
	//draw the entities/mobile objects here

	//draw the UI and obscuring stuff here.

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
							canvas.globalAlpha = 0.04;
							canvas.drawImage(sprites, grid[i][f].object.spritex, grid[i][f].object.spritey, grid[i][f].object.spriteSize, grid[i][f].object.spriteSize, grid[i][f].x, grid[i][f].y, grid[i][f].w, grid[i][f].h);
							canvas.globalAlpha = 1;
							
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

function drawEntities(entities, canvas){
	for(var e =0; e < entities.length; e++){
		var halfsize = Math.floor(entities[e].spriteSize/2);
		canvas.drawImage(sprites, entities[e].spriteX, entities[e].spriteY, entities[e].spriteSize, entities[e].spriteSize, entities[e].x-halfsize, entities[e].y-halfsize, entities[e].spriteSize, entities[e].spriteSize)
	}//end draw entities loop
}


//-------------------------------------------BELOW THIS LINE ARE LOW LEVEL HELPER FUNCTIIONS AND CLASSES-----------------------------------
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
