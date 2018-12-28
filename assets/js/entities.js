//this array holds information about all the interactible entities.
var entities = [
    {name: "player", x: 250, y: 250, xVec: 0, yVec: 0, spriteX: 0, spriteY: 0, spriteSize: 16, solid: true, rotation: 0,
        animations:{
            idle1: {spriteX: 0, spriteY:17, interruptible: true, totalFrames: 0},
            move: {spriteX: 0, spriteY:0, interruptible: true, totalFrames: 4},
            rollDodge: {spriteX: 0, spriteY:34, interruptible: false, totalFrames: 4},
            lightAttack: {spriteX: 0, spriteY:0, interruptible: false, totalFrames: 4}
        },
        cooldowns: {"rollDodge":0, "lightAttack":0}, currentAnim: "run", currentFrame: 0},

	{name: "ball", x: 600, y: 250, xVec: 0, yVec: 0, spriteX: 0, spriteY: 32, spriteSize: 16, solid: true, rotation: 0, frame: 0, animations:{
        move: {spriteX: 0, spriteY:53, interruptible: true, totalFrames: 1},
        idle1: {spriteX: 0, spriteY:70, interruptible: true, totalFrames: 0},
    },
    cooldowns: {}, currentAnim: "idle1", currentFrame: 0},
	{name: "ball2", x: 630, y: 280, xVec: 0, yVec: 0, spriteX: 0, spriteY: 32, spriteSize: 16, solid: true, rotation: 0, frame: 0, animations:{
        move: {spriteX: 0, spriteY:53, interruptible: true, totalFrames: 1},
        idle1: {spriteX: 0, spriteY:70, interruptible: true, totalFrames: 0},
    },
    cooldowns: {}, currentAnim: "idle1", currentFrame: 0},

	{name: "ball3", x: 560, y: 220, xVec: 0, yVec: 0, spriteX: 0, spriteY: 32, spriteSize: 16, solid: true, rotation: 0, frame: 0, animations:{
        move: {spriteX: 0, spriteY:53, interruptible: true, totalFrames: 1},
        idle1: {spriteX: 0, spriteY:70, interruptible: true, totalFrames: 0},
    },
    cooldowns: {}, currentAnim: "idle1", currentFrame: 0},

	{name: "ball4", x: 530, y: 170, xVec: 0, yVec: 0, spriteX: 0, spriteY: 32, spriteSize: 16, solid: true, rotation: 0, frame: 0, animations:{
        move: {spriteX: 0, spriteY:53, interruptible: true, totalFrames: 1},
        idle1: {spriteX: 0, spriteY:70, interruptible: true, totalFrames: 0},
    },
    cooldowns: {}, currentAnim: "idle1", currentFrame: 0},

	{name: "ball5", x: 530, y: 330, xVec: 0, yVec: 0, spriteX: 0, spriteY: 32, spriteSize: 16, solid: true, rotation: 0, frame: 0, animations:{
        move: {spriteX: 0, spriteY:53, interruptible: true, totalFrames: 1},
        idle1: {spriteX: 0, spriteY:70, interruptible: true, totalFrames: 0},
    },
    cooldowns: {}, currentAnim: "idle1", currentFrame: 0},
];