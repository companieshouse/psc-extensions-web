import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "./abstractGenericHandler";
import { logger } from "../../lib/logger";
import { PATHS, ROUTER_VIEWS_FOLDER_PATH } from "../../lib/constants";

interface PscListData {
    pscId: string;
    pscCeasedOn?: string;
    pscKind?: string;
    pscName?: string;

}

interface IndividualPscListViewData extends BaseViewData {
    companyName: string;
    companyNumber: string;
    dsrEmailAddress: string;
    dsrPhoneNumber: string;
    idvImplementationDate: string;
    canVerifyNowDetails: PscListData[];
    canVerifyLaterDetails: PscListData[];
    verifiedPscDetails: PscListData[];
    exclusivelySuperSecure: boolean;
    selectedPscId: string | null;
    showNoPscsMessage: boolean;
    nextPageUrl: string | null;
}

export class ExtensionConfirmationHandler extends GenericHandler<IndividualPscListViewData> {

    protected override async getViewData (req: Request, res: Response): Promise<IndividualPscListViewData> {

        let templateName = "";
        if (req.originalUrl.includes(PATHS.FIRST_EXTENSION_CONFIRMATION)) {
            templateName = PATHS.FIRST_EXTENSION_CONFIRMATION.slice(1);
        } else if (req.originalUrl.includes(PATHS.SECOND_EXTENSION_CONFIRMATION)) {
            templateName = PATHS.SECOND_EXTENSION_CONFIRMATION.slice(1);
        }

        const baseViewData = await super.getViewData(req, res);
        const companyProfile = res.locals.companyProfile;
        const companyName = companyProfile?.companyName ?? "";
        const companyNumber = companyProfile?.companyNumber ?? "";
        return {
            ...baseViewData,
            templateName: templateName,
            companyName,
            companyNumber
        };

    }

    public async executeGet (req: Request, res: Response): Promise<ViewModel<IndividualPscListViewData>> {
        logger.info(`called to serve start page`);

        let templatePath = "";
        if (req.originalUrl.includes(PATHS.FIRST_EXTENSION_CONFIRMATION)) {
            templatePath = ROUTER_VIEWS_FOLDER_PATH + PATHS.FIRST_EXTENSION_CONFIRMATION;
        } else if (req.originalUrl.includes(PATHS.SECOND_EXTENSION_CONFIRMATION)) {
            templatePath = ROUTER_VIEWS_FOLDER_PATH + PATHS.SECOND_EXTENSION_CONFIRMATION;
        }

        return {
            templatePath: templatePath,
            viewData: await this.getViewData(req, res)
        };
    }
}
