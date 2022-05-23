# link-to-jira-issues
Github action for link to jira issues

## **Inputs**
## `jira-api-token`

***Required*** You must create a Jira API Token for use this action:
[You can access to this link after be logged into jira solution for manage your tokens.](https://id.atlassian.com/manage-profile/security/api-tokens)

## `jira-email`

***Required*** You need to set the same email that you used for create the Jira API token before.

## `jira-base-url`

***Required*** You must to set the Jira url. Example: https://myserver.atlassian.net

## `issues`

***Required*** You must specify the issues that will be moved. It can be separated by ",". Example: `OM-123,OM-456,OM-789`

## `title`

***Optional*** Title for remote link in Jira, Default value is: 'Github actions'.

## `message`

***Optional*** Message for remote link in Jira, Default value is: 'Date: `<current-date>`'.

## `app-name`

***Optional*** App name for remote link in Jira, Default value is: 'Github'.

## `link-url`

***Optional*** Link URL for remote link in Jira, Default value is: 'https://github.com/repo/path/actions/runs/2313923243'.

## `relationship`

***Optional*** Relationship for remote link in Jira, Default value is: 'deploy'.

## **Outputs**

## `added-links`

Total of added links.

## Example usage

```
- name: Link jira issues
  if: steps.my_example_step.outputs.jira-keys != ''
  uses: pineapple-lab/link-to-jira-issues@v1.1
  with:
    jira-api-token: "${{secrets.JIRA_API_TOKEN}}"
    jira-email: "${{secrets.JIRA_USER_EMAIL}}"
    jira-base-url: 'https://example.atlassian.net'
    issues: ${{steps.my_example_step.outputs.jira-keys}}
    title: 'Deployed to develop'
```

## Result

![alt text](https://raw.githubusercontent.com/pineapple-lab/link-to-jira-issues/main/src/assets/example-integration.png)
