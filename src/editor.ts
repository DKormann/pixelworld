import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import 'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution';
import { Writable } from './store';

import * as ts from "typescript"



// Wait for monaco to be fully loaded
window.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    return './vs/base/worker/workerMain.js';
  }

};



const defaultScript = `




type Color = [number,number,number]

type Block = {
  alive: boolean
  move:(pos:Pos)=>Promise<Block>
  del:(pos:Pos)=>Promise<void>
  put:(pos:Pos, color:Color, energy?:number) => Promise<Block>

  energy: number
  pos: Pos
  id: number
  color: Color
}
type Pos = [number, number]

type State = {
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


type UserAction = {
  type:"Move" | "Delete"
  pos: Pos
} | {
  type:"Put"
  pos: Pos
  color: Color
  energy: number
}



function main(state:State, player:Block){

  state.keyboard.subscribe(console.log)

  console.log(player);
  

}
`


export const userScriptTS = new Writable("UserScriptTS", defaultScript);

userScriptTS.set(defaultScript)
export const userScript = new Writable("UserScript", "");

window.document.addEventListener("keydown", (e) => {
  if(e.key == "s" && e.metaKey){
    e.preventDefault()

    window.location.pathname = window.location.pathname.split("/").filter(s=>s!="editor").join("/") + (new Writable("servermode","").value == "local" ? "local" : "")
  }

})


window.addEventListener('load', async () => {
  // Create the editor
  const editor = monaco.editor.create(document.getElementById('editor')!, {
    theme: 'vs-dark',
    language: 'typescript',
    automaticLayout: true,
    minimap: {
      enabled: true
    },
    lineNumbers: 'on',
    fontSize: 14,
    wordWrap: 'on',
    scrollBeyondLastLine: false,
    renderWhitespace: 'selection',
    renderControlCharacters: true,
    formatOnPaste: true,
    formatOnType: true,
    tabSize: 2,
  });

  editor.setValue(userScriptTS.value);



  // Add change listener to compile code
  editor.onDidChangeModelContent(async () => {
    const code = editor.getValue();
    userScriptTS.set(code);
    const jscode = ts.transpile(code)
    userScript.set(jscode);
  });
});
