import { QuickPickItem, workspace, WorkspaceConfiguration } from "vscode";
export function getWorkspaceConfiguration(): WorkspaceConfiguration {
  return workspace.getConfiguration("do-something-right");
}

export function getWorkspaceFolder(): string | undefined{
  return getWorkspaceConfiguration().get<string>("wechatId");
}
