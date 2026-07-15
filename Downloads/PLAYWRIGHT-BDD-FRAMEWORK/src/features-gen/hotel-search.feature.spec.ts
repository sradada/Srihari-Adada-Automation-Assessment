// Generated from: src\features\hotel-search.feature
import { test } from "playwright-bdd";

test.describe('Hotel Search', () => {

  test('List all hotels in Mumbai for the current date', async ({ Given, When, Then, And, page }) => { 
    await Given('User launches the hotel booking application', null, { page }); 
    await When('User searches hotels in "Mumbai"', null, { page }); 
    await And('User clicks on Search', null, { page }); 
    await Then('All available hotel names should be displayed in the console', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('src\\features\\hotel-search.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"Given User launches the hotel booking application","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When User searches hotels in \"Mumbai\"","stepMatchArguments":[{"group":{"start":24,"value":"\"Mumbai\"","children":[{"start":25,"value":"Mumbai","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And User clicks on Search","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then All available hotel names should be displayed in the console","stepMatchArguments":[]}]},
]; // bdd-data-end