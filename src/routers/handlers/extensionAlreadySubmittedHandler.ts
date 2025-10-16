import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "./abstractGenericHandler";
import logger from "../../lib/logger";
import { SERVICE_PATH_PREFIX, PREFIXEDURLS, PATHS, ROUTER_VIEWS_FOLDER_PATH } from "../../lib/constants";
import { getCompanyProfile } from "../../services/companyProfileService";

interface PscViewData extends BaseViewData {
    companyName: string;
    companyNumber: string;
    selectedPscId: string;
}
export class ExtensionAlreadySubmittedHandler extends GenericHandler<PscViewData> {

    protected override async getViewData (req: Request, res: Response): Promise<PscViewData> {
        const baseViewData = await super.getViewData(req, res);
        const companyNumber = req.query.companyNumber as string;
        const selectedPscId = req.query.selectedPscId as string;
        const companyProfile = await getCompanyProfile(req, companyNumber);

        return {
            ...baseViewData,
            backURL: PREFIXEDURLS.FIRST_EXTENSION_CONFIRMATION + "?companyNumber=" + companyNumber + "&selectedPscId=" + selectedPscId + "%3F",
            templateName: PATHS.EXTENSION_ALREADY_SUBMITTED.slice(1),
            selectedPscId: selectedPscId,
            companyName: companyProfile.companyName,
            companyNumber: companyProfile.companyNumber
        };
    }

    public async executeGet (req: Request, res: Response): Promise<ViewModel<PscViewData>> {
        logger.info(`called to serve start page`);
        return {
            templatePath: ROUTER_VIEWS_FOLDER_PATH + PATHS.EXTENSION_ALREADY_SUBMITTED,
            viewData: await this.getViewData(req, res)
        };
    }
}
