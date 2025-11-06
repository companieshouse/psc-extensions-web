import mocks from "../../mocks/all.middleware.mock";
import supertest from "supertest";
import { PREFIXED_URLS } from "../../../src/lib/constants";
import { validSDKResource } from "../../mocks/companyProfile.mock";
import app from "../../../src/app";
import * as companyProfileService from "../../../src/services/companyProfileService";

jest.mock("../../../src/services/companyProfileService", () => ({
    getCompanyProfile: jest.fn()
}));

const router = supertest(app);
const mockGetCompanyProfile = companyProfileService.getCompanyProfile as jest.Mock;

describe("GET extension already submitted router", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        mockGetCompanyProfile.mockResolvedValue(validSDKResource);
    });

    it("should check session and user auth before returning the page", async () => {
        await router.get(PREFIXED_URLS.EXTENSION_ALREADY_SUBMITTED);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        await router.get(PREFIXED_URLS.EXTENSION_ALREADY_SUBMITTED).expect(200);
    });
});
