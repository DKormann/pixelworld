/**
 * Represents an RGB color as an array of three numbers.
 * @typedef {number[]} Color
 * @property {number} [0] - Red component (0-255)
 * @property {number} [1] - Green component (0-255)
 * @property {number} [2] - Blue component (0-255)
 */

/**
 * Represents a block in the game world.
 * @typedef {Object} Block
 * @property {boolean} alive - Whether the block is alive/active
 * @property {function} move - Moves the block to a new position
 * @property {function} del - Deletes the block at a position
 * @property {function} put - Places a new block at a position
 * @property {number} energy - Current energy level of the block
 * @property {Pos} pos - Current position of the block
 * @property {number} id - Unique identifier for the block
 * @property {Color} color - Color of the block
 */

/**
 * Represents a position in the game world.
 * @typedef {number[]} Pos
 * @property {number} [0] - X coordinate
 * @property {number} [1] - Y coordinate
 */

/**
 * Represents the game state.
 * @typedef {Object} State
 * @property {Object} world - World-related properties
 * @property {Array<Array<Block | null>>} world.pixels - 2D array of blocks
 * @property {function} world.subscribe - Subscribe to world updates
 * @property {function} world.getPixel - Get block at position
 * @property {Object} keyboard - Keyboard input handling
 * @property {function} keyboard.isPressed - Check if key is pressed
 * @property {function} keyboard.subscribe - Subscribe to keyboard events
 */

/**
 * Represents a user action in the game.
 * @typedef {Object} UserAction
 * @property {"Move" | "Delete" | "Put"} type - Type of user action
 * @property {Pos} pos - Position of the action
 * @property {Color} [color] - Color for Put actions
 * @property {number} [energy] - Energy level for Put actions
 */



/**
 * Main game function that handles player actions.
 * @param {State} state - Current game state
 * @param {Block} player - Player's block
*/
function main(state, player) {
  
  console.log("loaded. hello");
  
  const world_size = 128;

  state.keyboard.subscribe(async key=>{

    let x = 0
    let y = 0

    if (key == "ArrowUp") y -= 1
    if (key == "ArrowDown") y += 1
    if (key == "ArrowLeft") x -= 1
    if (key == "ArrowRight") x += 1

    const target = [player.pos[0] + x, player.pos[1] + y]
    
    if (state.world.getPixel(target)){
      player.del(target)
    }else{
      player.move(target)
    }
    
  })
}


/**
 * @param {Block} player
 * @param {Pos} offset
 */

function move(player, offset){
  player.move([player.pos[0]+offset[0],player.pos[1]+offset[1]])  
}
