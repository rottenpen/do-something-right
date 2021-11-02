import * as vscode from "vscode";
import axios from "axios";
import * as fs from "fs";
import { authentication } from "vscode";
const http = axios.create({ baseURL: "https://api.github.com/" });
const owner = "Zheaoli";
const repo = "do-something-right";
export const sync = async (url: vscode.Uri) => {
  const account = await authentication.getSession(
    "github",
    ["user:email", "repo", "write:discussion"],
    {
      createIfNone: true,
    }
  );
  const issueList = await http.get(`/repos/${owner}/${repo}/issues`);
  const list = issueList.data.filter(
    (ele: { pull_request: any }) => !ele.pull_request
  );
  if (!list.length) {
    vscode.window.showErrorMessage("发生了一点错误～");
    return;
  }

  let number = list[0].number;
  let code = fs.readFileSync(url.path).toString();
  // /repos/{owner}/{repo}/issues/{issue_number}/comments
  const createComment = await http.post(
    `/repos/${owner}/${repo}/issues/${number}/comments`,
    {
      body: `\`\`\`javascript
${code}
\`\`\`
* * *
>来自 vscode 插件`,
    },
    {
      headers: {
        Authorization: `token ${account.accessToken}`,
      },
    }
  );

  return createComment;
};
