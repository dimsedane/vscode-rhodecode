import * as vscode from 'vscode';

const CONFIGURATION_SECTION = 'rhodecode';

export async function getApiKey() {
    var configuration = vscode.workspace.getConfiguration(CONFIGURATION_SECTION);

    // Ensure API key is available
    var apiKey = configuration.get<string>("apikey");
    if(apiKey === "") {
        apiKey = await vscode.window.showInputBox({
            placeHolder: "Auth Token",
            prompt: "Please enter your RhodeCode authtoken"
        });

        if(apiKey !== undefined) {
            await configuration.update("apikey", apiKey, vscode.ConfigurationTarget.Global);
        }
    }

    return apiKey;
}

const SERVERURL_KEY = "serverurl"; 
export async function getApiUrl() {
    var configuration = vscode.workspace.getConfiguration(CONFIGURATION_SECTION);

    var serverUrl = configuration.get<string>(SERVERURL_KEY);
    if(serverUrl === "") {
        serverUrl = await vscode.window.showInputBox({
            placeHolder: "Server Url",
            prompt: "Please enter your RhodeCode server URL"
        });

        if(serverUrl !== undefined) {
            await configuration.update(SERVERURL_KEY, serverUrl, vscode.ConfigurationTarget.Global);
        }
    }

    // Ensure url is with protocol and ends without slash
    if(serverUrl !== undefined) {
        if(!serverUrl.startsWith("http")) {
            serverUrl = "https://" + serverUrl;
        }

        if(serverUrl.endsWith("/")) {
            serverUrl = serverUrl.substr(0, serverUrl.length - 1);
        }
    }

    return serverUrl;
}

const REPOID_KEY = "repoid";
export async function getRepoId() {
    var configuration = vscode.workspace.getConfiguration(CONFIGURATION_SECTION);

    var repoId = configuration.get<string>(REPOID_KEY);
    if(repoId === "") {
        repoId = await vscode.window.showInputBox({
            placeHolder: "Repository Identifier",
            prompt: "Please enter the repository identifier. This will be saved in your workspace configuration"
        });

        if(repoId) {
            await configuration.update(REPOID_KEY, repoId, vscode.ConfigurationTarget.Workspace);
        }
    }

    return repoId;
}