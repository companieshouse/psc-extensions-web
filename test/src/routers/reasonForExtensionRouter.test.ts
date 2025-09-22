import mocks from "../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../src/app";
import { SERVICE_PATH_PREFIX, PATHS, ExtensionReasons, validExtensionReasons } from "../../../src/lib/constants";
import { HttpStatusCode } from "axios";
import * as cheerio from "cheerio";
import { PSC_INDIVIDUAL } from "../../mocks/psc.mock";

const router = supertest(app);
const uri = SERVICE_PATH_PREFIX + PATHS.REASON_FOR_EXTENSION;

jest.mock("../../../src/services/pscIndividualService", () => ({
    getPscIndividual: () => ({
        httpStatusCode: HttpStatusCode.Ok,
        resource: PSC_INDIVIDUAL
    })
}));
describe("Reason for extension router/handler integration tests", () => {

    describe("GET method", () => {

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should check session and user auth before returning the page", async () => {
            await router.get(uri);
            expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
            expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        });

        it("should return status 200", async () => {
            await router.get(uri).expect(200);
        });

        it("Should display 6 radio button where each value is an extension reason", async () => {

            const resp = await router
                .get(uri);

            const $ = cheerio.load(resp.text);

            const radioInputs = $("input.govuk-radios__input");

            const actualValues: string[] = [];

            radioInputs.each((_, el) => {
                const value = $(el).attr("value");
                if (value !== undefined) {
                    actualValues.push(value);
                }
            });

            expect(radioInputs.length).toBe(6);
            expect(actualValues).toEqual(validExtensionReasons);

        });
    });

    describe("POST method", () => {
        it("should redirect to extension confirmation", async () => {
            const resp = await router
                .post(uri)
                .send({ whyDoYouNeedAnExtension: ExtensionReasons.ID_DOCS_DELAYED });

            expect(resp.status).toBe(HttpStatusCode.Found);
            expect(resp.header.location).toBe(`/persons-with-significant-control-extension/extension-confirmation`);
        });

        it("Should display the reason for extension page with the validation errors when no reason is selected", async () => {

            const resp = await router
                .post(uri)
                .send({ });

            const $ = cheerio.load(resp.text);

            expect(resp.status).toBe(HttpStatusCode.Ok);

            // error summary
            const errorText = "Select why you are requesting an extension";
            const errorSummaryHeading = $("h2.govuk-error-summary__title").text().trim();
            expect(errorSummaryHeading).toContain("There is a problem");

            const errorSummaryText = $("ul.govuk-error-summary__list > li > a").text().trim();
            expect(errorSummaryText).toContain(errorText);

            // main body
            const paragraphText = $("#whyDoYouNeedAnExtension-error").text().trim();
            expect(paragraphText).toContain(errorText);

            // page title
            const title = $("title").text();
            expect(title).toContain("Error: What is the reason for the extension request?");

        });
    });
});
