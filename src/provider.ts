

import * as vscode from 'vscode';
import { getHtmlForWebview } from './utils';
// import { test } from './handler';
import axios from 'axios';
export interface Message {
  type: string;
  payload?: Record<string, any>;
}

export class SidebarProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;

  constructor(protected context: vscode.ExtensionContext) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.context.extensionUri],
    };

    webviewView.webview.html = getHtmlForWebview(
      this.context,
      webviewView,
      'sidebar'
    );

    webviewView.webview.onDidReceiveMessage(async (message: Message) => {
      let msg = '';

      switch (message.type) {
        case 'ai': {
          msg = '给我推荐一本书';
          break;
        }
      }

      webviewView.webview.postMessage({
        type: message.type,
        payload: {
          message: msg,
        },
      });
    });
  }

  public codeExplainByAI(){
    // vscode.window.activeTextEditor获取当前活动的文本编辑器
    const editor = vscode.window.activeTextEditor;
		if(editor){
			// selection属性来获得选中的文本范围
			const selection = editor.selection;
			// 获得选中部分的数据
			const selctCode = editor.document.getText(selection);
			console.debug('select code',selctCode)
      if(this._view) {
          this._view?.webview.postMessage({ 
          type: 'ai-explain',
          code: {
            message: selctCode,
          },
      })
		  } 
		} else {
			vscode.window.showInformationMessage('no active editor');
		}
      
  }
}
