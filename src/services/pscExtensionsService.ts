import { Request } from "express";
import { Transaction } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import Resource, { ApiErrorResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { HttpStatusCode } from "axios";
import { createOAuthApiClient } from "../lib/utils/api.client";
import { logger } from "../lib/logger";
import { HttpError } from "lib/errors/httpError";

// todo: move this to sdk? // NOSONAR
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
        throw new Error(`Aborting: PscExtensionsData is required for PSC Extension POST request for transactionId="${transaction.id}"`);
    }
    if (!extensionData.companyNumber) {
        throw new Error(`Aborting: companyNumber is required for PSC Extension POST request for transactionId="${transaction.id}"`);
    }
    if (!extensionData.pscNotificationId) {
        throw new Error(`Aborting: pscNotificationId is required for PSC Extension POST request for transactionId="${transaction.id}"`);
    }

    const oAuthApiClient = createOAuthApiClient(request.session);

    logger.debug(`Creating PSC extension resource for transactionId="${transaction.id}": ${transaction.description}`);

    // todo(3): change this to use api-sdk-node or private-api-sdk-node, we should add our psc-extensions-api // NOSONAR
    //  schema to api.ch.gov.uk-specifications or private.api.ch.gov.uk-specifications and then make an sdk.
    const url = `/transactions/${transaction.id}/persons-with-significant-control-extensions`;

    try {
        // todo(any): this is psuedo, actually use the sdk and call the psc-extensions-api // NOSONAR
        //  this goes to psc-extensions-api's uk.gov.companieshouse.psc.extensions.api.controller.impl.PscExtensionsControllerImpl#createPscExtension
        const response = await oAuthApiClient.companyProfile.getCompanyProfile("");
        // todo: use this after adding to api-sdk-node // NOSONAR
        // const response = await oAuthApiClient.pscExtension.postExtensionRequest(url, extensionData, headers);

        if (!response) {
            throw new Error(`PSC Extension POST request returned no response for transactionId="${transaction.id}"`);
        }

        if (response.httpStatusCode === HttpStatusCode.InternalServerError) {
            logger.error(`Internal server error when creating PSC extension for transactionId="${transaction.id}"`);
            throw new Error(`Internal server error when creating PSC extension for transactionId="${transaction.id}"`);
        }

        if (!response.httpStatusCode || response.httpStatusCode !== HttpStatusCode.Created) {
            throw new Error(`Failed to POST PSC Extension for transactionId="${transaction.id}", status: ${response.httpStatusCode}`);
        }

        logger.debug(`POST PSC Extension finished with status ${response.httpStatusCode} for transactionId="${transaction.id}"`);

        return {
            httpStatusCode: response.httpStatusCode,
            resource: response.resource
        } as Resource<PscExtensions>;

    } catch (error) {
        logger.error(`Error creating PSC extension for transactionId="${transaction.id}": ${error}`);
        throw error;
    }
};

export const getPscExtension = async (request: Request, transactionId: string, pscExtensionsId: string): Promise<Resource<PscExtensions>> => {
    const logReference = `transactionId="${transactionId}", pscExtensionsId="${pscExtensionsId}"`;

    const oAuthApiClient = createOAuthApiClient(request.session);

    logger.debug(`Retrieving PSC extension for ${logReference}`);
    // todo(any): this is psuedo, actually use the sdk and call the psc-extensions-api // NOSONAR
    //  this goes to psc-extensions-api's uk.gov.companieshouse.psc.extensions.api.controller.impl.PscExtensionsControllerImpl#createPscExtension
    // const response: Resource<PscExtensions> | ApiErrorResponse = await oAuthApiClient.pscExtensionService.getPscExtension(transactionId, pscExtensionsId);

    const response = await oAuthApiClient.companyProfile.getCompanyProfile("");
    if (!response) {
        throw new Error(`PSC Extension GET request returned no response for ${logReference}`);
    }
    switch (response.httpStatusCode) {
    case HttpStatusCode.Ok:
        break; // Successful response, proceed further
    case HttpStatusCode.Unauthorized:
        // Show the Page Not Found page if the user is not authorized to view the resource
        throw new HttpError(`User not authorized owner for ${logReference}`, HttpStatusCode.NotFound);

    case undefined:
        throw new Error(`HTTP status code is undefined - Failed to GET PSC Extension for ${logReference}`);
    default:
        throw new HttpError(`Failed to GET PSC Extension for ${logReference}`, response.httpStatusCode);
    }

    const castedResponse = response as Resource<PscExtensions>;

    if (!castedResponse.resource) {
        throw new Error(`PSC Extension API GET request returned no resource for ${logReference}`);
    }
    logger.debug(`GET PSC Extension finished with status ${response.httpStatusCode} for ${logReference}`);

    return castedResponse;
};

export function extractRequestIdHeader (request: Request): { [key: string]: string } {
    const requestId = request.headers["x-request-id"] as string;
    return requestId ? { "x-request-id": requestId } : {};
}
