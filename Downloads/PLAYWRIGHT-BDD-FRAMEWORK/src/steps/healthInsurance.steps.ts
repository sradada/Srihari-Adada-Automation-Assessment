import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { DittoPage } from "../pages/DittoPage";
import { logStep, logValidation } from "../utils/logger";

const { Given, When, Then } = createBdd();

// BDD flow overview:
// 1. Open the Ditto app.
// 2. Select the health plan and progress through the onboarding screens.
// 3. Fill personal details, choose the cover amount, and optionally select add-ons.
// 4. Calculate premium and validate the summary using:
//    Total = Base Premium + Rider Premium + GST

Given("User launches the Ditto Insurance application", async ({ page }) => {
    logStep("Launching the Ditto Insurance application");

    const dittoPage = new DittoPage(page);

    await dittoPage.navigate("https://app.joinditto.in/fq");

});

When("User selects the {string} health insurance", async ({ page }, healthType: string) => {
    logStep(`Selecting health insurance option: ${healthType}`);

    const dittoPage = new DittoPage(page);

    await dittoPage.selectHealthInsurance(healthType);

});

When("User proceeds to the Tell Us About You page", async ({ page }) => {
    logStep("Moving through the onboarding steps to the personal details page");

    const dittoPage = new DittoPage(page);

    await dittoPage.clickNext();
    await dittoPage.openFullList();
    await dittoPage.closeFullList();
    await page.waitForTimeout(2000);
    await dittoPage.clickNext();
     await dittoPage.clickNext();

    await dittoPage.clickContinue();

});

When("User fills the personal details", async ({ page }) => {
    logStep("Filling personal details and selecting the cover and rider options");

    const dittoPage = new DittoPage(page);

    // These values are the fixed inputs used for this scenario.
    await dittoPage.selectGender("Male");

    await dittoPage.selectMember("Self");

    await dittoPage.clickNextStep();

    await dittoPage.enterAge("28");

    await dittoPage.enterPincode("533401");

    await dittoPage.selectRadioOption("Yes");

    await dittoPage.selectRadioOption("No");

    await dittoPage.selectCoverAmount("₹10 L");
    await dittoPage.selectAddOn("Unlimited Restoration");

});

When("User calculates the premium", async ({ page }) => {
    logStep("Calculating the premium summary");

    const dittoPage = new DittoPage(page);

    await dittoPage.clickCalculatePremium();

});

Then("Total premium should be equal to Base Premium + Riders + GST", async ({ page }) => {
    logValidation("Checking the premium breakdown values from the summary screen");

    const dittoPage = new DittoPage(page);
    const premiumSummary = await dittoPage.getPremiumSummary();

    // Formula used for validation: expectedTotal = basePremium + riderPremium + gst.
    const expectedTotal = premiumSummary.basePremium + premiumSummary.riderPremium + premiumSummary.gst;

    logValidation(`Base Premium: ${premiumSummary.basePremium}, Riders: ${premiumSummary.riderPremium}, GST: ${premiumSummary.gst}, Total: ${premiumSummary.totalPremium}`);
    expect(premiumSummary.totalPremium).toBeCloseTo(expectedTotal, 2);

});