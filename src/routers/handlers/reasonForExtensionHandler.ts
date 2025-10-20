import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "./abstractGenericHandler";
import logger from "../../lib/logger";
import { SERVICE_PATH_PREFIX, PATHS, ROUTER_VIEWS_FOLDER_PATH, ExtensionReasons } from "../../lib/constants";
import { PscExtensionsFormsValidator } from "../../lib/validation/form-validators/pscExtensions";
import { getPscIndividual } from "../../services/pscIndividualService";
import { formatDateBorn } from "../handlers/requestAnExtensionHandler";
import { createPscExtension } from "../../services/pscExtensionService";
import { PscExtension, PscExtensionData } from "@companieshouse/api-sdk-node/dist/services/psc-extensions-link/types";
import { Resource } from "@companieshouse/api-sdk-node";
import { ApiErrorResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { Transaction } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import { HttpStatusCode } from "axios";
import { postTransaction } from "../../services/transactionService";

interface ExtensionReasonViewData extends BaseViewData {
    reasons: typeof ExtensionReasons;
    pscName: string;
    dateOfBirth: string;
    selectedPscId: string;
    companyNumber: string;
    pscNotificationId?: string
}

export class ReasonForExtensionHandler extends GenericHandler<BaseViewData> {

    protected override async getViewData (req: Request, res: Response): Promise<ExtensionReasonViewData> {
        const baseViewData = await super.getViewData(req, res);
        const selectedPscId = req.query.selectedPscId as string;
        const companyNumber = req.query.companyNumber as string;
        const pscIndividual = await getPscIndividual(req, companyNumber, selectedPscId);
        return {
            ...baseViewData,
            pscName: pscIndividual.resource?.name!,
            dateOfBirth: formatDateBorn(pscIndividual.resource?.dateOfBirth),
            selectedPscId: selectedPscId,
            companyNumber: companyNumber,
            backURL: SERVICE_PATH_PREFIX + PATHS.REQUEST_EXTENSION,
            templateName: PATHS.REASON_FOR_EXTENSION.slice(1),
            reasons: ExtensionReasons
        };
    }

    public async executeGet (req: Request, res: Response): Promise<ViewModel<ExtensionReasonViewData>> {
        logger.info(`called to serve start page`);
        return {
            templatePath: ROUTER_VIEWS_FOLDER_PATH + PATHS.REASON_FOR_EXTENSION,
            viewData: await this.getViewData(req, res)
        };
    }

    public async executePost (req: Request, res: Response): Promise<ViewModel<ExtensionReasonViewData>> {
        const viewData = await this.getViewData(req, res);
        const selectedOption = req.body?.whyDoYouNeedAnExtension;
        const validator = new PscExtensionsFormsValidator();
        const errorKey: string | null = validator.validateExtensionReason(selectedOption);

        if (errorKey) {
            viewData.errors = { whyDoYouNeedAnExtension: { summary: errorKey } };
            return {
                templatePath: ROUTER_VIEWS_FOLDER_PATH + PATHS.REASON_FOR_EXTENSION,
                viewData
            };
        }

        logger.info(`called`);
        // create a new transaction
        const transaction: Transaction = await postTransaction(req);
        logger.info(`CREATED transaction with transactionId="${transaction.id}"`);

        // create a new submission for the company number provided
        const resource = await this.createNewSubmission(req, transaction);
        let nextPageUrl = "";

        if (this.isErrorResponse(resource)) {

            //error

             return {
                templatePath: ROUTER_VIEWS_FOLDER_PATH + PATHS.REASON_FOR_EXTENSION,
                viewData
            };
        } else {
            const pscExtension = resource.resource;
            logger.info(`CREATED New Resource ${pscExtension?.links.self}`);

            // set up redirect to confirmation screen
            nextPageUrl = SERVICE_PATH_PREFIX + PATHS.FIRST_EXTENSION_CONFIRMATION;
            
            return {
                templatePath: ROUTER_VIEWS_FOLDER_PATH + PATHS.REASON_FOR_EXTENSION,
                viewData,

            };
        }

    }

    public async createNewSubmission (request: Request, transaction: Transaction): Promise<Resource<PscExtension> | ApiErrorResponse> {

        const selectedPscId = request.query.selectedPscId as string;
        const companyNumber = request.query.companyNumber as string;
        const selectedOption = request.body?.whyDoYouNeedAnExtension;

        const extension: PscExtensionData = {
            companyNumber,
            pscNotificationId: selectedPscId,
              extensionDetails: {
                extensionReason: selectedOption,
                extensionStatus: "",
                extensionRequestDate: new Date().toISOString()
            }
        };

        return createPscExtension(request, transaction.id!, extension);
    }

    public isErrorResponse (obj: any): obj is ApiErrorResponse {
        return obj.httpStatusCode === HttpStatusCode.InternalServerError;
    }

}
