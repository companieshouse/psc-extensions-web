import mocks from "../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../src/app";
import { SERVICE_PATH_PREFIX, PATHS, EXTENSION_REASONS, validExtensionReasons } from "../../../src/lib/constants";
import { HttpStatusCode } from "axios";
import * as cheerio from "cheerio";
import { COMPANY_NUMBER, PSC_INDIVIDUAL, PSC_NOTIFICATION_ID } from "../../mocks/psc.mock";
import { getPscExtensionCount } from "../../../src/services/pscExtensionService";

const router = supertest(app);
const uriQueryParamsTransaction = `?companyNumber=${COMPANY_NUMBER}&selectedPscId=${PSC_NOTIFICATION_ID}&lang=en`;
const reasonForExtensionUri = `${SERVICE_PATH_PREFIX + PATHS.REASON_FOR_EXTENSION}${uriQueryParamsTransaction}`;

jest.mock("../../../src/services/pscIndividualService", () => ({
    getPscIndividual: (): { httpStatusCode: number; resource: typeof PSC_INDIVIDUAL } => ({
        httpStatusCode: HttpStatusCode.Ok,
        resource: PSC_INDIVIDUAL
    })
}));
jest.mock("../../../src/services/transactionService", () => ({
    postTransaction: jest.fn().mockResolvedValue({ id: "11111-22222-33333" }),
    getTransaction: jest.fn().mockResolvedValue({ id: "11111-22222-33333" }),
    closeTransaction: jest.fn().mockResolvedValue({ id: "11111-22222-33333" })
}));
jest.mock("../../../src/services/pscExtensionService", () => ({
    createPscExtension: jest.fn().mockResolvedValue({
        resource: {
            links: { self: "persons-with-significant-control-extensions/11111-22222-33333" }
        }
    }),
    getPscExtensionCount: jest.fn()
}));

describe("Reason for extension router/handler integration tests", () => {

    describe("GET method", () => {

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should check session and user auth before returning the page", async () => {
            await router.get(reasonForExtensionUri);
            expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
            expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
            expect(mocks.mockValidationMiddleware).toHaveBeenCalled();
        });

        it("should return status 200", async () => {
            await router.get(reasonForExtensionUri).expect(200);
        });

        it("Should display 6 radio button where each value is an extension reason", async () => {

            const resp = await router
                .get(reasonForExtensionUri);

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

        it("should redirect to first extension confirmation when extension count is 0", async () => {
            (getPscExtensionCount as jest.Mock).mockResolvedValueOnce(0);

            const resp = await router
                .post(reasonForExtensionUri)
                .send({ whyDoYouNeedAnExtension: EXTENSION_REASONS.ID_DOCS_DELAYED });

            expect(resp.status).toBe(HttpStatusCode.Found);
            expect(resp.header.location).toBe(
                "/persons-with-significant-control-extensions/first-extension-request-successful?companyNumber=12345678&selectedPscId=123456&id=11111-22222-33333&lang=en"
            );
        });

        it("should redirect to second extension confirmation when extension count is greater than 1", async () => {
            (getPscExtensionCount as jest.Mock).mockResolvedValueOnce(2);

            const resp = await router
                .post(reasonForExtensionUri)
                .send({ whyDoYouNeedAnExtension: EXTENSION_REASONS.ID_DOCS_DELAYED });

            expect(resp.status).toBe(HttpStatusCode.Found);
            expect(resp.header.location).toBe(
                "/persons-with-significant-control-extensions/second-extension-request-successful?companyNumber=12345678&selectedPscId=123456&id=11111-22222-33333&lang=en"
            );
        });

        it("Should display the reason for extension page with the validation errors when no reason is selected", async () => {

            const resp = await router
                .post("/persons-with-significant-control-extensions/extension-reason?companyNumber=12345678&selectedPscId=123456&lang=en")
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
