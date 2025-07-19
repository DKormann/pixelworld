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


const defaultScript = "\n\n\n\n\ntype Color = [number,number,number]\n\ntype Block = {\n  alive: boolean\n  move:(pos:Pos)=>Promise<Block>\n  del:(pos:Pos)=>Promise<void>\n  put:(pos:Pos, color:Color, energy?:number) => Promise<Block>\n\n  energy: number\n  pos: Pos\n  id: number\n  color: Color\n}\ntype Pos = [number, number]\n\ntype State = {\n  world: {\n    pixels: (null | Block)[][];\n    subscribe: (fn: (focus: Pos | undefined) => void) => () => void;\n    getPixel: (pos: Pos) => Block | null;\n  };\n  keyboard: {\n    isPressed: (key: string) => boolean;\n    subscribe: (fn: (key: string) => void) => () => void;\n  };\n};\n\n\ntype UserAction = {\n  type:\"Move\" | \"Delete\"\n  pos: Pos\n} | {\n  type:\"Put\"\n  pos: Pos\n  color: Color\n  energy: number\n}\n\n\n\nfunction main(state:State, player:Block){\n\n  state.keyboard.subscribe(e=>{\n    console.log(e)\n    let x = 0\n    let y = 0\n    if (e==\"ArrowUp\") y -= 1\n    if (e==\"ArrowDown\") y += 1\n    if (e==\"ArrowLeft\") x -= 1\n    if (e==\"ArrowRight\") x += 1\n\n    target = [player.pos[0] + x, player.pos[1] + y]\n\n    player.move(target)\n    \n\n  })\n\n}\n\n\n\n\n\n"



export const userScriptTS = new Writable("UserScriptTS", defaultScript);

// userScriptTS.set(defaultScript)
export const userScript = new Writable("UserScript", "");

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
  
  
  
  window.document.addEventListener("keydown", (e) => {
    if(e.key == "s" && e.metaKey){
      e.preventDefault()
      build()
  
      window.location.pathname = window.location.pathname.split("/").filter(s=>s!="editor").join("/") + (new Writable("servermode","").value == "local" ? "local" : "")
    }
  
  })

  function build(){
    const code = editor.getValue();
    userScriptTS.set(code);
    const jscode = ts.transpile(code)
    userScript.set(jscode);
  }

  // Add change listener to compile code
  editor.onDidChangeModelContent(build);
});
