import { Request, Response } from "express";
import logger from "../../lib/logger";
import { BaseViewData, GenericHandler } from "../../routers/handlers/abstractGenericHandler";
import { Transaction } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import { postTransaction } from "../../services/transactionService";
import { PscExtension, PscExtensionData } from "@companieshouse/api-sdk-node/dist/services/psc-extensions-link/types";
import { createPscExtension } from "../../services/pscExtensionService";
import { Resource } from "@companieshouse/api-sdk-node";
import { ApiErrorResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { HttpStatusCode } from "axios";
import { PATHS, SERVICE_PATH_PREFIX } from "../../lib/constants";

export class NewSubmissionHandler extends GenericHandler<BaseViewData> {

    public async execute (req: Request, res: Response) {
        logger.info(`called`);
        // create a new transaction
        const transaction: Transaction = await postTransaction(req);
        logger.info(`CREATED transaction with transactionId="${transaction.id}"`);

        // create a new submission for the company number provided
        const resource = await this.createNewSubmission(req, transaction);
        const companyNumber = req.query.companyNumber as string;
        const pscNotificationId = req.query.pscNotificationId as string;

        let nextPageUrl = "";

        if (this.isErrorResponse(resource)) {
            // nextPageUrl = getUrlWithStopType(PrefixedUrls.STOP_SCREEN, STOP_TYPE.PROBLEM_WITH_PSC_DATA);
        } else {
            const pscExtension = resource.resource;
            logger.info(`CREATED New Resource ${pscExtension?.links.self}`);

            // set up redirect to psc_code screen
            const regex = "persons-with-significant-control-extension/(.*)$";
            const resourceId = pscExtension?.links.self.match(regex);
            nextPageUrl = SERVICE_PATH_PREFIX + PATHS.FIRST_EXTENSION_CONFIRMATION + `/${transaction.id}/${resourceId?.[1]}`;

        }
        // send the redirect
        return `${nextPageUrl}?companyNumber=${companyNumber}+selectedPscId=${pscNotificationId}`;
    }

    public async createNewSubmission (request: Request, transaction: Transaction): Promise<Resource<PscExtension> | ApiErrorResponse> {
        const companyNumber = request.query.companyNumber as string;
        const pscNotificationId = request.query.pscNotificationId as string;
        const extension: PscExtensionData = {
            companyNumber,
            pscNotificationId
        };
        return createPscExtension(request, transaction.id!, extension);
    }

    public isErrorResponse (obj: any): obj is ApiErrorResponse {
        return obj.httpStatusCode === HttpStatusCode.InternalServerError;
    }

}
