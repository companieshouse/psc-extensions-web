import { Request } from "express";
import { createOAuthApiClient } from "../../../src/lib/utils/api.client";
import { getCompanyProfile } from "../../../src/services/companyProfileService";
import { COMPANY_NUMBER, badRequestSDKResource, missingSDKResource, mockApiErrorResponse, validCompanyProfile, validSDKResource } from "../../mocks/companyProfile.mock";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../src/lib/utils/api.client");

const mockGetCompanyProfile = jest.fn();
const mockCreateOAuthApiClient = createOAuthApiClient as jest.Mock;
mockCreateOAuthApiClient.mockReturnValue({
    companyProfile: {
        getCompanyProfile: mockGetCompanyProfile
    }
});

describe("CompanyProfileService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        expect(mockCreateOAuthApiClient).toHaveBeenCalledTimes(1);
        expect(mockGetCompanyProfile).toHaveBeenCalledTimes(1);
    });

    describe("getPscVerification", () => {
        it("should retrieve the company profile resource", async () => {
            const mockResponse = validSDKResource;
            mockGetCompanyProfile.mockResolvedValueOnce(mockResponse);
            const request = {} as Request;

            const response = await getCompanyProfile(request, COMPANY_NUMBER);

            expect(response).toEqual(validCompanyProfile);

        });

        it("should throw an error when ApiErrorResponse is returned", async () => {
            const mockResponse = mockApiErrorResponse;
            mockGetCompanyProfile.mockResolvedValueOnce(mockResponse);
            const request = {} as Request;

            await expect(getCompanyProfile(request, COMPANY_NUMBER)).rejects.toThrow(
                new Error(`No company profile found for companyNumber="${COMPANY_NUMBER}"`)
            );
        });

        it("should return an error if no response is return", async () => {
            const mockResponse = missingSDKResource;
            mockGetCompanyProfile.mockResolvedValueOnce(mockResponse);
            const request = {} as Request;

            await expect(getCompanyProfile(request, COMPANY_NUMBER)).rejects.toThrow(
                new Error(`No company profile found for companyNumber="${COMPANY_NUMBER}"`)
            );
        });
    });
});
