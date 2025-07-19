


type Color = [number,number,number]


export type Block = {
  alive: boolean
  move:(pos:Pos)=>Promise<Block>
  del:(pos:Pos)=>Promise<void>
  put:(pos:Pos, color:Color, energy?:number) => Promise<Block>

  energy: number
  pos: Pos
  id: number
  color: Color
}


type Action = {
  type:"Move" | "Delete"
  pos: Pos
} | {
  type:"Put"
  pos: Pos
  color:Color
  energy: number
}


export type Pos = [number, number]

export type State = {
  world: {
    pixels: (null | Block)[][];
    subscribe: (fn: (focus: Pos | undefined) => void) => () => void;
    getPixel: (pos: Pos) => Block | null;
  };
  keyboard: {
    isPressed: (key: string) => boolean;
    subscribe: (fn: (key: string) => void) => () => void;
  };
};


export type UserAction = {
  type:"Move" | "Delete"
  pos: Pos
} | {
  type:"Put"
  pos: Pos
  color: Color
  energy: number
}



export function main(state:State, player:Block){

  state.keyboard.subscribe(console.log)

}


