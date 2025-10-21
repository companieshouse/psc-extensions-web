import { Request } from "express";
import Resource, { ApiErrorResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { HttpStatusCode } from "axios";
import { createOAuthApiClient } from "../lib/utils/api.client";
import logger from "../lib/logger";
import { extractRequestIdHeader } from "./companyProfileService";
import ApiClient from "@companieshouse/api-sdk-node/dist/client";
import { DataIntegrityError, DataIntegrityErrorType } from "../lib/utils/error_manifests/dataIntegrityError";
import { HttpError } from "../lib/utils/error_manifests/httpError";
import { PscExtension, PscExtensionData, ValidationStatusResponse } from "@companieshouse/api-sdk-node/dist/services/psc-extensions-link/types";
import { Responses } from "../lib/constants";

export const createPscExtension = async (request: Request, transactionId: string, extensionData: PscExtensionData): Promise<Resource<PscExtension> | ApiErrorResponse> => {
    if (!extensionData) {
        throw new Error(`Aborting: PscExtensionData is required for PSC Extension POST request for transactionId="${transactionId}"`);
    }
    if (!extensionData.companyNumber) {
        throw new Error(`Aborting: companyNumber is required for PSC Extension POST request for transactionId="${transactionId}"`);
    }
    if (extensionData.pscNotificationId == null) {
        throw new DataIntegrityError(`Aborting: pscNotificationId is required for PSC Extension POST request for transactionId="${transactionId}"`, DataIntegrityErrorType.PSC_DATA);
    }

    const oAuthApiClient: ApiClient = createOAuthApiClient(request.session);

    logger.debug(`Creating PSC Extension resource for transactionId="${transactionId}"`);

    const headers = extractRequestIdHeader(request);
    const sdkResponse: Resource<PscExtension> | ApiErrorResponse = await oAuthApiClient.pscExtensionsService.postPscExtension(transactionId, extensionData, headers);

    if (!sdkResponse) {
        throw new Error(`PSC Extension POST request returned no response for transactionId="${transactionId}"`);
    }

    if (sdkResponse.httpStatusCode === HttpStatusCode.InternalServerError) {
        const error = ((sdkResponse as ApiErrorResponse).errors?.[0] as ApiErrorResponse).errors?.[0].errorValues?.error as string;

        if (error?.includes(Responses.PROBLEM_WITH_PSC_DATA as string)) {
            throw new DataIntegrityError(`${Responses.PROBLEM_WITH_PSC_DATA} - Failed to POST PSC Extension for transactionId="${transactionId}"`, DataIntegrityErrorType.PSC_DATA);
        }
    }

    if (!sdkResponse.httpStatusCode) {
        throw new Error(`HTTP status code is undefined - Failed to POST PSC Extension for transactionId="${transactionId}"`);
    } else if (sdkResponse.httpStatusCode === HttpStatusCode.BadRequest || sdkResponse.httpStatusCode === HttpStatusCode.NotFound) {
        const errorResponse = sdkResponse as ApiErrorResponse;
        const message = errorResponse?.errors?.[0]?.error ?? `Failed to POST PSC Extension for transactionId="${transactionId}"`;
        throw new DataIntegrityError(`received ${sdkResponse.httpStatusCode} - ${message}`, DataIntegrityErrorType.PSC_DATA);
    } else if (sdkResponse.httpStatusCode !== HttpStatusCode.Created) {
        throw new HttpError(`Failed to POST PSC Extension for transactionId="${transactionId}"`, sdkResponse.httpStatusCode);
    }

    const castedSdkResponse = sdkResponse as Resource<PscExtension>;

    if (!castedSdkResponse.resource) {
        throw new Error(`PSC Extension API POST request returned no resource for transactionId="${transactionId}"`);
    }
    logger.debug(`POST PSC Extension finished with status ${sdkResponse.httpStatusCode} for transactionId="${transactionId}"`);

    return castedSdkResponse;
};

export const getIsPscExtensionValid = async (request: Request, pscNotificationId: string, companyNumber: string): Promise<ValidationStatusResponse> => {
    const params = { pscNotificationId, companyNumber };
    if (!Object.values(params).every(Boolean)) {
        const missing = Object.keys(params).filter(key => !params[key as keyof typeof params]);
        throw new Error(`Aborting: Missing required parameters: ${missing.join(", ")}`);
    }

    const oAuthApiClient: ApiClient = createOAuthApiClient(request.session);

    logger.debug(`Getting PSC Extension validation for ${JSON.stringify(params)}`);

    const headers = extractRequestIdHeader(request);
    const sdkResponse: Resource<ValidationStatusResponse> | ApiErrorResponse = await oAuthApiClient.pscExtensionsService.getIsPscExtensionValid(pscNotificationId, companyNumber, headers);

    if (!sdkResponse) {
        throw new Error(`PSC Extension validation GET request returned no response for ${JSON.stringify(params)}`);
    }

    if (!sdkResponse.httpStatusCode || sdkResponse.httpStatusCode >= HttpStatusCode.BadRequest) {
        logger.error(`HTTP status code ${sdkResponse.httpStatusCode} - Failed to get PSC Extension validation for ${JSON.stringify(params)}`);
        throw new HttpError(`Failed to get PSC Extension validation for ${JSON.stringify(params)}`, sdkResponse.httpStatusCode ?? HttpStatusCode.InternalServerError);
    }

    const castedSdkResponse = sdkResponse as Resource<ValidationStatusResponse>;

    if (!castedSdkResponse.resource) {
        throw new Error(`PSC Extension validation API GET request returned no resource for ${JSON.stringify(params)}`);
    }

    logger.debug(`GET PSC Extension validation finished with status ${sdkResponse.httpStatusCode} for ${JSON.stringify(params)}, valid=${castedSdkResponse.resource.valid}`);

    return castedSdkResponse.resource;
};

export const getPscExtensionCount = async (request: Request, pscNotificationId: string): Promise<number> => {
    if (!pscNotificationId) {
        throw new Error(`Aborting: pscNotificationId is required for PSC Extension Count GET request`);
    }

    const oAuthApiClient: ApiClient = createOAuthApiClient(request.session);

    logger.debug(`Getting PSC Extension count for pscNotificationId="${pscNotificationId}"`);

    const headers = extractRequestIdHeader(request);
    const sdkResponse: Resource<number> | ApiErrorResponse = await oAuthApiClient.pscExtensionsService.getPscExtensionCount(pscNotificationId, headers);

    if (!sdkResponse) {
        throw new Error(`PSC Extension Count GET request returned no response for pscNotificationId="${pscNotificationId}"`);
    }

    if (!sdkResponse.httpStatusCode || sdkResponse.httpStatusCode >= HttpStatusCode.BadRequest) {
        logger.error(`HTTP status code ${sdkResponse.httpStatusCode} - Failed to get PSC Extension count for pscNotificationId="${pscNotificationId}"`);
        throw new HttpError(`Failed to get PSC Extension count for pscNotificationId="${pscNotificationId}"`, sdkResponse.httpStatusCode ?? HttpStatusCode.InternalServerError);
    }

    const castedSdkResponse = sdkResponse as Resource<number>;

    if (castedSdkResponse.resource === undefined || castedSdkResponse.resource === null) {
        throw new Error(`PSC Extension Count API GET request returned no resource for pscNotificationId="${pscNotificationId}"`);
    }

    logger.debug(`GET PSC Extension count finished with status ${sdkResponse.httpStatusCode} for pscNotificationId="${pscNotificationId}", count=${castedSdkResponse.resource}`);

    return castedSdkResponse.resource;
};
