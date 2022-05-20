import { setFailed, context } from "./core";
import { isNotEmptyString, isValidNumber } from "./utils";
import axios from "axios";

export class Jira {

	constructor(private token: string, private email: string, private url: string, private relationship: string = '', private appName: string = '') {
		this.validateParams();
	}

	validateParams() {
		if (!isNotEmptyString(this.token)) {
			setFailed('Jira api token is required!');
		}
		if (!isNotEmptyString(this.url)) {
			setFailed('Jira base url is required!');
		}
		if (!isNotEmptyString(this.email)) {
			setFailed('Jira email is required!');
		}
	}

	async addRemoteLink( issue: string, title = '', message: string = '', link: string = null as any) {
		const icon = context?.payload?.sender?.avatar_url || `https://raw.githubusercontent.com/pineapple-lab/jira-issue-transitions/main/src/assets/github.png`;
		const path = `${this.url}/rest/api/2/issue/${issue}/remotelink`;
		const config = { auth: { username: this.email, password: this.token } };
		const body = {
			"application": { "name": this.appName || 'Github', "type": "com.github.actions#jira-issue-transitions" },
			"globalId": context.runId + '', "relationship": this.relationship || "deploy", "object": {
				"summary": message ? message : `Date: ${ new Date().toUTCString() }`,
				"icon": { "url16x16": icon, "title": "Github" }, "title": title || 'Github actions',
				"url": link || `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${context.runId}`
			}
		};
		const result: any = await axios.post(path, body, config).catch(e => ({ error: true }));
		return result?.error !== true;
	}

}
