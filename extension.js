const vscode = require('vscode');
let editor;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations,"console-log" is now active!');

  let consoleLog = vscode.commands.registerCommand('extension.clog', function(){
    editor = vscode.window.activeTextEditor;
    let lang = editor.document.languageId;
    if(lang == 'javascript'){
      let selection = editor.selection; 
      let line = editor.document.lineAt(selection.active.line);
      let text = editor.document.getText(selection);
      let dest = selection.active;
      dest = dest.translate(0, -dest.character);
      let startSpace = ' '.repeat(line.firstNonWhitespaceCharacterIndex);
      let log = startSpace + `console.log('${text}:', ${text});\n`;
      editor.edit(editBuilder => {
        editBuilder.insert(dest, log);
      });
    }
  });

  context.subscriptions.push(consoleLog);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
