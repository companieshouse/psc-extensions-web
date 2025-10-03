import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "./abstractGenericHandler";
import logger from "../../lib/logger";
import { PATHS, ROUTER_VIEWS_FOLDER_PATH } from "../../lib/constants";
import { getPscIndividual } from "../../services/pscIndividualService";
import { getCompanyProfile } from "../../services/companyProfileService";
import { getTransaction } from "../../services/transactionService";
import { PscExtensions } from "services/pscExtensionService";

interface PscViewData extends BaseViewData {
    referenceNumber: string;
    companyName: string;
    companyNumber: string;
    pscName: string;
    dateOfBirth: string;
    dueDate: string;
}

export class ExtensionConfirmationHandler extends GenericHandler<PscViewData> {

    protected override async getViewData (req: Request, res: Response): Promise<PscViewData> {
        const baseViewData = await super.getViewData(req, res);
        const pscExtensions: PscExtensions = res.locals.submission;
        const companyNumber = req.query.companyNumber as string;
        const selectedPscId = req.query.selectedPscId as string;
        // const transactionId = req.params.transactionId;
        // const dueDate = req.params.dueDate;
        const pscIndividual = await getPscIndividual(req, companyNumber, selectedPscId);
        const companyProfile = await getCompanyProfile(req, companyNumber);
        // const transactionReference = await getTransaction(req,transactionId )
        return {
            ...baseViewData,
            templateName: PATHS.FIRST_EXTENSION_CONFIRMATION.slice(1),
            pscName: pscIndividual.resource?.name!,
            companyName: companyProfile.companyName,
            companyNumber: companyProfile.companyNumber,
            // referenceNumber: transactionId,
            dueDate: pscExtensions.data?.extensionDetails.extensionRequestDate!
        };
    }

    public async executeGet (req: Request, res: Response): Promise<ViewModel<PscViewData>> {
        logger.info(`called to serve start page`);
        return {
            templatePath: ROUTER_VIEWS_FOLDER_PATH + PATHS.FIRST_EXTENSION_CONFIRMATION,
            viewData: await this.getViewData(req, res)
        };
    }
}
