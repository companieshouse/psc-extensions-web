import mocks from "../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../src/app";
import { PREFIXED_URLS } from "../../../src/lib/constants";
import { HttpStatusCode } from "axios";
import { COMPANY_NUMBER, PSC_INDIVIDUAL, PSC_NOTIFICATION_ID } from "../../mocks/psc.mock";

const router = supertest(app);
const uriQueryParams = `?companyNumber=${COMPANY_NUMBER}&selectedPscId=${PSC_NOTIFICATION_ID}&lang=en`;
const firstExtensionConfirmedUri = `${PREFIXED_URLS.FIRST_EXTENSION_CONFIRMATION}${uriQueryParams}`;
const secondExtensionConfirmedUri = `${PREFIXED_URLS.SECOND_EXTENSION_CONFIRMATION}${uriQueryParams}`;

jest.mock("../../../src/services/pscIndividualService", () => ({
    getPscIndividual: () => ({
        httpStatusCode: HttpStatusCode.Ok,
        resource: PSC_INDIVIDUAL
    })
}));

jest.mock("../../../src/services/companyProfileService", () => ({
    getCompanyProfile: () => ({
        httpStatusCode: HttpStatusCode.Ok,
        resource: {
            companyName: "The Company"
        }
    })
}));

describe("GET extension confirmation router", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return status 200 and first extension confirmation screen with text", async () => {
        const res = await router.get(firstExtensionConfirmedUri);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("this service. You must do so before");
    });

    it("should return status 200 and second extension confirmation screen with text", async () => {
        const res = await router.get(secondExtensionConfirmedUri);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("You cannot request another extension using this service.");
    });
});
