import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";
import { HotelSearchPage } from "../pages/HotelSearchPage";
import { HotelSearchResultsPage } from "../pages/HotelSearchResultsPage";
import { logStep, logValidation } from "../utils/logger";

const { Given, When, Then } = createBdd();

Given("User launches the hotel booking application", async ({ page }) => {
    logStep("Launching the hotel booking application");

    const hotelSearchPage = new HotelSearchPage(page);

    await hotelSearchPage.navigateTo("https://www.makemytrip.com/hotels/");

    await hotelSearchPage.closeModal();

});

When("User searches hotels in {string}", async ({ page }, city: string) => {
    logStep(`Searching hotels for city: ${city}`);

    const hotelSearchPage = new HotelSearchPage(page);

    await hotelSearchPage.enterDestination(city);

});



When("User clicks on Search", async ({ page }) => {
    logStep("Clicking the search action");

    const hotelSearchPage = new HotelSearchPage(page);

    await hotelSearchPage.clickSearch();

    await page.waitForSelector('[id^="htl_id_seo_"]', { timeout: 30000 });

    await page.waitForTimeout(2000);

});

Then("All available hotel names should be displayed in the console", async ({ page }) => {
    logValidation("Printing and validating the hotel names returned by the search");

    const hotelSearchResultsPage = new HotelSearchResultsPage(page);

    await hotelSearchResultsPage.printHotelNames();

    const hotelNames = await hotelSearchResultsPage.getHotelNameList();

    expect(hotelNames.length).toBeGreaterThan(0);

});