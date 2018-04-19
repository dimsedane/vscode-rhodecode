# RhodeCode Helpers README

RhodeCode Helpers is a utility extension for working with code repositories in RhodeCode.

## Features

Pullrequests is RhodeCode can be cumbersome, so this extension provides two helper commands:

### Create Pullrequest

Creates a new pull request on the configured repository. You must enter the branch names of the source and target branches as well as a name for the pull request. A name is provided by default, but can be changed.

### Show PullRequests

Show all open pull reqeuests from the configured repository. Selecting a request will open it it the browser. When returning to code you have the option to merge the pullrequest. Doing so will automatically aprove and merge the request.

## Extension Settings

There are 3 required cofigurations. First time use of either command will allow you to update the configuration if it is missing. Configuration is saved in the global configuration, except the `repoid`, which will be saved in the worksapace configuration.

This extension contributes the following settings:

* `rhodecode.apikey`: An AuthKey from RhodeCode.
* `rhodecode.serverurl`: The baseurl of your RhodeCode server.
* `rhodecode.repoid`: The name of your remote repository. This should be configuered in the workspace configuration.

## Known Issues

Using the commands in a workspace without a configuration file may fail when loading the repoid configuration.

## Release Notes

### 0.0.1

Initial release to gain feedback