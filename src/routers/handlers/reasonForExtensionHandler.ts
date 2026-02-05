import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "./abstractGenericHandler";
import logger from "../../lib/logger";
import { EXTENSION_REASONS, EXTENSION_STATUS, PATHS, PREFIXED_URLS, ROUTER_VIEWS_FOLDER_PATH, STOP_TYPE } from "../../lib/constants";
import { PscExtensionsFormsValidator } from "../../lib/validation/form-validators/pscExtensions";
import { getLocaleInfo, getLocalesService, selectLang } from "../../utils/localise";
import { addSearchParams } from "../../utils/queryParams";
import { getPscIndividual } from "../../services/pscIndividualService";
import { formatDateBorn } from "../../utils/date";
import { createPscExtension, getPscExtensionCount } from "../../services/pscExtensionService";
import { PscExtension, PscExtensionData } from "@companieshouse/api-sdk-node/dist/services/psc-extensions-link/types";
import { Resource } from "@companieshouse/api-sdk-node";
import { ApiErrorResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { Transaction } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import { HttpStatusCode } from "axios";
import { closeTransaction, postTransaction } from "../../services/transactionService";
import { getUserEmail } from "../../lib/utils/session.util";
import { getUrlWithStopType } from "../../utils/url";

interface ExtensionReasonViewData extends BaseViewData {
    reasons: typeof EXTENSION_REASONS;
    pscName: string;
    dateOfBirth: string;
    selectedPscId: string;
    companyNumber: string;
}

export class ReasonForExtensionHandler extends GenericHandler<BaseViewData> {

    protected override async getViewData (req: Request, res: Response): Promise<ExtensionReasonViewData> {

        const baseViewData = await super.getViewData(req, res);
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const selectedPscId = req.query.selectedPscId as string;
        const companyNumber = req.query.companyNumber as string;
        const pscIndividual = await getPscIndividual(req, companyNumber, selectedPscId);

        function resolveUrlTemplate (PREFIXEDURL: string): string | null {
            return addSearchParams(PREFIXEDURL, { companyNumber, selectedPscId, lang });
        }

        return {
            ...baseViewData,
            ...getLocaleInfo(locales, lang),
            pscName: pscIndividual.resource?.name!,
            dateOfBirth: formatDateBorn(pscIndividual.resource?.dateOfBirth, selectLang(req.query.lang)),
            selectedPscId,
            companyNumber,
            backURL: resolveUrlTemplate(PREFIXED_URLS.REQUEST_EXTENSION),
            templateName: PREFIXED_URLS.REASON_FOR_EXTENSION.slice(1),
            reasons: EXTENSION_REASONS
        };
    }

    public async executeGet (req: Request, res: Response): Promise<ViewModel<ExtensionReasonViewData>> {
        logger.info(`called to serve start page`);
        return {
            templatePath: ROUTER_VIEWS_FOLDER_PATH + PATHS.REASON_FOR_EXTENSION,
            viewData: await this.getViewData(req, res)
        };
    }

    public async executePost (req: Request, res: Response): Promise<ViewModel<ExtensionReasonViewData> | { nextPageUrl: string }> {
        const viewData = await this.getViewData(req, res);
        const extensionReason = req.body?.whyDoYouNeedAnExtension;
        const validator = new PscExtensionsFormsValidator();
        const errorKey: string | null = validator.validateExtensionReason(extensionReason);

        if (errorKey) {
            logger.error("Validation failed, rendering error page");
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
        const id = transaction.id as string;

        const companyNumber = req.query.companyNumber as string;
        const selectedPscId = req.query.selectedPscId as string;
        const lang = req.query.lang as string;

        await closeTransaction(req, transaction.id!, selectedPscId);
        const extensionCount = await getPscExtensionCount(req, selectedPscId);

        if (this.isErrorResponse(resource)) {

            const nextPageUrl = addSearchParams(getUrlWithStopType(PREFIXED_URLS.STOP_SCREEN, STOP_TYPE.VERIFY_DEADLINE_PASSED), { companyNumber, selectedPscId });

            return { nextPageUrl };

        } else {
            const pscExtension = resource.resource;
            logger.info(`CREATED New Resource ${pscExtension?.links.self}`);

            const confirmationUrl =
            extensionCount > 1
                ? PREFIXED_URLS.SECOND_EXTENSION_CONFIRMATION
                : PREFIXED_URLS.FIRST_EXTENSION_CONFIRMATION;

            // set up redirect to confirmation screen
            const nextPageUrl = addSearchParams(confirmationUrl, { companyNumber, selectedPscId, id, lang });

            return { nextPageUrl };
        }

    }

    public async createNewSubmission (request: Request, transaction: Transaction): Promise<Resource<PscExtension> | ApiErrorResponse> {

        const selectedPscId = request.query.selectedPscId as string;
        const companyNumber = request.query.companyNumber as string;
        const extensionReason = request.body?.whyDoYouNeedAnExtension;

        const extensionStatus = EXTENSION_STATUS.ACCEPTED;

        const extension: PscExtensionData = {
            companyNumber,
            pscNotificationId: selectedPscId,
            requesterEmail: getUserEmail(request.session),
            extensionDetails: {
                extensionReason,
                extensionStatus,
                extensionRequestDate: new Date().toISOString()
            }
        };

        const response = await createPscExtension(request, transaction.id!, extension);

        if (this.isErrorResponse(response)) {
            extension.extensionDetails!.extensionStatus = EXTENSION_STATUS.PENDING;
        }

        return response;

    }

    public isErrorResponse (obj: any): obj is ApiErrorResponse {
        return obj.httpStatusCode === HttpStatusCode.InternalServerError;
    }

}