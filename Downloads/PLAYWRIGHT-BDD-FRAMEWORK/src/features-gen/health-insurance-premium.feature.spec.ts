// Generated from: src\features\health-insurance-premium.feature
import { test } from "playwright-bdd";

test.describe('Health Insurance Premium Calculation', () => {

  test('Verify premium calculation', async ({ Given, When, Then, And, page }) => { 
    await Given('User launches the Ditto Insurance application', null, { page }); 
    await When('User selects the "Optima Secure" health insurance', null, { page }); 
    await And('User proceeds to the Tell Us About You page', null, { page }); 
    await And('User fills the personal details', null, { page }); 
    await And('User calculates the premium', null, { page }); 
    await Then('Total premium should be equal to Base Premium + Riders + GST', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('src\\features\\health-insurance-premium.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"Given User launches the Ditto Insurance application","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When User selects the \"Optima Secure\" health insurance","stepMatchArguments":[{"group":{"start":17,"value":"\"Optima Secure\"","children":[{"start":18,"value":"Optima Secure","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And User proceeds to the Tell Us About You page","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And User fills the personal details","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"And User calculates the premium","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then Total premium should be equal to Base Premium + Riders + GST","stepMatchArguments":[]}]},
]; // bdd-data-end