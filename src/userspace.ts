

 
import { Writable } from "./store";
import { Block, State } from "./world";



export async function LoadUserFunction(){

  const userScript =new Writable("UserScript", "");

  console.log(userScript.value);

  return Function(userScript.value+"return main")() as (s:State, player:Block) => void
}


