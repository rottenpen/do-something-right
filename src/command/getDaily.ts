import axios from 'axios';
import * as vscode from 'vscode';

const http = axios.create({
  baseURL: 'https://leetcode-cn.com/graphql/',
  timeout: 10000,
});
/**
 * 获得今天的每日一题题号
 */
export default async () => {
  try {
    let { data } = await http.post('', {
      query:
        '\n    query questionOfToday {\n  todayRecord {\n    date\n    userStatus\n    question {\n      questionId\n      frontendQuestionId: questionFrontendId\n      difficulty\n      title\n      titleCn: translatedTitle\n      titleSlug\n      paidOnly: isPaidOnly\n      freqBar\n      isFavor\n      acRate\n      status\n      solutionNum\n      hasVideoSolution\n      topicTags {\n        name\n        nameTranslated: translatedName\n        id\n      }\n      extra {\n        topCompanyTags {\n          imgUrl\n          slug\n          numSubscribed\n        }\n      }\n    }\n    lastSubmission {\n      id\n    }\n  }\n}\n    ',
      variables: {},
      operationName: 'questionOfToday',
    });
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
