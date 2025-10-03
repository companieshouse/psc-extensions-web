import { Request } from "express";
import { Transaction } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import Resource, { ApiErrorResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { HttpStatusCode } from "axios";
import { createOAuthApiClient } from "../lib/utils/api.client";
import { getCompanyProfile } from "./companyProfileService";
import logger from "../lib/logger";
import ApiClient from "@companieshouse/api-sdk-node/dist/client";
import { HttpError } from "../lib/utils/error_manifests/httpError";

const REFERENCE = "PSC_EXTENSION";
const DESCRIPTION = "PSC extension request";

export const getTransaction = async (req: Request, transactionId: string): Promise<Transaction> => {
    const apiClient: ApiClient = createOAuthApiClient(req.session);

    logger.debug(`Retrieving transaction with transactionId="${transactionId}"`);
    const requestId = req.headers["x-request-id"] as string | undefined;
    const sdkResponse: Resource<Transaction> | ApiErrorResponse = await apiClient.transaction.getTransaction(transactionId, requestId);

    if (!sdkResponse) {
        logger.error(`Transaction API GET request returned no response for transactionId="${transactionId}"`);
        return Promise.reject(new Error(`No response from Transaction API for transactionId="${transactionId}"`));
    }

    if (!sdkResponse.httpStatusCode || sdkResponse.httpStatusCode >= HttpStatusCode.BadRequest) {
        logger.error(`HTTP status code ${sdkResponse.httpStatusCode} - Failed to get transaction with transactionId="${transactionId}"`);
        return Promise.reject(new HttpError(`Failed to get transaction with transactionId="${transactionId}"`, sdkResponse.httpStatusCode ?? HttpStatusCode.InternalServerError));
    }

    const castedSdkResponse: Resource<Transaction> = sdkResponse as Resource<Transaction>;

    if (!castedSdkResponse.resource) {
        logger.error(`Transaction API GET request returned no resource for transactionId="${transactionId}"`);
        return Promise.reject(new Error(`No resource in Transaction API response for transactionId="${transactionId}"`));
    }

    logger.debug(`Retrieved transaction with status code ${sdkResponse.httpStatusCode} for transactionId="${transactionId}"`);

    return Promise.resolve(castedSdkResponse.resource);
};

export const postTransaction = async (req: Request): Promise<Transaction> => {
    const companyNumber = req.query.companyNumber as string;
    const companyProfile: CompanyProfile = await getCompanyProfile(req, companyNumber);
    const companyName: string = companyProfile.companyName;
    const oAuthApiClient = createOAuthApiClient(req.session);

    const transaction: Transaction = {
        reference: REFERENCE,
        description: DESCRIPTION,
        companyName
    };

    logger.debug(`Creating transaction with companyNumber="${companyNumber}"`);
    const requestId = req.headers["x-request-id"] as string | undefined;
    const sdkResponse: Resource<Transaction> | ApiErrorResponse = await oAuthApiClient.transaction.postTransaction(transaction, requestId);

    if (!sdkResponse) {
        return Promise.reject(new Error(`No response from Transaction API for companyNumber="${companyNumber}"`));
    }

    if (!sdkResponse.httpStatusCode || sdkResponse.httpStatusCode >= HttpStatusCode.BadRequest) {
        return Promise.reject(new Error(`HTTP status code ${sdkResponse.httpStatusCode} - Failed to post transaction with companyNumber="${companyNumber}"`));
    }

    const castedSdkResponse: Resource<Transaction> = sdkResponse as Resource<Transaction>;

    if (!castedSdkResponse.resource) {
        return Promise.reject(new Error(`No resource in Transaction API response for companyNumber="${companyNumber}"`));
    }

    logger.debug(`Received transaction with status code ${sdkResponse.httpStatusCode} for companyNumber="${companyNumber}"`);

    return Promise.resolve(castedSdkResponse.resource);
};
