import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "./abstractGenericHandler";
import logger from "../../lib/logger";
import { SERVICE_PATH_PREFIX, PATHS, ROUTER_VIEWS_FOLDER_PATH, ExtensionReasons } from "../../lib/constants";
import { PscExtensionsFormsValidator } from "../../lib/validation/form-validators/pscExtensions";
import { getPscIndividual } from "../../services/pscIndividualService";
import { formatDateBorn } from "../handlers/requestAnExtensionHandler";

interface ExtensionReasonViewData extends BaseViewData {
    reasons: typeof ExtensionReasons;
    pscName: string;
    dateOfBirth: string;
    selectedPscId: string;
    companyNumber: string;
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
        }
        return {
            templatePath: ROUTER_VIEWS_FOLDER_PATH + PATHS.REASON_FOR_EXTENSION,
            viewData
        };

    }

}
