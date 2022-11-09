const vscode = require('vscode');
let editor;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations,"console-log" is now active!');

    let consoleLog = vscode.commands.registerCommand('extension.clog', function () {
        doLog(false);
    });

    let consoleLogBefore = vscode.commands.registerCommand('extension.clogBefore', function () {
        doLog(true);
    });

    function doLog(before) {
        editor = vscode.window.activeTextEditor;
        let lang = editor.document.languageId;
        let supportedLangs = [
            'javascript',
            'typescript',
            'javascriptreact',
            'typescriptreact',
            'vue'
        ]
        if (supportedLangs.includes(lang)) {
            let selection = editor.selection;
            let line = editor.document.lineAt(selection.active.line);
            let text = editor.document.getText(selection);
            let dest = selection.active;
            dest = dest.translate(0, -dest.character);

            let startSpace = ' '.repeat(line.firstNonWhitespaceCharacterIndex);
            const wrapChar = text.match(/\r\n|\r|\n/g) ? "`" : "'"
            let textEsc = '';
            if (typeof text === 'string') {
                textEsc = wrapChar + text.replace(/\'/g, "\\'") + " :" + wrapChar;
            } else {
                textEsc = JSON.stringify(text) + ':';
            }
            const { wrapperExpression, 
                invertPosition } = vscode.workspace.getConfiguration('consoleLog');
            const consoleValue = wrapperExpression ? wrapperExpression.replace('$', text) : text;
            let log = startSpace + `console.log(${textEsc}, ${consoleValue});`;

            if(invertPosition){
                before = !before;
            }

            if (before) {
                log += '\n'
            } else {
                dest = dest.translate(0, line.text.length);
                log = '\n' + log;
            }
            editor.edit(editBuilder => {
                editBuilder.insert(dest, log);
            });
        } else if (lang == "dart"){
            let selection = editor.selection;
            let line = editor.document.lineAt(selection.active.line);
            let text = editor.document.getText(selection);
            let dest = selection.active;
            dest = dest.translate(0, -dest.character);

            let startSpace = ' '.repeat(line.firstNonWhitespaceCharacterIndex);
            let textEsc = '';
            if (typeof text === 'string') {
                textEsc = text.replace(/\'/g, "\\'") + " :" ;
            } else {
                textEsc = JSON.stringify(text) + ':';
            }
            const { wrapperExpression, 
                invertPosition } = vscode.workspace.getConfiguration('consoleLog');
            const consoleValue = wrapperExpression ? wrapperExpression.replace('$', text) : text;
            let log = startSpace + `debugPrint("${textEsc} \${${consoleValue}}", wrapWidth: 1024);`;

            if(invertPosition){
                before = !before;
            }

            if (before) {
                log += '\n'
            } else {
                dest = dest.translate(0, line.text.length);
                log = '\n' + log;
            }
            editor.edit(editBuilder => {
                editBuilder.insert(dest, log);
            });

        } else if (lang == "go"){
            let selection = editor.selection;
            let line = editor.document.lineAt(selection.active.line);
            let text = editor.document.getText(selection);
            let dest = selection.active;
            dest = dest.translate(0, -dest.character);

            let startSpace = '\t'.repeat(line.firstNonWhitespaceCharacterIndex);
            const wrapChar = "\""
            // const wrapChar = text.match(/\r\n|\r|\n/g) ? "`" : "\""
            let textEsc = '';
            if (typeof text === 'string') {
                textEsc = text.replace(/\"/g, '\\"')
                textEsc = textEsc.replace(/\'/g, "\\'")
                textEsc = wrapChar + textEsc + ": %#v"  + "\\n" + wrapChar;
            } else { 
                textEsc = JSON.stringify(text) + ':';
            }
            const { wrapperExpression, 
                invertPosition } = vscode.workspace.getConfiguration('consoleLog');
            const consoleValue = wrapperExpression ? wrapperExpression.replace('$', text) : text;
            let log = startSpace + `fmt.Printf(${textEsc}, ${consoleValue})`;

            if(invertPosition){
                before = !before;
            }

            if (before) {
                log += '\n'
            } else {
                dest = dest.translate(0, line.text.length);
                log = '\n' + log;
            }
            editor.edit(editBuilder => {
                editBuilder.insert(dest, log);
            });
        }
    }

    context.subscriptions.push(consoleLog);
    context.subscriptions.push(consoleLogBefore);

}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
