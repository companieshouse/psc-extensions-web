import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "./abstractGenericHandler";
import logger from "../../lib/logger";
import { addSearchParams } from "../../utils/queryParams";
import { PATHS, ROUTER_VIEWS_FOLDER_PATH, EXTERNALURLS } from "../../lib/constants";
import { getPscIndividual } from "../../services/pscIndividualService";
import { getCompanyProfile } from "../../services/companyProfileService";
import { getLocaleInfo, getLocalesService, selectLang } from "../../utils/localise";

interface PscViewData extends BaseViewData {
    referenceNumber: string;
    companyName: string;
    companyNumber: string;
    pscName: string;
    dateOfBirth: string;
    dueDate: string;
    companyLookupUrl: string | null;
    differentPscInCompanyUrl: string | null;
}

export class ExtensionConfirmationHandler extends GenericHandler<PscViewData> {

    protected override async getViewData (req: Request, res: Response): Promise<PscViewData> {
        let templateName = "";
        if (req.originalUrl.includes(PATHS.FIRST_EXTENSION_CONFIRMATION)) {
            templateName = PATHS.FIRST_EXTENSION_CONFIRMATION.slice(1);
        } else if (req.originalUrl.includes(PATHS.SECOND_EXTENSION_CONFIRMATION)) {
            templateName = PATHS.SECOND_EXTENSION_CONFIRMATION.slice(1);
        }

        const baseViewData = await super.getViewData(req, res);
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const companyNumber = req.query.companyNumber as string;
        const selectedPscId = req.query.selectedPscId as string;
        const pscIndividual = await getPscIndividual(req, companyNumber, selectedPscId);
        const companyProfile = await getCompanyProfile(req, companyNumber);
        const forward = decodeURI(addSearchParams(EXTERNALURLS.COMPANY_LOOKUP_FORWARD, { companyNumber: "{companyNumber}", lang }));

        function resolveUrlTemplate (PREFIXEDURL: string): string | null {
            return addSearchParams(PREFIXEDURL, { companyNumber, lang });
        }
        return {
            ...baseViewData,
            ...getLocaleInfo(locales, lang),
            templateName: templateName,
            pscName: pscIndividual.resource?.name!,
            companyName: companyProfile.companyName,
            companyNumber: companyProfile.companyNumber,
            companyLookupUrl: addSearchParams(EXTERNALURLS.COMPANY_LOOKUP, { forward }),
            differentPscInCompanyUrl: resolveUrlTemplate(PATHS.INDIVIDUAL_PSC_LIST)

        };
    }

    public async executeGet (req: Request, res: Response): Promise<ViewModel<PscViewData>> {
        logger.info(`called to serve start page`);

        return {
            templatePath: ROUTER_VIEWS_FOLDER_PATH + PATHS.EXTENSION_CONFIRMATION,
            viewData: await this.getViewData(req, res)
        };
    }
}
