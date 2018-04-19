import * as vscode from 'vscode';
import { ProgressLocation } from 'vscode';
import * as rhodecode from '../rhodecoderequest';

export async function createPullRequestCommand() {
    /* Unfortunately, the following code requires an update of my RhodeCode to function
    var reposPromise = rhodecode.getRepoRefs().then(refs => {
        if(refs.error !== null) {
            vscode.window.showErrorMessage("Could not load remote branches: " + refs.error);
            throw new Error(refs.error);
        }

        if(refs.result === null) {
            return [];
        }

        return Object.keys(refs.result.branches);
    });


    var sourceBranch = await vscode.window.showQuickPick(reposPromise, {
        placeHolder: 'Source branch'
    });
    if(sourceBranch === undefined) {
        return;
    }
    var targetBranch = await vscode.window.showQuickPick(reposPromise, {
        placeHolder: 'Target branch'
    });

    if(targetBranch === undefined) {
        return;
    }

    */
    var sourceBranch = await vscode.window.showInputBox({
        placeHolder: 'Source branch name',
        prompt: "Please enter the branchname of the source branch"
    });

    if(sourceBranch === undefined) {
        return;
    }
    
    var targetBranch = await vscode.window.showInputBox({
        placeHolder: 'Target branch name',
        prompt: "Please enter the branchname of the target branch",
        value: 'master'
        });

    if(targetBranch === undefined) {
        return;
    }

    var name = await vscode.window.showInputBox({
        placeHolder: 'Pullrequest name',
        prompt: "Please enter a name for your pullrequest",
        value: 'From ' + sourceBranch + " to " + targetBranch
    });

    if(name === undefined) {
        return;
    }

    var result = await vscode.window.withProgress({
        location: ProgressLocation.Notification,
        title: "Creating Pullrequest"
    }, async progress => {
        if(sourceBranch === undefined || targetBranch === undefined || name === undefined) {
            return;
        }

        return await rhodecode.createPullRequest(sourceBranch, targetBranch, name);
    });

    if(result !== undefined && result.error === null) {
        vscode.window.showInformationMessage("Created pullrequst");
    } else {
        if(result !== undefined) {
            vscode.window.showErrorMessage("Could not create pullrequest: " + result.error);
        } else {
            vscode.window.showErrorMessage("Could not create pullrequest");
        }
    }
}