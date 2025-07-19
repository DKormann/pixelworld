import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import 'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution';

// Wait for monaco to be fully loaded
window.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
        return './vs/base/worker/workerMain.js';
    }
};

// Compile TypeScript to JavaScript using Monaco's worker API
async function compileTypeScript(code: string): Promise<string> {
    // Get the TypeScript worker
    const workerService = await monaco.languages.typescript.getTypeScriptWorker();
    const worker = await workerService();

    // Get the emit output
    const emitOutput = await worker.getEmitOutput(code);
    if (emitOutput.emitSkipped) {
        throw new Error('TypeScript compilation failed');
    }
    return emitOutput.outputFiles[0].text;
}

// Wait for DOM to be ready
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
        formatOnType: true
    });

    // Set initial value
    editor.setValue('console.log("Hello TypeScript!");\nconst message: string = "Hello, World!";\nconsole.log(message);');

    // Add change listener to compile code
    editor.onDidChangeModelContent(async () => {
        const code = editor.getValue();
        console.log('Code changed:', code);

        try {
            const result = await compileTypeScript(code);
            console.log('Compiled JavaScript:', result);
        } catch (error) {
            console.error('Compilation error:', error);
        }
    });
});
