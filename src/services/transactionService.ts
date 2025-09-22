import { Request } from "express";
import { Transaction } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import Resource, { ApiErrorResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { HttpStatusCode } from "axios";
import { createOAuthApiClient } from "../lib/utils/api.client";
import { getCompanyProfile } from "./companyProfileService";
import { logger } from "../lib/logger";

const REFERENCE = "PSC_EXTENSION";
const DESCRIPTION = "PSC extension request";

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
