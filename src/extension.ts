import * as vscode from "vscode";
import { codeLensController } from "./codelen/CodeLensController";
import { sync } from "./command/sync";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "do-some-right.sync",
    async (rest) => {
			await sync(rest);
      vscode.window.showInformationMessage("你已成功 +1s!");
    }
  );

  context.subscriptions.push(disposable, codeLensController);
}

export function deactivate() {}
