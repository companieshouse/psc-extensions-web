import { Request } from "express";
import { Transaction } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import Resource, { ApiErrorResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { HttpStatusCode } from "axios";
import { createOAuthApiClient } from "../lib/utils/api.client";
import logger from "../lib/logger";
import { extractRequestIdHeader } from "./companyProfileService";
import ApiClient from "@companieshouse/api-sdk-node/dist/client";
import { DataIntegrityError, DataIntegrityErrorType } from "lib/utils/error_manifests/dataIntegrityError";
import { HttpError } from "lib/utils/error_manifests/httpError";

export interface PscExtensionsData {
    companyNumber: string;
    pscNotificationId: string;
    relevantOfficer?: {
        dateOfBirth?: string;
        nameElements?: {
            title?: string;
            forename?: string;
            surname?: string;
        };
    };
    extensionDetails: {
        extensionReason: string;
        extensionRequestDate?: string;
    };
}

export interface PscExtensions {
    id?: string;
    links?: {
        self?: string;
        validationStatus?: string;
    };
    data?: PscExtensionsData;
}

export const createPscExtension = async (request: Request, transaction: Transaction, extensionData: PscExtensionsData): Promise<Resource<PscExtensions> | ApiErrorResponse> => {
    if (!extensionData) {
        throw new Error(`Aborting: PscVerificationData is required for PSC Verification POST request for transactionId="${transaction.id}"`);
    }
    if (!extensionData.companyNumber) {
        throw new Error(`Aborting: companyNumber is required for PSC Verification POST request for transactionId="${transaction.id}"`);
    }

    const oAuthApiClient: ApiClient = createOAuthApiClient(request.session);

    logger.debug(`Creating PSC verification resource for transactionId="${transaction.id}": ${transaction.description}`);

    const headers = extractRequestIdHeader(request);
    const sdkResponse: Resource<PscExtensions> | ApiErrorResponse = await oAuthApiClient.pscVerificationService.postPscVerification(transaction.id as string, extensionData, headers);

    if (!sdkResponse) {
        throw new Error(`PSC Verification POST request returned no response for transactionId="${transaction.id}"`);
    }

    if (sdkResponse.httpStatusCode === HttpStatusCode.InternalServerError) {
        const error = ((sdkResponse).errors?.[0] as ApiErrorResponse).errors?.[0].errorValues?.error as string;
    }

    if (!sdkResponse.httpStatusCode) {
        throw new Error(`HTTP status code is undefined - Failed to POST PSC Verification for transactionId="${transaction.id}"`);
    } else if (sdkResponse.httpStatusCode === HttpStatusCode.BadRequest || sdkResponse.httpStatusCode === HttpStatusCode.NotFound) {
        const message = (sdkResponse as any)?.resource?.errors?.[0]?.error ?? `Failed to POST PSC Verification for transactionId="${transaction.id}"`;
        throw new DataIntegrityError(`received ${sdkResponse.httpStatusCode} - ${message}`, DataIntegrityErrorType.PSC_DATA);
    } else if (sdkResponse.httpStatusCode !== HttpStatusCode.Created) {
        throw new HttpError(`Failed to POST PSC Verification for transactionId="${transaction.id}"`, sdkResponse.httpStatusCode);
    }

    const castedSdkResponse = sdkResponse as Resource<PscExtensions>;

    if (!castedSdkResponse.resource) {
        throw new Error(`PSC Verification API POST request returned no resource for transactionId="${transaction.id}"`);
    }
    logger.debug(`POST PSC Verification finished with status ${sdkResponse.httpStatusCode} for transactionId="${transaction.id}"`);

    return castedSdkResponse;
};
