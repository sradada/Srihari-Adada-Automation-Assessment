import { Locator, Page } from "@playwright/test";

export class HotelSearchPage {

    private readonly page: Page;
    private readonly destinationField: Locator;
    private readonly destinationInput: Locator;
    private readonly closeModalButton: Locator;
    private readonly applyButton: Locator;
    private readonly searchButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.destinationField = page.locator("label[for='city']");
        this.destinationInput = page.locator("#city");
        this.closeModalButton = page.locator("[data-cy='closeModal']");
        this.applyButton = page.getByRole("button", { name: "APPLY" });
        this.searchButton = page.locator("#hsw_search_button");
    }

    public async navigateTo(url: string) {
        await this.page.goto(url);
        await this.page.waitForLoadState("domcontentloaded");
    }

    public async closeModal() {
        try {
            await this.closeModalButton.waitFor({
                state: "visible",
                timeout: 5000
            });
            await this.closeModalButton.click();
        } catch {
            console.log("Popup not displayed.");
        }
    }

    public async enterDestination(city: string) {
        await this.destinationField.click({ force: true });

        await this.page.keyboard.press("Control+A");
        await this.page.keyboard.press("Backspace");
        await this.page.keyboard.type(city, { delay: 100 });

        const citySuggestion = this.page
            .locator(".react-autosuggest__suggestion")
            .filter({ hasText: new RegExp(`^${city}$`, "i") })
            .first();

        await citySuggestion.waitFor({
            state: "visible",
            timeout: 10000
        });

        await citySuggestion.click({ force: true });
        await this.page.waitForTimeout(500);
    }

    public async clickApply() {
        if (await this.applyButton.isVisible()) {
            await this.applyButton.click();
        }
    }

    public async clickSearch() {
        await this.page.waitForTimeout(500);
        await this.page.keyboard.press("Escape");
        await this.searchButton.scrollIntoViewIfNeeded();
        await this.searchButton.click({ force: true });
    }
}