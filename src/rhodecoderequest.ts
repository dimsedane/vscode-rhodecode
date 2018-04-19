import { window } from 'vscode';
import * as config from './configuration';
import axios from 'axios';


async function postRequest<T>(method: string, args: {}) {
    var serverUrl = await config.getApiUrl();
    var apiKey = await config.getApiKey();

    var response = await axios.post<RhodeCodeResponse<T>>(`${serverUrl}/_admin/api`, {
        "id":"1",
        "api_key": apiKey,
        "method": method,
        "args": args
    });

    if(response.status !== 200) {
        window.showErrorMessage('Something went wrong while communicating with RhodeCode');
    }

    return response.data;
}

export async function getPullRequests() {
    var repoId = await config.getRepoId();

    return await postRequest<RhodeCodePullRequests[]>("get_pull_requests", {
        "repoid": repoId
    });
}

export async function aprovePullRequest(id: string) {
    var repoId = await config.getRepoId();

    return await postRequest("comment_pull_request", {
        "repoid": repoId,
        "pullrequestid": id,
        "status": "approved",
        "message": "Approved from Visual Studio Code"
    });
}

export async function mergePullRequest(id: string) {
    var repoId = await config.getRepoId();

    return await postRequest("merge_pull_request", {
        "repoid": repoId,
        "pullrequestid": id
    });
}

export async function getRepoRefs() {
    var repoId = await config.getRepoId();

    return await postRequest<RepoRefs>('get_repo_refs', {
        repoid: repoId
    });
}

export async function createPullRequest(sourceRef: string, targetRef: string, name: string) {
    var repoId = await config.getRepoId();

    return await postRequest('create_pull_request', {
        source_repo: repoId,
        target_repo: repoId,
        source_ref: 'branch:' + sourceRef,
        target_ref: 'branch:' + targetRef,
        title: name
    });
}

interface RhodeCodeResponse<T> {
    id: any;
    result: T | null;
    error: any | null;
}

interface RepoRefs {
    bookmarks:  {};
    branches: { [key: string]: string };
    branches_closed: {};
    tags: {};
}

interface Mergeable {
    status: string;
    message: string;
}

interface Reference {
    name: string;
    type: string;
    commit_id: string;
}

interface Source {
    clone_url: string;
    reference: Reference;
}

interface Reference2 {
    name: string;
    type: string;
    commit_id: string;
}

interface Target {
    clone_url: string;
    reference: Reference2;
}

interface Reference3 {
    name: string;
    type: string;
    commit_id: string;
}

interface Merge {
    clone_url: string;
    reference: Reference3;
}

interface Author {
}

export interface Reviewer {
    user: string;
    review_status: string;
}

export interface RhodeCodePullRequests {
    pull_request_id: string;
    url: string;
    title: string;
    description: string;
    status: string;
    created_on: string;
    updated_on: string;
    commit_ids: string[];
    review_status: string;
    mergeable: Mergeable;
    source: Source;
    target: Target;
    merge: Merge;
    author: Author;
    reviewers: Reviewer[];
}
