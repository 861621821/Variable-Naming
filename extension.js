// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const Translater = require('./utils/translater.js');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let translateEnabled = false;
    // 点击翻译按钮
    const translater = vscode.commands.registerCommand('VN.translate', async () => {
        if (translateEnabled) {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const selectedText = editor.document.getText(editor.selection);
                const translater = new Translater();
                translater.translate(selectedText);
            }
        } else {
            vscode.window.showInformationMessage('请先选择要翻译的文本！');
        }
    });

    // 监听编辑器选择更改事件
    vscode.window.onDidChangeTextEditorSelection(() => {
        // 检查选择的文本范围
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            if (!selection.isEmpty) {
                translateEnabled = true;
            } else {
                translateEnabled = false;
            }
            vscode.commands.executeCommand('setContext', 'translateEnabled', translateEnabled);
        }
    });

    context.subscriptions.push(translater);
}

// This method is called when your extension is deactivated
function deactivate() {
    console.log('Your extension "variable-naming" is now deactive!');
}

module.exports = {
    activate,
    deactivate,
};
