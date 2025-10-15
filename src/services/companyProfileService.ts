import { Request } from "express";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { createOAuthApiClient } from "../lib/utils/api.client";
import logger from "../lib/logger";
import { Headers } from "@companieshouse/api-sdk-node/dist/http";

export const getCompanyProfile = async (req: Request, companyNumber: string): Promise<CompanyProfile> => {
    const oAuthApiClient = createOAuthApiClient(req.session);

    logger.debug(`Getting company profile for companyNumber="${companyNumber}"`);

    const response = await oAuthApiClient.companyProfile.getCompanyProfile(companyNumber);

    if (!response.resource) {
        throw new Error(`No company profile found for companyNumber="${companyNumber}"`);
    }

    return response.resource;
};

export const extractRequestIdHeader = (req: Request): Headers =>
    req.requestId ? { "X-Request-Id": req.requestId } : {};
