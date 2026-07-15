Feature: Health Insurance Premium Calculation

Scenario: Verify premium calculation

Given User launches the Ditto Insurance application
When User selects the "Optima Secure" health insurance
#And User selects the "HDFC ERGO Optima Secure" plan
And User proceeds to the Tell Us About You page
And User fills the personal details
And User calculates the premium
Then Total premium should be equal to Base Premium + Riders + GST