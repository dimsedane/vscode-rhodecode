import * as rhodecode from '../rhodecoderequest';
import * as vscode from 'vscode';

export async function showPullRequestCommand() {
    var pullRequestPromise = rhodecode.getPullRequests().then(response => {
        if(response.result !== null) {
            return response.result.map<PullRequestQuickPickItem>(request => {
                return {
                    id: request.pull_request_id,
                    label: "#" + request.pull_request_id + " " + request.title,
                    url: request.url,
                    detail: request.status + " - " + request.review_status,
                    status: request.review_status
                };
            });
        } else {
            if(response.error !== null) {
                vscode.window.showErrorMessage(response.error);
            } else {
                vscode.window.showErrorMessage("Could not load pullrequests");
            }
            throw new Error("Could not load pull requests");
        }
    });

    vscode.window.showQuickPick<PullRequestQuickPickItem>(pullRequestPromise).then(item => {
        if(item !== undefined) {
            vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(item.url));

            vscode.window.showQuickPick(["Yes", "No"], {
                ignoreFocusOut: true,
                placeHolder: "Merge pullrequest?"
            }).then(answer => {
                if(answer === "Yes") {
                    vscode.window.withProgress({
                        title: "Merging pullrequest",
                        location: vscode.ProgressLocation.Notification
                    }, async progress => {
                        // Merging pull requests in RhodeCode is a two step business. 
                        // First it must be approved, then it can be merged
                        try{
                            if(item.status === 'approved') {
                                progress.report({
                                    message: "Pullrequest already approved, starting merge"
                                });
                            } else {
                                progress.report({
                                    message: "Aproving pullrequest"
                                });

                                await rhodecode.aprovePullRequest(item.id);
                            }
                        } catch(err) {
                            vscode.window.showErrorMessage("We could not aprove the pull request");
                            return;
                        }

                        try {
                            progress.report({
                                message: "Pullrequest approved, starting merging"
                            });

                            await rhodecode.mergePullRequest(item.id);

                            vscode.window.showInformationMessage("Successfully merged the pull request");
                        } catch(err) {
                            vscode.window.showErrorMessage("We could not merge the pullrequest");
                        }
                    });
                }
            });
        }
    });
}

interface PullRequestQuickPickItem extends vscode.QuickPickItem {
    url: string;
    status: string;
    id: string;
}