import * as vscode from 'vscode';
import { SidebarProvider } from './provider';
/**
 * 入口-> 注册webview
 */
export function activate(context: vscode.ExtensionContext) {
  const sidebarPanel = new SidebarProvider(context);

  context.subscriptions.push(vscode.window.registerWebviewViewProvider('vs-sidebar-view', sidebarPanel));
  context.subscriptions.push(vscode.commands.registerCommand('ai.selectCode', () => { sidebarPanel.codeExplainByAI()}));
}

// this method is called when your extension is deactivated
export function deactivate() {}
