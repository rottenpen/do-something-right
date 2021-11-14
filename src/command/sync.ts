import * as vscode from 'vscode';
import axios from 'axios';
import * as fs from 'fs';
import { authentication } from 'vscode';
import { getWorkspaceConfiguration, getWorkspaceFolder } from '../shared/config';
const http = axios.create({
  baseURL: 'https://api.github.com/',
  timeout: 10000,
});
const owner = 'Zheaoli';
const repo = 'do-something-right';

const getLanguage = () => {
  const config = vscode.workspace.getConfiguration('leetcode');
  return config.get('defaultLanguage') || 'javascript';
};

export const sync = async (url: vscode.Uri) => {
  try {
    let wechatId = getWorkspaceFolder();
    if (!wechatId) {
      wechatId = await vscode.window.showInputBox({
        placeHolder: '请输入你的微信昵称(选填)',
      });
    }

    await getWorkspaceConfiguration().update('wechatId', wechatId, true);

    console.log(wechatId, getWorkspaceFolder());
    const account = await authentication.getSession('github', ['user:email', 'repo', 'write:discussion'], {
      createIfNone: true,
    });
    console.log(account);
    const issueList = await http.get(`/repos/${owner}/${repo}/issues`);
    const list = issueList.data.filter((ele: { pull_request: any }) => !ele.pull_request);
    console.log(list);
    if (!list.length) {
      vscode.window.showErrorMessage('发生了一点错误～');
      return;
    }

    let number = list[0].number;
    let code = fs.readFileSync(url.path).toString();
    // /repos/{owner}/{repo}/issues/{issue_number}/comments
    const createComment = await http.post(
      `/repos/${owner}/${repo}/issues/${number}/comments`,
      {
        body: `\`\`\`${getLanguage()}
${code}
\`\`\`
* * *
${wechatId ? '> 微信id: ' + wechatId : ''}
> 来自 vscode 插件`,
      },
      {
        headers: {
          Authorization: `token ${account.accessToken}`,
        },
      },
    );

    return createComment;
  } catch (error) {
    throw error;
  }
};
