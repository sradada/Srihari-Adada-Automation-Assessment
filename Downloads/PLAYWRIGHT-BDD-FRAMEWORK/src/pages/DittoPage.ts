import { Locator, Page } from "@playwright/test";

export class DittoPage {

    private page: Page;

    //==================================================
    // Locators
    //==================================================

    private readonly healthTypeOption: (healthTypeName: string) => Locator;
    private readonly genderOption: (gender: string) => Locator;
    private readonly memberOption: (member: string) => Locator;
    private readonly radioOption: (option: string) => Locator;
    private readonly addOnCheckbox: (addOnName: string) => Locator;

    private readonly nextButton: Locator;
    private readonly continueButton: Locator;
    private readonly nextStepButton: Locator;
    private readonly calculatePremiumButton: Locator;
    private readonly fullListButton: Locator;
    private readonly closeButton: Locator;

    private readonly ageTextBox: Locator;
    private readonly pincodeTextBox: Locator;

    private readonly coverSlider: Locator;
    private readonly coverSliderTrack: Locator;
    private readonly coverSliderLabels: Locator;

    constructor(page: Page) {
        this.page = page;

        this.healthTypeOption = (healthTypeName: string) =>
            page.getByText(healthTypeName, { exact: true });

        this.genderOption = (gender: string) =>
            page.locator("label").filter({ hasText: /Self|Spouse/ }).first().locator("div, span").filter({ hasText: gender }).first();

        this.memberOption = (member: string) =>
            page.locator("label").filter({ hasText: member }).first();

        this.radioOption = (option: string) =>
            page.getByRole("radio", { name: option });

        this.addOnCheckbox = (addOnName: string) =>
            page.locator("label, button, [role='checkbox'], [role='button']").filter({ hasText: addOnName }).first();

        this.nextButton = page.getByRole("button", { name: "Next" });
        this.continueButton = page.getByRole("button", { name: "Continue" });
        this.nextStepButton = page.getByRole("button", { name: "Next step" });
        this.calculatePremiumButton = page.getByRole("button", { name: "Calculate Premium" });
        this.fullListButton = page.getByRole("button", { name: "Full list" });
        this.closeButton = page.getByRole("button", { name: "Close" });

        this.ageTextBox = page.getByRole("textbox", { name: "Your age" });
        this.pincodeTextBox = page.getByRole("textbox", { name: "Proposer's Pincode" });

        this.coverSlider = page.locator(".mantine-Slider-root").first();
        this.coverSliderTrack = this.coverSlider.locator(".mantine-Slider-track").first();
        this.coverSliderLabels = this.coverSlider.locator(".mantine-Slider-markLabel");
    }

    //==================================================
    // Methods
    //==================================================

    // Reusable interaction helper: retries the click until the element is visible and clickable.
    private async waitForAndClick(locator: Locator) {
        let lastError: Error | undefined;

        for (let attempt = 0; attempt < 4; attempt += 1) {
            if (this.page.isClosed()) {
                throw new Error("Page has been closed");
            }

            try {
                await locator.scrollIntoViewIfNeeded({ timeout: 15000 }).catch(() => undefined);
                await locator.waitFor({ state: "visible", timeout: 30000 });
                await locator.click({ timeout: 30000, force: true });
                return;
            } catch (error) {
                lastError = error as Error;
                if (this.page.isClosed()) {
                    throw lastError;
                }
                await this.page.waitForTimeout(500).catch(() => undefined);
            }
        }

        throw lastError;
    }

    private async waitForAndFill(locator: Locator, value: string) {
        await locator.waitFor({ state: "visible", timeout: 30000 });
        await locator.fill(value, { timeout: 30000 });
    }

    private normalizeCoverAmount(value: string) {
        return value
            .toLowerCase()
            .replace(/₹/g, "")
            .replace(/\s+/g, "")
            .replace(/,/g, "")
            .replace(/l/g, " lakh")
            .replace(/cr/g, " crore");
    }

    private parseCurrency(value: string): number {
        let cleanedValue = "";

        for (const character of value) {
            if ((character >= "0" && character <= "9") || character === ".") {
                cleanedValue += character;
            }
        }

        return Number(cleanedValue || 0);
    }

    private extractCurrency(text: string): string {
        let currencyValue = "";

        for (const character of text) {
            if ((character >= "0" && character <= "9") || character === ".") {
                currencyValue += character;
            }
        }

        return currencyValue;
    }

    // Reads the amount from the row whose label is already visible in the premium summary.
    private async getAmountFromRow(label: string): Promise<number> {
        const labelLocator = this.page.getByText(label, { exact: false }).first();
        await labelLocator.waitFor({ state: "visible", timeout: 15000 });

        const amountText = await labelLocator.evaluate((element) => {
            let current: Element | null = element.closest("div");

            while (current && current !== document.body) {
                const text = current.textContent || "";
                if (text.includes("₹")) {
                    return text;
                }
                current = current.parentElement;
            }

            return "";
        });

        return this.parseCurrency(this.extractCurrency(amountText || ""));
    }

    private async getSelectedRiderPremium(): Promise<number> {
        const checkedCheckboxes = this.page.locator('input[type="checkbox"]:checked');
        const count = await checkedCheckboxes.count();
        let total = 0;

        for (let index = 0; index < count; index += 1) {
            const checkbox = checkedCheckboxes.nth(index);
            const amountText = await checkbox.evaluate((element) => {
                let current: Element | null = element.closest("div");

                while (current && current !== document.body) {
                    const text = current.textContent || "";
                    if (text.includes("₹")) {
                        return text;
                    }
                    current = current.parentElement;
                }

                return "";
            });

            total += this.parseCurrency(this.extractCurrency(amountText || ""));
        }

        return total;
    }

    private async getGstAmount(): Promise<number> {
        const gstLabel = this.page.getByText("GST", { exact: false }).first();
        const gstCount = await gstLabel.count();

        if (gstCount === 0) {
            return 0;
        }

        await gstLabel.waitFor({ state: "visible", timeout: 15000 }).catch(() => undefined);

        const amountText = await gstLabel.evaluate((element) => {
            let current: Element | null = element.parentElement;

            while (current && current !== document.body) {
                const children = Array.from(current.children);
                const currencyChild = children.find((child) => (child.textContent || "").includes("₹"));

                if (currencyChild) {
                    return currencyChild.textContent || "";
                }

                current = current.parentElement;
            }

            return "";
        });

        return this.parseCurrency(this.extractCurrency(amountText || ""));
    }

    // Collects the premium breakdown shown on the summary screen.
    async getPremiumSummary() {
        await this.page.getByText("Base Premium", { exact: false }).first().waitFor({ state: "visible", timeout: 20000 });

        return {
            basePremium: await this.getAmountFromRow("Base Premium"),
            riderPremium: await this.getSelectedRiderPremium(),
            gst: await this.getGstAmount(),
            totalPremium: await this.getAmountFromRow("Total Premium")
        };
    }

    async navigate(url: string) {
        await this.page.goto(url);
    }

    async selectHealthInsurance(healthType: string) {
        await this.waitForAndClick(this.healthTypeOption(healthType));
    }

    async clickNext() {
        await this.waitForAndClick(this.nextButton);
    }

    async clickContinue() {
        await this.waitForAndClick(this.continueButton);
    }

    async clickNextStep() {
        await this.waitForAndClick(this.nextStepButton);
    }

    async openFullList() {
        await this.waitForAndClick(this.fullListButton);
    }

    async closeFullList() {
        await this.waitForAndClick(this.closeButton);
    }

    async selectGender(gender: string) {
        await this.waitForAndClick(this.genderOption(gender));
    }

    async selectMember(member: string) {
        await this.waitForAndClick(this.memberOption(member));
    }

    async enterAge(age: string) {
        await this.waitForAndFill(this.ageTextBox, age);
    }

    async enterPincode(pincode: string) {
        await this.waitForAndFill(this.pincodeTextBox, pincode);
    }

    async selectRadioOption(option: string) {
        await this.waitForAndClick(this.radioOption(option));
    }

    // Some add-ons are exposed as generic label/button controls, so this method safely skips when no element matches.
    async selectAddOn(addOnName: string) {
        const addOnOption = this.addOnCheckbox(addOnName);
        const count = await addOnOption.count();

        if (count === 0) {
            return;
        }

        await this.waitForAndClick(addOnOption);
    }

    // The cover amount is rendered as a slider, so we map the requested value to the visible slider label.
    async selectCoverAmount(coverAmount: string) {
        const targetValue = this.normalizeCoverAmount(coverAmount);

        await this.coverSlider.scrollIntoViewIfNeeded({ timeout: 15000 }).catch(() => undefined);
        await this.coverSlider.waitFor({ state: "visible", timeout: 30000 });

        const labels = await this.coverSliderLabels.evaluateAll((elements) =>
            elements.map((element) => element.textContent?.replace(/\u00a0/g, " ").trim() || "")
        );

        const normalizedLabels = labels.map((label) => this.normalizeCoverAmount(label));
        const matchingIndex = normalizedLabels.findIndex((label) => label === targetValue);

        if (matchingIndex === -1) {
            throw new Error(`Cover amount '${coverAmount}' was not found in the slider labels: ${labels.join(", ")}`);
        }

        const targetPercent = (matchingIndex / (normalizedLabels.length - 1)) * 100;
        const box = await this.coverSliderTrack.boundingBox();

        if (!box) {
            throw new Error("Slider track was not found");
        }

        const x = box.x + (box.width * targetPercent) / 100;
        const y = box.y + box.height / 2;

        await this.page.mouse.click(x, y);
        await this.page.waitForTimeout(500);
    }

    async clickCalculatePremium() {
        await this.waitForAndClick(this.calculatePremiumButton);
    }
}
