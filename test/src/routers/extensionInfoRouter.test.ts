import * as cheerio from "cheerio";
import mocks from "../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../src/app";
import { SERVICE_PATH_PREFIX, PATHS } from "../../../src/lib/constants";
import { HttpStatusCode } from "axios";
import { COMPANY_NUMBER, PSC_INDIVIDUAL } from "../../mocks/psc.mock";

const router = supertest(app);

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
        await router.get(SERVICE_PATH_PREFIX + PATHS.EXTENSION_INFO);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        await router.get(SERVICE_PATH_PREFIX + PATHS.EXTENSION_INFO).expect(200);
    });
});

describe("Cookie banner", () => {

    describe("GET method when cookie settings are to be confirmed", () => {
        it("should render the start page with the cookies banner", async () => {
            const resp = await router.get(SERVICE_PATH_PREFIX + PATHS.EXTENSION_INFO);
            const START_HEADING = "Requesting an extension";

            expect(resp.status).toBe(200);
            const $ = cheerio.load(resp.text);
            expect($("p.govuk-body:first").text()).toContain("We use some essential cookies to make our services work");
            expect($("h1.govuk-heading-l").text()).toMatch(START_HEADING);

        });
    });
});
