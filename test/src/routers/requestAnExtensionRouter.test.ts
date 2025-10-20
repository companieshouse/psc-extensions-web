import * as cheerio from "cheerio";
import mocks from "../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../src/app";
import { PREFIXED_URLS } from "../../../src/lib/constants";
import { HttpStatusCode } from "axios";
import { COMPANY_NUMBER, PSC_INDIVIDUAL, PSC_NOTIFICATION_ID } from "../../mocks/psc.mock";

const router = supertest(app);
const uriQueryParams = `?companyNumber=${COMPANY_NUMBER}&selectedPscId=${PSC_NOTIFICATION_ID}&lang=en`;
const requestAnExtensionUri = `${PREFIXED_URLS.REQUEST_EXTENSION}${uriQueryParams}`;
const reasonForExtensionUri = `${PREFIXED_URLS.REASON_FOR_EXTENSION}${uriQueryParams}`;

jest.mock("../../../src/services/pscIndividualService", () => ({
    getPscIndividual: () => ({
        httpStatusCode: HttpStatusCode.Ok,
        resource: PSC_INDIVIDUAL
    })
}));
jest.mock("../../../src/services/companyProfileService", () => ({
    getCompanyProfile: () => ({
        httpStatusCode: HttpStatusCode.Ok,
        resource: COMPANY_NUMBER
    })
}));
describe("GET extension info router", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and user auth before returning the page", async () => {
        await router.get(requestAnExtensionUri);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mocks.mockValidationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        await router.get(requestAnExtensionUri).expect(200);
    });
});

describe("POST method", () => {
    it("should redirect to extension confirmation", async () => {
        const resp = await router
            .post(requestAnExtensionUri);
        expect(resp.status).toBe(HttpStatusCode.Found);
        expect(resp.header.location).toBe(reasonForExtensionUri);
    });
});

describe("Cookie banner", () => {
    describe("GET method when cookie settings are to be confirmed", () => {
        it("should render the start page with the cookies banner", async () => {
            const resp = await router.get(requestAnExtensionUri);
            const START_HEADING = "Requesting an extension";

            expect(resp.status).toBe(200);
            const $ = cheerio.load(resp.text);
            expect($("p.govuk-body:first").text()).toContain("We use some essential cookies to make our services work");
            expect($("h1.govuk-heading-l").text()).toMatch(START_HEADING);

        });
    });
});
