import * as core from "@actions/core";
import { setFailed } from "./core";
import { Jira } from "./jira";
import { isNoEmptyArray, isNotEmptyString } from "./utils";

export class Action {

    private appName: string = '';
	private relationship: string = '';
    private token: string = '';
    private url: string = '';
    private email: string = '';
    private issues: string[] = [];
    private title: string = '';
	private message: string = '';
	private linkUrl: string = '';
	private jira: Jira = null as any;

    constructor() {
        this.initializeParams();
		this.validateParams();
		this.jira = new Jira(this.token, this.email, this.url, this.relationship, this.appName);
    }

	private initializeParams() {
		this.appName = core.getInput('app-name');
		this.relationship = core.getInput('relationship');
		this.token = core.getInput('jira-api-token');
		this.email = core.getInput('jira-email');
		this.url = core.getInput('jira-base-url');
		this.title = core.getInput('title');
		this.message = core.getInput('message');
		this.linkUrl = core.getInput('link-url');

		const issues = core.getInput('issues');
		this.issues = isNotEmptyString(issues) ? issues.split(',') : [];
	}

	private validateParams() {
		if (!isNoEmptyArray(this.issues)) {
			setFailed('Issues is required!');
		}
	}

	async execute() {

		let addedLinks = 0;

		await this.promiseByBatch( this.issues, async issue => {
			const result = await this.jira.addRemoteLink(issue, this.title, this.message, this.linkUrl);
			if (result) {
				addedLinks++;
			}
		} );

		core.setOutput('added-links', addedLinks);
	}

	private async promiseByBatch( array: any[], handler: (item: any) => Promise<any>, size = 20, results: any[] = [] ): Promise<any[]> {
		if (!isNoEmptyArray(array) || size === 0) {
			return results;
		}
		const todo = array.splice(0, size);
		const promises = todo.map(handler);
		const batchResults = await Promise.all(promises);
		results = results.concat(batchResults);
		return this.promiseByBatch(array, handler, size, results);
	}

}
