var particleSystems = {
    dust: {
        config: {
            particleNumMax: 200, // the maximum number of particles allowable in this system
            particleNumMin: 150, // the minimum number of particles allowable in this system
            systemLife: 200, // life of the system in frames (emission rate is determined by systemLife/number of particles) -1 is ongoing
            lifeMax: 20, // the max life for a particle in this system (in frames)
            lifeMin: 15, // the min life for a particle in this system (in frames)
            sizeMax: 10, //the maxwas size for a particle in this system
            sizeMin: 5, //the min size for a particle in this system
            sizeDelta: 1, // this is added (or subtracted for neg numbers) to size every frame of particle life to change size.
            xVelMax: 5, // the max x starting velocity of particles in this system
            xVelMin: 3, // the min x starting velocity of particles in this system 
            yVelMax: 5, // the max y starting velocity of particles in this system
            yVelMin: 3, // the min y starting velocity of particles in this system
            xAccel: 0, //the ammount added (or subtracted) to the x velocity of this particle each frame  
            yAccel: 0, //the ammount added (or subtracted) to the y velocity of this particle each frame
            rStart: 200, // these are RGBA starting values
            gStart: 30,
            bStart: 100,
            aStart: 1,
            rEnd: 255, // these are RGBA ending values
            gEnd: 5,
            bEnd: 150,
            aEnd: 0,
            xSize: 5, // this is the x size of the emission area, for point emission, use 0
            ySize: 5, // this is the y size of the emission area, for point emission, use 0
         },
        activeEmitters: [
            {},
        ],
    },
    fire:{
        config: {

        },
        activeEmitters: [
            {},
        ],
    } 
}