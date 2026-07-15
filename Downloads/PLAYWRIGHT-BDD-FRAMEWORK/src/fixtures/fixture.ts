import { test as base } from 'playwright-bdd';
import type { Page } from '@playwright/test';
import { HotelSearchPage } from '../pages/HotelSearchPage';
import { HotelSearchResultsPage } from '../pages/HotelSearchResultsPage';
import { DittoPage } from '../pages/DittoPage';

type MyFixtures = {

    hotelSearchPage: HotelSearchPage;

    hotelSearchResultsPage: HotelSearchResultsPage;
    dittoPage: DittoPage;


};

export const test = base.extend<MyFixtures>({

    hotelSearchPage: async ({ page }: { page: Page }, use: (fixture: HotelSearchPage) => Promise<void>) => {

        await use(new HotelSearchPage(page));

    },

    hotelSearchResultsPage: async ({ page }: { page: Page }, use: (fixture: HotelSearchResultsPage) => Promise<void>) => {

        await use(new HotelSearchResultsPage(page));

    },

    dittoPage: async ({ page }: { page: Page }, use: (fixture: DittoPage) => Promise<void>) => {

        await use(new DittoPage(page));

    }



});