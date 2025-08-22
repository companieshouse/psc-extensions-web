import {Request} from "express";
import {Transaction} from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import {ApiErrorResponse, Resource} from "@companieshouse/api-sdk-node/dist/services/resource";
import {HttpStatusCode} from "axios";
import {createOAuthApiClient} from "../lib/utils/api.client";
import {logger} from "../lib/logger";

// todo: move this to sdk?
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

    const headers = extractRequestIdHeader(request);

    // todo(3): change this to use api-sdk-node or private-api-sdk-node, we should add our psc-extensions-api
    //  schema to api.ch.gov.uk-specifications or private.api.ch.gov.uk-specifications and then make an sdk.
    const url = `/transactions/${transaction.id}/persons-with-significant-control-extensions`;

    try {
        // todo(any): this is psuedo, actually use the sdk and call the psc-extensions-api
        //  this goes to psc-extensions-api's uk.gov.companieshouse.psc.extensions.api.controller.impl.PscExtensionsControllerImpl#createPscExtension
        const response = await oAuthApiClient.httpPost(url, extensionData, headers);

        if (!response) {
            throw new Error(`PSC Extension POST request returned no response for transactionId="${transaction.id}"`);
        }

        if (response.status === HttpStatusCode.InternalServerError) {
            logger.error(`Internal server error when creating PSC extension for transactionId="${transaction.id}"`);
            throw new Error(`Internal server error when creating PSC extension for transactionId="${transaction.id}"`);
        }

        if (!response.status || response.status !== HttpStatusCode.Created) {
            throw new Error(`Failed to POST PSC Extension for transactionId="${transaction.id}", status: ${response.status}`);
        }

        logger.debug(`POST PSC Extension finished with status ${response.status} for transactionId="${transaction.id}"`);

        return {
            httpStatusCode: response.status,
            resource: response.body
        } as Resource<PscExtensions>;

    } catch (error) {
        logger.error(`Error creating PSC extension for transactionId="${transaction.id}": ${error}`);
        throw error;
    }
};

const extractRequestIdHeader = (request: Request): { [key: string]: string } => {
    const requestId = request.headers["x-request-id"] as string;
    return requestId ? {"x-request-id": requestId} : {};
};