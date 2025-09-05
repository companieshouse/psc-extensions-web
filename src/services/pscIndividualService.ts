import { Request } from "express";
import { PersonWithSignificantControl } from "@companieshouse/api-sdk-node/dist/services/psc/types";
import { createOAuthApiClient } from "../lib/utils/api.client";
import { logger } from "../lib/logger";
import Resource, { ApiErrorResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { HttpStatusCode } from "axios";

export const getIndividualPscDetails = async (req: Request, companyNumber: string, pscNotificationId: string): Promise<PersonWithSignificantControl> => {
    const oAuthApiClient = createOAuthApiClient(req.session);

    logger.debug(`Getting psc profile from pscName="${pscNotificationId}, ${companyNumber}"`);

    const response: Resource<PersonWithSignificantControl> | ApiErrorResponse = await oAuthApiClient.pscService.getPscIndividual(companyNumber, pscNotificationId);

    if (response?.httpStatusCode !== HttpStatusCode.Ok) {
        if (response?.httpStatusCode) {
            logger.error(`sdk responded with HTTP status code ${response.httpStatusCode}`);
        }
        throw new Error(`Failed to get PSC with verification state for companyNumber="${companyNumber}", notificationId="${pscNotificationId}"`);
    }

    const PscSdkResponse = response as Resource<PersonWithSignificantControl>;

    if (!PscSdkResponse.resource) {
        throw new Error(`no PSC with verification state returned for companyNumber="${companyNumber}", notificationId="${pscNotificationId}"`);
    }

    return PscSdkResponse.resource;
};
