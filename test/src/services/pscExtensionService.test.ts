import { Resource } from "@companieshouse/api-sdk-node";
import { HttpStatusCode } from "axios";
import { Request } from "express";
import { createOAuthApiClient } from "../../../src/lib/utils/api.client";
import { createPscExtension } from "../../../src/services/pscExtensionService";
import { INDIVIDUAL_DATA, INDIVIDUAL_EXTENSION_CREATED, INITIAL_PSC_DATA } from "../../mocks/pscExtension.mock";
import { TRANSACTION_ID } from "../../mocks/transaction.mock";
import { PscExtension, PscExtensionData } from "@companieshouse/api-sdk-node/dist/services/psc-extensions-link/types";
import { DataIntegrityError } from "../../../src/lib/utils/error_manifests/dataIntegrityError";
import { HttpError } from "../../../src/lib/utils/error_manifests/httpError";
import { Responses } from "../../../src/lib/constants";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../src/lib/utils/api.client");

const mockCreatePscExtension = jest.fn();
const mockCreateOAuthApiClient = createOAuthApiClient as jest.Mock;

mockCreateOAuthApiClient.mockReturnValue({
    pscExtensionsService: {
        postPscExtension: mockCreatePscExtension
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
                resource: {
                    errors: [{
                        error: errorMessage
                    }]
                }
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

});
