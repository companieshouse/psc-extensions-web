import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "./abstractGenericHandler";
import logger from "../../lib/logger";
import { PREFIXED_URLS, PATHS, ROUTER_VIEWS_FOLDER_PATH, EXTERNALURLS } from "../../lib/constants";
import { addSearchParams } from "../../utils/queryParams";
import { getLocaleInfo, getLocalesService, selectLang } from "../../utils/localise";
import { getCompanyProfile } from "../../services/companyProfileService";

interface PscViewData extends BaseViewData {
    companyName: string;
    companyNumber: string;
    selectedPscId: string;
    companyLookupUrl: string;
    differentPscInCompanyUrl: string | null;
}
export class ExtensionAlreadySubmittedHandler extends GenericHandler<PscViewData> {

    protected override async getViewData (req: Request, res: Response): Promise<PscViewData> {
        const baseViewData = await super.getViewData(req, res);
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const companyNumber = req.query.companyNumber as string;
        const selectedPscId = req.query.selectedPscId as string;
        const companyProfile = await getCompanyProfile(req, companyNumber);
        const forward = decodeURI(addSearchParams(EXTERNALURLS.COMPANY_LOOKUP_FORWARD, { companyNumber: "{companyNumber}", lang }));

        function resolveUrlTemplate (PREFIXEDURL: string): string | null {
            return addSearchParams(PREFIXEDURL, { companyNumber, selectedPscId, lang });
        }

        return {
            ...baseViewData,
            ...getLocaleInfo(locales, lang),
            selectedPscId: selectedPscId,
            companyName: companyProfile.companyName,
            companyNumber: companyProfile.companyNumber,
            backURL: resolveUrlTemplate(PREFIXED_URLS.FIRST_EXTENSION_CONFIRMATION),
            templateName: PATHS.EXTENSION_ALREADY_SUBMITTED.slice(1),
            companyLookupUrl: addSearchParams(EXTERNALURLS.COMPANY_LOOKUP, { forward }),
            differentPscInCompanyUrl: resolveUrlTemplate(PREFIXED_URLS.INDIVIDUAL_PSC_LIST)
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
