import Resource from "@companieshouse/api-sdk-node/dist/services/resource";
import { Transaction } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import { HttpStatusCode } from "axios";
import { HttpError } from "../../../src/lib/utils/error_manifests/httpError";
import { createOAuthApiClient } from "../../../src/lib/utils/api.client";
import { getCompanyProfile } from "../../../src/services/companyProfileService";
import { getTransaction, postTransaction } from "../../../src/services/transactionService";
import { validCompanyProfile } from "../../mocks/companyProfile.mock";
import { COMPANY_NUMBER, CREATED_PSC_TRANSACTION, OPEN_PSC_TRANSACTION, TRANSACTION_ID } from "../../mocks/transaction.mock";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../src/lib/utils/api.client");
jest.mock("../../../src/services/companyProfileService");
const mockGetCompanyProfile = getCompanyProfile as jest.Mock;
mockGetCompanyProfile.mockResolvedValue(validCompanyProfile);

const mockCreateOAuthApiClient = createOAuthApiClient as jest.Mock;
const mockGetTransaction = jest.fn();
const mockPostTransaction = jest.fn();
const mockPutTransaction = jest.fn();
const mockCloseTransaction = jest.fn();

mockCreateOAuthApiClient.mockReturnValue({
    transaction: {
        getTransaction: mockGetTransaction,
        postTransaction: mockPostTransaction,
        putTransaction: mockPutTransaction,
        closeTransaction: mockCloseTransaction
    }
});

describe("Transaction service", () => {

    const REQUEST_ID = "test-request-id";
    const req = {
        headers: {
            "x-request-id": REQUEST_ID
        }
    } as any;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getTransaction", () => {

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should resolve with the transaction resource on success", async () => {
            const mockResponse: Resource<Transaction> = {
                httpStatusCode: HttpStatusCode.Ok,
                resource: OPEN_PSC_TRANSACTION
            };
            mockGetTransaction.mockResolvedValueOnce(mockResponse);

            const result = await getTransaction(req, TRANSACTION_ID);

            expect(mockGetTransaction).toHaveBeenCalledWith(TRANSACTION_ID, REQUEST_ID);
            expect(result).toEqual(OPEN_PSC_TRANSACTION);
        });

        it("should reject if no response is returned from the API", async () => {
            mockGetTransaction.mockResolvedValueOnce(undefined);

            await expect(getTransaction(req, TRANSACTION_ID)).rejects.toThrow("No response from Transaction API");
            expect(mockGetTransaction).toHaveBeenCalledWith(TRANSACTION_ID, REQUEST_ID);
        });

        it("should reject if the API response has an HTTP error status", async () => {
            const mockResponse = {
                httpStatusCode: HttpStatusCode.BadRequest
            };
            mockGetTransaction.mockResolvedValueOnce(mockResponse);

            await expect(getTransaction(req, TRANSACTION_ID)).rejects.toThrow(
                new HttpError(`Failed to get transaction with transactionId="${TRANSACTION_ID}"`, HttpStatusCode.BadRequest)
            );
            expect(mockGetTransaction).toHaveBeenCalledWith(TRANSACTION_ID, REQUEST_ID);
        });

        it("should reject if the API response has no resource", async () => {
            const mockResponse: Resource<Transaction> = {
                httpStatusCode: HttpStatusCode.Ok,
                resource: undefined
            };
            mockGetTransaction.mockResolvedValueOnce(mockResponse);

            await expect(getTransaction(req, TRANSACTION_ID)).rejects.toThrow("No resource in Transaction API response");
            expect(mockGetTransaction).toHaveBeenCalledWith(TRANSACTION_ID, REQUEST_ID);
        });
    });

    describe("postTransaction", () => {
        afterEach(() => {
            expect(mockCreateOAuthApiClient).toHaveBeenCalledTimes(1);
            expect(mockPostTransaction).toHaveBeenCalledTimes(1);
        });

        it("should resolve created resource on success", async () => {
            mockPostTransaction.mockResolvedValueOnce({
                httpStatusCode: HttpStatusCode.Created,
                resource: CREATED_PSC_TRANSACTION
            } as Resource<Transaction>);
            req.query = { companyNumber: COMPANY_NUMBER };

            const response = await postTransaction(req);

            expect(response).toEqual(CREATED_PSC_TRANSACTION);
        });

        it("should reject when no response from transaction service", async () => {
            mockPostTransaction.mockResolvedValueOnce(undefined);
            req.query = { companyNumber: COMPANY_NUMBER };

            await expect(postTransaction(req)).rejects.toThrow(
                `No response from Transaction API for companyNumber="${COMPANY_NUMBER}"`
            );
        });

        it.each([400, 404, undefined])("should reject when response from transaction service has status %p", async (status) => {
            const mockResponse = {
                httpStatusCode: status as number
            };
            mockPostTransaction.mockResolvedValueOnce(mockResponse);
            req.query = { companyNumber: COMPANY_NUMBER };

            await expect(postTransaction(req)).rejects.toThrow(
                `HTTP status code ${status} - Failed to post transaction with companyNumber="${COMPANY_NUMBER}"`
            );
        });

        it("should reject when response from transaction service has no resource", async () => {
            const mockResponse = {
                httpStatusCode: HttpStatusCode.Ok,
                resource: undefined
            };
            mockPostTransaction.mockResolvedValueOnce(mockResponse);
            req.query = { companyNumber: COMPANY_NUMBER };

            await expect(postTransaction(req)).rejects.toThrow(
                `No resource in Transaction API response for companyNumber="${COMPANY_NUMBER}"`
            );
        });

    });

});
