import { HttpStatusCode } from "axios";
import mocks from "../mocks/all.middleware.mock";
import app from "../../src/app";
import * as cheerio from "cheerio";
import request from "supertest";
import { PrefixedUrls } from "../../src/lib/constants";

const router = request(app);

describe("GET extension info router and retrieve components such as footer links for both english or welsh depending on selected language", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and user auth before returning the page", async () => {
        await router.get(PrefixedUrls.EXTENSION_INFO);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
    it("should render the footer with the expected links in English when user has selected 'English' link", async () => {
        const resp = await request(app).get(`/persons-with-significant-control-extension/extension-info?lang=en`);
        expect(resp.status).toBe(HttpStatusCode.Ok);
        const $ = cheerio.load(resp.text);

        const expectedLinks = [
            { href: "https://resources.companieshouse.gov.uk/serviceInformation.shtml", text: "Policies" },
            { href: "http://chsurl.co/help/cookies", text: "Cookies" },
            { href: "https://www.gov.uk/government/organisations/companies-house#org-contacts", text: "Contact us" },
            { href: "https://developer.company-information.service.gov.uk/", text: "Developers" },
            { href: "http://chsurl.co/help/accessibility-statement", text: "Accessibility Statement" }
        ];

        const footerLinks = $(".govuk-footer__inline-list-item a");
        expect(footerLinks.length).toBe(expectedLinks.length);

        expectedLinks.forEach((link, i) => {
            expect(footerLinks.eq(i).attr("href")).toBe(link.href);
            expect(footerLinks.eq(i).text().trim()).toBe(link.text);
        });
    });

    it("should render the footer with the expected links in Welsh when user has selected 'Cymraeg' link", async () => {
        const resp = await request(app).get(`/persons-with-significant-control-extension/extension-info?lang=cy`);
        expect(resp.status).toBe(HttpStatusCode.Ok);
        const $ = cheerio.load(resp.text);

        const expectedLinks = [
            { href: "https://resources.companieshouse.gov.uk/serviceInformation.shtml", text: "Lorem" },
            { href: "http://chsurl.co/help/cookies", text: "Consectetur" },
            { href: "https://www.gov.uk/government/organisations/companies-house#org-contacts", text: "Iaculis suscipit" },
            { href: "https://developer.company-information.service.gov.uk/", text: "Proin" },
            { href: "http://chsurl.co/help/accessibility-statement", text: "Efficitur ipsum" }
        ];

        const footerLinks = $(".govuk-footer__inline-list-item a");
        expect(footerLinks.length).toBe(expectedLinks.length);

        expectedLinks.forEach((link, i) => {
            expect(footerLinks.eq(i).attr("href")).toBe(link.href);
            expect(footerLinks.eq(i).text().trim()).toBe(link.text);
        });
    });

});
