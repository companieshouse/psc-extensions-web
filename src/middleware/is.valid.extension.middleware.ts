import { NextFunction, Request, Response } from "express";
import { handleExceptions } from "../utils/asyncHandler";
import * as pscExtensionService from "../services/pscExtensionService";
import { PREFIXED_URLS } from "../lib/constants";
import { HttpError } from "../lib/utils/error_manifests/httpError";
import { HttpStatusCode } from "axios";
import logger from "../lib/logger";
import { addSearchParams } from "../utils/queryParams";

/**
 * Middleware that validates PSC extension requests.
 *
 * 1. Validates if PSC extension request is valid
 * 2. If valid, checks the current extension count for the PSC
 * 3. If validation fails: Redirect to extension refused page
 *
 * Takes in the following query parameters:
 * - transactionId: The transaction ID
 * - pscNotificationId: The PSC notification ID
 * - companyNumber: The company number
 */
export const validateExtensionRequest = handleExceptions(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const transactionId = req.query.transactionId as string;
    const pscNotificationId = req.query.selectedPscId as string;
    const companyNumber = req.query.companyNumber as string;

    // Check for required query parameters
    if (!transactionId) {
        return next(new HttpError("Missing required parameter: transactionId", HttpStatusCode.BadRequest));
    }
    if (!pscNotificationId) {
        return next(new HttpError("Missing required parameter: selectedPscId", HttpStatusCode.BadRequest));
    }
    if (!companyNumber) {
        return next(new HttpError("Missing required parameter: companyNumber", HttpStatusCode.BadRequest));
    }

    try {
        // Checks if the extension request is valid (boolean check)
        const validationResponse = await pscExtensionService.getIsPscExtensionValid(req, transactionId, pscNotificationId, companyNumber);
        const isValid = validationResponse.isValid;

        // If not valid (false), redirect to extension refused screen
        if (!isValid) {
            return res.redirect(addSearchParams(PREFIXED_URLS.EXTENSION_REFUSED, { companyNumber, selectedPscId: pscNotificationId }));
        }

        // If valid (true), check the extension count of the PSC
        const extensionCount = await pscExtensionService.getPscExtensionCount(req, pscNotificationId);

        if (extensionCount === 0) {
            // Redirect to the start screen of the PSC Extension service (First extension request)
            return res.redirect(addSearchParams(PREFIXED_URLS.REQUEST_EXTENSION, { companyNumber, selectedPscId: pscNotificationId }));
        } else if (extensionCount === 1) {
            // Redirect to extension already submitted screen
            // This is a work in progress to be complete -> This should redirect to the second extension start screen once developed
            return res.redirect(addSearchParams(PREFIXED_URLS.EXTENSION_ALREADY_SUBMITTED, { companyNumber, selectedPscId: pscNotificationId }));
        } else {
            // extensionCount >= 2: Redirect to extension refused screen (maximum number of extension requests submitted by the PSC for this web app)
            return res.redirect(addSearchParams(PREFIXED_URLS.EXTENSION_REFUSED, { companyNumber, selectedPscId: pscNotificationId }));
        }
    } catch (error) {
        // If any service call fails, pass the error to the partials/error_500 screen
        logger.error(`Error in validateExtensionRequest middleware: ${error}`);
        return next(error);
    }
}
);
