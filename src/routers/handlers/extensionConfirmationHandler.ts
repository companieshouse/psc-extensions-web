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

        const baseViewData = await super.getViewData(req, res);
        const companyProfile = res.locals.companyProfile;
        const companyName = companyProfile?.companyName ?? "";
        const companyNumber = "111111111";
        return {
            ...baseViewData,
            templateName: PATHS.EXTENSION_CONFIRMATION.slice(1),
            companyName,
            companyNumber
        };

    }

    public async executeGet (req: Request, res: Response): Promise<ViewModel<IndividualPscListViewData>> {
        logger.info(`called to serve start page`);
        return {
            templatePath: ROUTER_VIEWS_FOLDER_PATH + PATHS.EXTENSION_CONFIRMATION,
            viewData: await this.getViewData(req, res)
        };
    }
}
