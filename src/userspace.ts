

 
import { Writable } from "./store";
import { Block, State } from "./world";



const defaultScript = "\n\n\n\n\ntype Color = [number,number,number]\n\ntype Block = {\n  alive: boolean\n  move:(pos:Pos)=>Promise<Block>\n  del:(pos:Pos)=>Promise<void>\n  put:(pos:Pos, color:Color, energy?:number) => Promise<Block>\n\n  energy: number\n  pos: Pos\n  id: number\n  color: Color\n}\ntype Pos = [number, number]\n\ntype State = {\n  world: {\n    pixels: (null | Block)[][];\n    subscribe: (fn: (focus: Pos | undefined) => void) => () => void;\n    getPixel: (pos: Pos) => Block | null;\n  };\n  keyboard: {\n    isPressed: (key: string) => boolean;\n    subscribe: (fn: (key: string) => void) => () => void;\n  };\n};\n\n\ntype UserAction = {\n  type:\"Move\" | \"Delete\"\n  pos: Pos\n} | {\n  type:\"Put\"\n  pos: Pos\n  color: Color\n  energy: number\n}\n\n\n\nfunction main(state:State, player:Block){\n\n  state.keyboard.subscribe(e=>{\n    console.log(e)\n    let x = 0\n    let y = 0\n    if (e==\"ArrowUp\") y -= 1\n    if (e==\"ArrowDown\") y += 1\n    if (e==\"ArrowLeft\") x -= 1\n    if (e==\"ArrowRight\") x += 1\n\n    target = [player.pos[0] + x, player.pos[1] + y]\n\n    player.move(target)\n    \n\n  })\n\n}\n\n\n\n\n\n"


export async function LoadUserFunction(){

  const userScript = new Writable("UserScript", defaultScript);

  console.log(userScript.value);

  return Function(userScript.value+"return main")() as (s:State, player:Block) => void
}


