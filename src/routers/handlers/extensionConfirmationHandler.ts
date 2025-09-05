import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "./abstractGenericHandler";
import { logger } from "../../lib/logger";
import { PATHS, ROUTER_VIEWS_FOLDER_PATH } from "../../lib/constants";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { PersonWithSignificantControl } from "@companieshouse/api-sdk-node/dist/services/psc/types";
import { getCompanyProfile } from "services/companyProfileService";
import { getIndividualPscDetails } from "services/pscIndividualService";

interface ConfirmCompanyViewData extends BaseViewData {
    company: CompanyProfile;
}

export class ExtensionConfirmationHandler extends GenericHandler<ConfirmCompanyViewData> {

    protected override async getViewData (req: Request, res: Response): Promise<ConfirmCompanyViewData> {

        const baseViewData = await super.getViewData(req, res);
        const companyNumber = req.query.companyNumber as string;

        //  const companyProfile: CompanyProfile = await getCompanyProfile(req, companyNumber);
        // const company = companyProfile;
        return {
            ...baseViewData
            // company: companyProfile
        };

    }

    public async executeGet (req: Request, res: Response): Promise<ViewModel<ConfirmCompanyViewData>> {
        logger.info(`called to serve start page`);
        return {
            templatePath: ROUTER_VIEWS_FOLDER_PATH + PATHS.EXTENSION_CONFIRMATION,
            viewData: await this.getViewData(req, res)
        };
    }
}
