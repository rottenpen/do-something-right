import * as vscode from 'vscode';
import { codeLensController } from './codelen/CodeLensController';
import { sync } from './command/sync';
import getDaily from './command/getDaily';
let pending = false;
export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('do-something-right.sync', async rest => {
    if (pending) {
      vscode.window.showWarningMessage('正在同步...');
      return;
    }
    pending = true;
    try {
      await sync(rest);
      vscode.window.showInformationMessage('你已成功为公益事业 +1s!');
    } catch (error) {
      vscode.window.showErrorMessage((error as any).message);
    }
    pending = false;
  });
  let dailyCommand = vscode.commands.registerCommand('do-something-right.getDaily', getDaily);
  context.subscriptions.push(disposable, codeLensController, dailyCommand);
}

export function deactivate() {}
