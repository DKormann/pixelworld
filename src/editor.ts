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

import { defaultScript } from './userspace';

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
