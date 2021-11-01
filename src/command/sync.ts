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
  if (!issueList.data.length) {
    return;
  }
  let number = issueList.data[0].number;
  let code = fs.readFileSync(url.path).toString();
  // /repos/{owner}/{repo}/issues/{issue_number}/comments
  const createComment = await http
    .post(
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
    )
    .catch((err) => {
      console.log(err);
    });
  return createComment;
};
