import { HttpStatusCode } from "axios";
import mocks from "../mocks/all.middleware.mock";
import app from "../../src/app";
import * as cheerio from "cheerio";
import request from "supertest";
import { PREFIXED_URLS } from "../../src/lib/constants";
import { COMPANY_NUMBER, PSC_INDIVIDUAL, PSC_NOTIFICATION_ID } from "../mocks/psc.mock";

const router = request(app);
const uriQueryParams = `?companyNumber=${COMPANY_NUMBER}&selectedPscId=${PSC_NOTIFICATION_ID}`;
const requestAnExtensionUri = `${PREFIXED_URLS.REQUEST_EXTENSION}${uriQueryParams}`;
const reasonForExtensionUri = `${PREFIXED_URLS.REASON_FOR_EXTENSION}${uriQueryParams}`;

jest.mock("../../src/services/pscIndividualService", () => ({
    getPscIndividual: () => ({
        httpStatusCode: HttpStatusCode.Ok,
        resource: PSC_INDIVIDUAL
    })
}));
describe("GET extension info router and retrieve components such as footer links for both english or welsh depending on selected language", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and user auth before returning the page", async () => {
        await router.get(requestAnExtensionUri);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
    it("should render the footer with the expected links in English when user has selected 'English' link", async () => {
        const resp = await request(app).get(reasonForExtensionUri + "&lang=en");
        expect(resp.status).toBe(HttpStatusCode.Ok);
        const $ = cheerio.load(resp.text);

        const expectedLinks = [
            { href: "https://resources.companieshouse.gov.uk/serviceInformation.shtml", text: "Policies" },
            { href: "http://chsurl.co/help/cookies", text: "Cookies" },
            { href: "https://www.gov.uk/government/organisations/companies-house#org-contacts", text: "Contact us" },
            { href: "https://developer.company-information.service.gov.uk/", text: "Developers" },
            { href: "https://find-and-update.company-information.service.gov.uk/persons-with-significant-control-verification/accessibility-statement", text: "Accessibility Statement" }
        ];

        const footerLinks = $(".govuk-footer__inline-list-item a");
        expect(footerLinks.length).toBe(expectedLinks.length);

        expectedLinks.forEach((link, i) => {
            expect(footerLinks.eq(i).attr("href")).toBe(link.href);
            expect(footerLinks.eq(i).text().trim()).toBe(link.text);
        });
    });

    it("should render the footer with the expected links in Welsh when user has selected 'Cymraeg' link", async () => {
        const resp = await request(app).get(reasonForExtensionUri + "&lang=cy");
        expect(resp.status).toBe(HttpStatusCode.Ok);
        const $ = cheerio.load(resp.text);

        const expectedLinks = [
            { href: "https://resources.companieshouse.gov.uk/serviceInformation.shtml", text: "Polisïau" },
            { href: "http://chsurl.co/help/cookies", text: "Cwcis" },
            { href: "https://www.gov.uk/government/organisations/companies-house#org-contacts", text: "Cysylltu â ni" },
            { href: "https://developer.company-information.service.gov.uk/", text: "Datblygwyr" },
            { href: "https://find-and-update.company-information.service.gov.uk/persons-with-significant-control-verification/accessibility-statement", text: "Datganiad hygyrchedd" }
        ];

        const footerLinks = $(".govuk-footer__inline-list-item a");
        expect(footerLinks.length).toBe(expectedLinks.length);

        expectedLinks.forEach((link, i) => {
            expect(footerLinks.eq(i).attr("href")).toBe(link.href);
            expect(footerLinks.eq(i).text().trim()).toBe(link.text);
        });
    });

});
