import { Resource } from "@companieshouse/api-sdk-node";
import { HttpStatusCode } from "axios";
import { Request } from "express";
import { createOAuthApiClient } from "../../../src/lib/utils/api.client";
import { createPscExtension, getIsPscExtensionValid, getPscExtensionCount } from "../../../src/services/pscExtensionService";
import { INDIVIDUAL_DATA, INDIVIDUAL_EXTENSION_CREATED, INITIAL_PSC_DATA } from "../../mocks/pscExtension.mock";
import { TRANSACTION_ID } from "../../mocks/transaction.mock";
import { PscExtension, PscExtensionData, ValidationStatusResponse } from "@companieshouse/api-sdk-node/dist/services/psc-extensions-link/types";
import { DataIntegrityError } from "../../../src/lib/utils/error_manifests/dataIntegrityError";
import { HttpError } from "../../../src/lib/utils/error_manifests/httpError";
import { Responses } from "../../../src/lib/constants";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../src/lib/utils/api.client");

const mockCreatePscExtension = jest.fn();
const mockGetIsPscExtensionValid = jest.fn();
const mockGetPscExtensionCount = jest.fn();
const mockCreateOAuthApiClient = createOAuthApiClient as jest.Mock;

mockCreateOAuthApiClient.mockReturnValue({
    pscExtensionsService: {
        postPscExtension: mockCreatePscExtension,
        getIsPscExtensionValid: mockGetIsPscExtensionValid,
        getPscExtensionCount: mockGetPscExtensionCount
    }
});

describe("pscExtensionService", () => {
    const req = {} as Request;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("createPscExtension", () => {
        it("should return the created initial resource on success", async () => {
            const mockCreate: Resource<PscExtension> = {
                httpStatusCode: HttpStatusCode.Created,
                resource: INDIVIDUAL_EXTENSION_CREATED
            };

            mockCreatePscExtension.mockResolvedValueOnce(mockCreate);

            const response = await createPscExtension(req, TRANSACTION_ID, INDIVIDUAL_DATA);

            expect(response.httpStatusCode).toBe(HttpStatusCode.Created);
            if ("resource" in response) {
                const castedResource = response.resource as PscExtension;
                expect(castedResource).toEqual(INDIVIDUAL_EXTENSION_CREATED);
            } else {
                throw new Error("Response does not contain a resource");
            }
            expect(mockCreateOAuthApiClient).toHaveBeenCalledTimes(1);
            expect(mockCreatePscExtension).toHaveBeenCalledTimes(1);
            expect(mockCreatePscExtension).toHaveBeenCalledWith(TRANSACTION_ID, INDIVIDUAL_DATA, {});
        });

        it("should throw an error when the response is empty", async () => {
            const mockCreate: Resource<PscExtension> = {
                httpStatusCode: HttpStatusCode.Created,
                resource: undefined
            };

            mockCreatePscExtension.mockResolvedValueOnce(mockCreate);

            const response = await createPscExtension(req, TRANSACTION_ID, INITIAL_PSC_DATA).catch((error) => {
                expect(error).toBeInstanceOf(Error);
                expect(error).toHaveProperty("message", `PSC Extension API POST request returned no resource for transactionId="${TRANSACTION_ID}"`);
            });
            expect(response).toBeUndefined();
        });

        it("should throw an error when PscExtension is undefined", async () => {
            const response = await createPscExtension(req, TRANSACTION_ID, undefined as any).catch((error) => {
                expect(error).toBeInstanceOf(Error);
                expect(error).toHaveProperty("message", `Aborting: PscExtensionData is required for PSC Extension POST request for transactionId="${TRANSACTION_ID}"`);
            });
            expect(response).toBeUndefined();
        });
        it("should throw an error when companyNumber is undefined", async () => {
            const incompleteData = {
                pscNotificationId: INITIAL_PSC_DATA.pscNotificationId
            };

            const response = await createPscExtension(req, TRANSACTION_ID, incompleteData as any).catch((error) => {
                expect(error).toBeInstanceOf(Error);
                expect(error).toHaveProperty("message", `Aborting: companyNumber is required for PSC Extension POST request for transactionId="${TRANSACTION_ID}"`);
            });
            expect(response).toBeUndefined();
        });

        it("should throw an Error when no response from API", async () => {
            mockCreatePscExtension.mockResolvedValueOnce(undefined);

            const response = await createPscExtension(req, TRANSACTION_ID, INITIAL_PSC_DATA).catch((error) => {
                expect(error).toBeInstanceOf(Error);
                expect(error).toHaveProperty("message", `PSC Extension POST request returned no response for transactionId="${TRANSACTION_ID}"`);
            });
            expect(response).toBeUndefined();
        });

        it("should throw an Error when API status is unknown", async () => {
            mockCreatePscExtension.mockResolvedValueOnce({});

            const response = await createPscExtension(req, TRANSACTION_ID, INDIVIDUAL_DATA).catch((error) => {
                expect(error).toBeInstanceOf(Error);
                expect(error).toHaveProperty("message", `HTTP status code is undefined - Failed to POST PSC Extension for transactionId="${TRANSACTION_ID}"`);
            });
            expect(response).toBeUndefined();
        });

        it.each([400, 404])("should throw a DataIntegrityError when API status is 400/404", async (status) => {
            const mockCreate: Resource<PscExtension> = {
                httpStatusCode: status
            };
            mockCreatePscExtension.mockResolvedValueOnce(mockCreate);

            const response = await createPscExtension(req, TRANSACTION_ID, INDIVIDUAL_DATA).catch((error) => {
                expect(error).toBeInstanceOf(DataIntegrityError);
                expect(error).toHaveProperty("type", "PSC_DATA");
                expect(error).toHaveProperty("message", `received ${status} - Failed to POST PSC Extension for transactionId="${TRANSACTION_ID}"`);
            });
            expect(response).toBeUndefined();
        });

        it.each([400, 404])("should parse API error response text when available & API status is 400/404", async (status) => {
            const errorMessage = "Error message";
            const mockCreate = {
                httpStatusCode: status,
                errors: [{
                    error: errorMessage
                }]
            };
            mockCreatePscExtension.mockResolvedValueOnce(mockCreate);

            const response = await createPscExtension(req, TRANSACTION_ID, INDIVIDUAL_DATA).catch((error) => {
                expect(error).toBeInstanceOf(DataIntegrityError);
                expect(error).toHaveProperty("type", "PSC_DATA");
                expect(error).toHaveProperty("message", `received ${status} - ${errorMessage}`);
            });
            expect(response).toBeUndefined();
        });

        it("should throw a HttpError when an unsuccessful API status is otherwise unhandled", async () => {
            const mockCreate: Resource<PscExtension> = {
                httpStatusCode: HttpStatusCode.ServiceUnavailable
            };
            mockCreatePscExtension.mockResolvedValueOnce(mockCreate);

            const response = await createPscExtension(req, TRANSACTION_ID, INDIVIDUAL_DATA).catch((error) => {
                expect(error).toBeInstanceOf(HttpError);
                expect(error).toHaveProperty("status", HttpStatusCode.ServiceUnavailable);
                expect(error).toHaveProperty("message", `Failed to POST PSC Extension for transactionId="${TRANSACTION_ID}"`);
            });
            expect(response).toBeUndefined();
        });

        it("should throw a DataIntegrityError when pscNotificationId is undefined", async () => {
            const incompleteData: PscExtensionData = {
                requesterEmail: "exmaple@eample.com",
                companyNumber: INITIAL_PSC_DATA.companyNumber
            };

            const response = await createPscExtension(req, TRANSACTION_ID, incompleteData).catch((error) => {
                expect(error).toBeInstanceOf(DataIntegrityError);
                expect(error).toHaveProperty("message", `Aborting: pscNotificationId is required for PSC Extension POST request for transactionId="${TRANSACTION_ID}"`);
            });
            expect(response).toBeUndefined();
        });

        it("should throw a DataIntegrityError when there's a problem with psc data", async () => {

            const mockCastApiErrorResponse = {
                httpStatusCode: HttpStatusCode.InternalServerError,
                errors: [
                    {
                        errors: [
                            {
                                error: "Service Unavailable",
                                errorValues: {
                                    error: Responses.PROBLEM_WITH_PSC_DATA,
                                    id: "12345678"
                                },
                                location: "/test/12345",
                                locationType: "endpoint",
                                type: "test"
                            }
                        ]
                    }
                ]
            };

            mockCreatePscExtension.mockResolvedValueOnce(mockCastApiErrorResponse);

            const response = await createPscExtension(req, TRANSACTION_ID, INITIAL_PSC_DATA).catch((error) => {
                expect(error).toBeInstanceOf(DataIntegrityError);
                expect(error).toHaveProperty("type", "PSC_DATA");
                expect(error).toHaveProperty("message", `We are currently unable to process an Extensions filing for this PSC - Failed to POST PSC Extension for transactionId="${TRANSACTION_ID}"`);
            });

            expect(response).toBeUndefined();
            expect(mockCreateOAuthApiClient).toHaveBeenCalledTimes(1);
            expect(mockCreatePscExtension).toHaveBeenCalledTimes(1);
            expect(mockCreatePscExtension).toHaveBeenCalledWith(TRANSACTION_ID, INITIAL_PSC_DATA, {});
        });
    });

    describe("getIsPscExtensionValid", () => {
        const pscNotificationId = "PSCDATA5";
        const companyNumber = "00006400";

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return ValidationStatusResponse on success", async () => {
            const mockValidationResponse: ValidationStatusResponse = {
                validationStatusError: [],
                valid: true
            };

            const mockResponse: Resource<ValidationStatusResponse> = {
                httpStatusCode: HttpStatusCode.Ok,
                resource: mockValidationResponse
            };

            mockGetIsPscExtensionValid.mockResolvedValueOnce(mockResponse);

            const response = await getIsPscExtensionValid(req, pscNotificationId, companyNumber);

            expect(response).toEqual(mockValidationResponse);
            expect(mockCreateOAuthApiClient).toHaveBeenCalledTimes(1);
            expect(mockGetIsPscExtensionValid).toHaveBeenCalledTimes(1);
            expect(mockGetIsPscExtensionValid).toHaveBeenCalledWith(pscNotificationId, companyNumber, {});
        });

        it("should throw an error when pscNotificationId is not provided", async () => {
            await expect(getIsPscExtensionValid(req, "", companyNumber))
                .rejects
                .toThrow("Aborting: Missing required parameters: pscNotificationId");
        });

        it("should throw an error when companyNumber is not provided", async () => {
            await expect(getIsPscExtensionValid(req, pscNotificationId, ""))
                .rejects
                .toThrow("Aborting: Missing required parameters: companyNumber");
        });

        it("should throw an error when no response from API", async () => {
            mockGetIsPscExtensionValid.mockResolvedValueOnce(undefined);

            await expect(getIsPscExtensionValid(req, pscNotificationId, companyNumber))
                .rejects
                .toThrow(`PSC Extension validation GET request returned no response for {"pscNotificationId":"${pscNotificationId}","companyNumber":"${companyNumber}"}`);
        });

        it("should throw HttpError when API returns error status code", async () => {
            const mockResponse = {
                httpStatusCode: HttpStatusCode.NotFound
            };

            mockGetIsPscExtensionValid.mockResolvedValueOnce(mockResponse);

            await expect(getIsPscExtensionValid(req, pscNotificationId, companyNumber))
                .rejects
                .toThrow(HttpError);
        });

        it("should throw HttpError when API returns undefined status code", async () => {
            const mockResponse = {
                httpStatusCode: undefined
            };

            mockGetIsPscExtensionValid.mockResolvedValueOnce(mockResponse);

            await expect(getIsPscExtensionValid(req, pscNotificationId, companyNumber))
                .rejects
                .toThrow(HttpError);
        });

        it("should throw an error when resource is not provided in response", async () => {
            const mockResponse: Resource<ValidationStatusResponse> = {
                httpStatusCode: HttpStatusCode.Ok,
                resource: undefined
            };

            mockGetIsPscExtensionValid.mockResolvedValueOnce(mockResponse);

            await expect(getIsPscExtensionValid(req, pscNotificationId, companyNumber))
                .rejects
                .toThrow(`PSC Extension validation API GET request returned no resource for {"pscNotificationId":"${pscNotificationId}","companyNumber":"${companyNumber}"}`);
        });
    });

    describe("getPscExtensionCount", () => {
        const pscNotificationId = "PSCDATA5";

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return count on success", async () => {
            const expectedCount = 2;
            const mockResponse: Resource<number> = {
                httpStatusCode: HttpStatusCode.Ok,
                resource: expectedCount
            };

            mockGetPscExtensionCount.mockResolvedValueOnce(mockResponse);

            const response = await getPscExtensionCount(req, pscNotificationId);

            expect(response).toBe(expectedCount);
            expect(mockCreateOAuthApiClient).toHaveBeenCalledTimes(1);
            expect(mockGetPscExtensionCount).toHaveBeenCalledTimes(1);
            expect(mockGetPscExtensionCount).toHaveBeenCalledWith(pscNotificationId, {});
        });

        it("should return 0 when count is 0", async () => {
            const expectedCount = 0;
            const mockResponse: Resource<number> = {
                httpStatusCode: HttpStatusCode.Ok,
                resource: expectedCount
            };

            mockGetPscExtensionCount.mockResolvedValueOnce(mockResponse);

            const response = await getPscExtensionCount(req, pscNotificationId);

            expect(response).toBe(expectedCount);
        });

        it("should throw an error when pscNotificationId is not provided", async () => {
            await expect(getPscExtensionCount(req, ""))
                .rejects
                .toThrow("Aborting: pscNotificationId is required for PSC Extension Count GET request");
        });

        it("should throw an error when no response from API", async () => {
            mockGetPscExtensionCount.mockResolvedValueOnce(undefined);

            await expect(getPscExtensionCount(req, pscNotificationId))
                .rejects
                .toThrow(`PSC Extension Count GET request returned no response for pscNotificationId="${pscNotificationId}"`);
        });

        it("should throw HttpError when API returns error status code", async () => {
            const mockResponse = {
                httpStatusCode: HttpStatusCode.InternalServerError
            };

            mockGetPscExtensionCount.mockResolvedValueOnce(mockResponse);

            await expect(getPscExtensionCount(req, pscNotificationId))
                .rejects
                .toThrow(HttpError);
        });

        it("should throw HttpError when API returns undefined status code", async () => {
            const mockResponse = {
                httpStatusCode: undefined
            };

            mockGetPscExtensionCount.mockResolvedValueOnce(mockResponse);

            await expect(getPscExtensionCount(req, pscNotificationId))
                .rejects
                .toThrow(HttpError);
        });

        it("should throw an error when resource is undefined", async () => {
            const mockResponse: Resource<number> = {
                httpStatusCode: HttpStatusCode.Ok,
                resource: undefined
            };

            mockGetPscExtensionCount.mockResolvedValueOnce(mockResponse);

            await expect(getPscExtensionCount(req, pscNotificationId))
                .rejects
                .toThrow(`PSC Extension Count API GET request returned no resource for pscNotificationId="${pscNotificationId}"`);
        });

        it("should throw an error when resource is null", async () => {
            const mockResponse = {
                httpStatusCode: HttpStatusCode.Ok,
                resource: null
            };

            mockGetPscExtensionCount.mockResolvedValueOnce(mockResponse);

            await expect(getPscExtensionCount(req, pscNotificationId))
                .rejects
                .toThrow(`PSC Extension Count API GET request returned no resource for pscNotificationId="${pscNotificationId}"`);
        });
    });

});
