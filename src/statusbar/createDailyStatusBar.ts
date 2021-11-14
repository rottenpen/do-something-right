import * as vscode from 'vscode';
import { getDailyFromLeetcode } from '../service';
export default async () => {
  const statusBarItem = vscode.window.createStatusBarItem();
  let data = await getDailyFromLeetcode();
  statusBarItem.text = `lc每日公益🚀${data.data.todayRecord[0].question.frontendQuestionId}: ${data.data.todayRecord[0].question.titleCn}`;
  statusBarItem.command = 'leetcode.searchProblem';
  statusBarItem.show();
  return statusBarItem;
};
