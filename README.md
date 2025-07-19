# Pixel World - Scriptable Pixel Game

A fully scriptable pixel-based game where you can code your character's behavior using JavaScript.

## Getting Started

1. Visit https://dkormann/pixelworld
2. Click "Show Code" in the top left corner
3. Select a character script or create your own
4. Click "Play" to start playing with your character
5. Use arrow keys to control your character
6. If you die, click "Reset Player" to restart

## API Documentation

### Main Function Structure

The game provides a simple API for creating character behaviors. Your main function will receive two parameters:

```javascript
function main(state, player) {
  // Your character logic here
}
```

### State Object

The `state` object provides access to the game world and keyboard input:

```typescript
interface State {
  world: {
    pixels: (null | Block)[][];
    subscribe: (fn: (focus: Pos | undefined) => void) => () => void;
    setPixel: (pos: Pos, color: Tile | null) => void;
    getPixel: (pos: Pos) => Block | null;
  };
  keyboard: {
    isPressed: (key: string) => boolean;
    subscribe: (fn: (key: string) => void) => () => void;
  };
}
```

### Block Object

The `Block` object represents your character and provides actions you can perform:

```typescript
interface Block {
  alive: boolean;
  move: (pos: Pos) => Promise<Block>;
  del: (pos: Pos) => Promise<void>;
  put: (pos: Pos, color: Color, energy?: number) => Promise<Block>;
  energy: number;
  pos: Pos;
  id: number;
  color: Color;
}
```

### Actions

Your character can perform three main types of actions:

1. **Move**: Move to a new position
   ```javascript
   await player.move([newX, newY]);
   ```

2. **Delete**: Delete a block at a position
   ```javascript
   await player.del([x, y]);
   ```

3. **Put**: Place a new block with color and energy
   ```javascript
   await player.put([x, y], [255, 0, 0], 50); // Red block with 50 energy
   ```

### World Size

The game world is 128x128 pixels.

### Example Script

Here's a simple character script that moves around and interacts with the world:

```javascript
function main(state, player) {
  console.log("Character loaded!");
  
  // Subscribe to keyboard events
  state.keyboard.subscribe(async key => {
    let x = 0;
    let y = 0;

    // Handle arrow keys
    if (key === "ArrowUp") y -= 1;
    if (key === "ArrowDown") y += 1;
    if (key === "ArrowLeft") x -= 1;
    if (key === "ArrowRight") x += 1;

    // Calculate target position
    const target = [player.pos[0] + x, player.pos[1] + y];
    
    // Try to move or delete block
    if (state.world.getPixel(target)) {
      await player.del(target);
    } else {
      await player.move(target);
    }
  });
}
```

## Development

The game is built with TypeScript and Vite. To run locally:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```
