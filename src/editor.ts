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



const defaultScript = "function main(state, player) {\n    state.keyboard.subscribe(function (e) {\n        console.log(e);\n        var x = 0;\n        var y = 0;\n        if (e == \"ArrowUp\")\n            y -= 1;\n        if (e == \"ArrowDown\")\n            y += 1;\n        if (e == \"ArrowLeft\")\n            x -= 1;\n        if (e == \"ArrowRight\")\n            x += 1;\n        target = [player.pos[0] + x, player.pos[1] + y];\n        yield player.move(target);\n    });\n}\n"



export const userScriptTS = new Writable("UserScriptTS", defaultScript);

// userScriptTS.set(defaultScript)
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
