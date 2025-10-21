import { NextFunction, Request, Response } from "express";
import { handleExceptions } from "../utils/asyncHandler";
import * as pscExtensionService from "../services/pscExtensionService";
import { PREFIXED_URLS } from "../lib/constants";
import { HttpError } from "../lib/utils/error_manifests/httpError";
import { HttpStatusCode } from "axios";
import logger from "../lib/logger";
import { addSearchParams } from "../utils/queryParams";
import { ValidationStatusResponse } from "@companieshouse/api-sdk-node/dist/services/psc-extensions-link/types";

/**
 * Middleware that validates PSC extension requests.
 *
 * 1. Validates if PSC extension request is valid
 * 2. If valid, checks the current extension count for the PSC
 * 3. If validation fails: Redirect to extension refused page
 *
 * Takes in the following query parameters:
 * - pscNotificationId: The PSC notification ID
 * - companyNumber: The company number
 */
export const validateExtensionRequest = handleExceptions(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const pscNotificationId = req.query.selectedPscId as string;
    const companyNumber = req.query.companyNumber as string;

    if (!pscNotificationId) {
        return next(new HttpError("Missing required parameter: selectedPscId", HttpStatusCode.BadRequest));
    }
    if (!companyNumber) {
        return next(new HttpError("Missing required parameter: companyNumber", HttpStatusCode.BadRequest));
    }

    try {
        const validationResponse: ValidationStatusResponse = await pscExtensionService.getIsPscExtensionValid(req, pscNotificationId, companyNumber);
        const isValid = validationResponse.valid;

        if (!isValid) {
            return res.redirect(addSearchParams(PREFIXED_URLS.EXTENSION_REFUSED, { companyNumber, selectedPscId: pscNotificationId }));
        }

        const extensionCount = await pscExtensionService.getPscExtensionCount(req, pscNotificationId);

        if (extensionCount === 0) {
            return res.redirect(addSearchParams(PREFIXED_URLS.REQUEST_EXTENSION, { companyNumber, selectedPscId: pscNotificationId }));
        } else if (extensionCount === 1) {
            // This is to be done: This is a work in progress to be completed -> This should redirect to the second extension start screen once developed
            return res.redirect(addSearchParams(PREFIXED_URLS.EXTENSION_ALREADY_SUBMITTED, { companyNumber, selectedPscId: pscNotificationId }));
        } else {
            return res.redirect(addSearchParams(PREFIXED_URLS.EXTENSION_REFUSED, { companyNumber, selectedPscId: pscNotificationId }));
        }
    } catch (error) {
        logger.error(`Error in validateExtensionRequest middleware: ${error}`);
        return next(error);
    }
}
);
