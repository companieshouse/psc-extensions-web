import { Request } from "express";
import Resource, { ApiErrorResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { HttpStatusCode } from "axios";
import { createOAuthApiClient } from "../lib/utils/api.client";
import logger from "../lib/logger";
import { extractRequestIdHeader } from "./companyProfileService";
import ApiClient from "@companieshouse/api-sdk-node/dist/client";
import { DataIntegrityError, DataIntegrityErrorType } from "../lib/utils/error_manifests/dataIntegrityError";
import { HttpError } from "../lib/utils/error_manifests/httpError";
import { PscExtension, PscExtensionData } from "@companieshouse/api-sdk-node/dist/services/psc-extensions-link/types";
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

        if (RegExp(Responses.PROBLEM_WITH_PSC_DATA as string).exec(error)) {
            throw new DataIntegrityError(`${Responses.PROBLEM_WITH_PSC_DATA} - Failed to POST PSC Extension for transactionId="${transactionId}"`, DataIntegrityErrorType.PSC_DATA);
        }

    }

    if (!sdkResponse.httpStatusCode) {
        throw new Error(`HTTP status code is undefined - Failed to POST PSC Extension for transactionId="${transactionId}"`);
    } else if (sdkResponse.httpStatusCode === HttpStatusCode.BadRequest || sdkResponse.httpStatusCode === HttpStatusCode.NotFound) {
        const message = (sdkResponse as any)?.resource?.errors?.[0]?.error ?? `Failed to POST PSC Extension for transactionId="${transactionId}"`;
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
