import { Locator, Page } from "@playwright/test";

export class HotelSearchResultsPage {

    private readonly page: Page;
    private readonly resultsHeading: (city: string) => Locator;
    private readonly hotelNames: Locator;

    constructor(page: Page) {
        this.page = page;
        this.resultsHeading = (city: string) => this.page.getByText(`Showing Properties in ${city}`);
        this.hotelNames = this.page.locator('[id^="htl_id_seo_"]');
    }

    public getResultsHeading(city: string): Locator {
        return this.resultsHeading(city);
    }

    public getHotelNames(): Locator {
        return this.hotelNames;
    }

    public async getHotelNameList(): Promise<string[]> {
        await this.page.waitForSelector('[id^="htl_id_seo_"]', {
            timeout: 20000
        });

        let previousCount = 0;
        let currentCount = 0;
        let scrollAttempts = 0;
        const maxScrolls = 10;

        while (scrollAttempts < maxScrolls) {
            currentCount = await this.hotelNames.count();

            if (currentCount === previousCount) {
                break;
            }

            previousCount = currentCount;
            await this.page.evaluate(() => window.scrollBy(0, window.innerHeight));
            await this.page.waitForTimeout(1000);

            scrollAttempts++;
        }

        return await this.hotelNames.allTextContents();
    }

    public async printHotelNames() {
        const hotelNames = await this.getHotelNameList();

        console.log("\n==========================================");
        console.log("Hotels Available");
        console.log("==========================================");

        hotelNames.forEach((hotel, index) => {
            console.log(`${index + 1}. ${hotel.trim()}`);
        });

        console.log("==========================================\n");
    }
}