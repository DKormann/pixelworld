// Initialize monaco editor
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

// Create a model with TypeScript language
const model = monaco.editor.createModel(
    'console.log("Hello TypeScript!");\nconst message: string = "Hello, World!";\nconsole.log(message);',
    'typescript'
);

// Create the editor
const editor = monaco.editor.create(document.getElementById('editor')!, {
    model,
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
    formatOnType: true
});

// Add TypeScript language support
monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false
});

// Add TypeScript compiler options
monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    strict: true,
    jsx: monaco.languages.typescript.JsxEmit.React
});
