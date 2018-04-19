'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { showPullRequestCommand } from './commands/showPullRequestCommand';
import { createPullRequestCommand } from './commands/createPullRequestCommand';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.openPullRequest', showPullRequestCommand));
    context.subscriptions.push(vscode.commands.registerCommand('extension.createPullRequest', createPullRequestCommand));
}

// this method is called when your extension is deactivated
export function deactivate() {
}