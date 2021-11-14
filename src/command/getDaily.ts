import * as vscode from 'vscode';
import { getDailyFromLeetcode } from '../service';

/**
 * 获得今天的每日一题题号
 */
export default async () => {
  try {
    let data = await getDailyFromLeetcode();
    vscode.window
      .showInformationMessage(
        `今天每日一题是：${data.data.todayRecord[0].question.frontendQuestionId} ${data.data.todayRecord[0].question.titleCn}`,
        '打开题目吧',
      )
      .then(_ele => {
        vscode.commands.executeCommand('leetcode.searchProblem');
      });
  } catch (error) {
    if ((error as any).message) {
      vscode.window.showErrorMessage((error as any).message);
    } else {
      vscode.window.showErrorMessage(String(error));
    }
  }
};
