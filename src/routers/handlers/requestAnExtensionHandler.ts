import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "./abstractGenericHandler";
import logger from "../../lib/logger";
import { SERVICE_PATH_PREFIX, PREFIXEDURLS, PATHS, ROUTER_VIEWS_FOLDER_PATH } from "../../lib/constants";
import { getLocaleInfo, getLocalesService, selectLang } from "../../utils/localise";
import { addSearchParams } from "../../utils/queryParams";
import { getPscIndividual } from "../../services/pscIndividualService";
import { getCompanyProfile } from "../../services/companyProfileService";

interface PscViewData extends BaseViewData {
    companyName: string;
    companyNumber: string;
    pscName: string;
    dateOfBirth: string;
    selectedPscId: string;
}

export function formatDateBorn (dateOfBirth: any): string {
    try {
        const formattedMonth = Intl.DateTimeFormat(dateOfBirth, { month: "long" }).format(new Date("" + dateOfBirth?.month));
        const formattedYear = dateOfBirth?.year?.toString() ?? "";
        return `${formattedMonth} ${formattedYear}`;
    } catch (error) {
        logger.error(`Error formatting date: ${error}`);
        return "Invalid date";
    }
}

export class RequestAnExtensionHandler extends GenericHandler<PscViewData> {

    protected override async getViewData (req: Request, res: Response): Promise<PscViewData> {
        const baseViewData = await super.getViewData(req, res);
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const companyNumber = req.query.companyNumber as string;
        const selectedPscId = req.query.selectedPscId as string;
        const pscIndividual = await getPscIndividual(req, companyNumber, selectedPscId);
        const companyProfile = await getCompanyProfile(req, companyNumber);
        if (!pscIndividual || !companyProfile) {
            throw new Error("Company profile or psc is not found");
        }

        function resolveUrlTemplate (PREFIXEDURL: string): string | null {
            return addSearchParams(PREFIXEDURL, { companyNumber, selectedPscId, lang });
        }

        return {
            ...baseViewData,
            ...getLocaleInfo(locales, lang),
            pscName: pscIndividual.resource?.name!,
            companyName: companyProfile.companyName,
            companyNumber: companyProfile.companyNumber,
            selectedPscId: selectedPscId,
            dateOfBirth: formatDateBorn(pscIndividual.resource?.dateOfBirth),
            backURL: resolveUrlTemplate(PREFIXEDURLS.INDIVIDUAL_PSC_LIST),
            templateName: PREFIXEDURLS.REQUEST_EXTENSION.slice(1)
        };
    }

    public async executeGet (req: Request, res: Response): Promise<ViewModel<BaseViewData>> {
        logger.info(`called to serve start page`);
        return {
            templatePath: ROUTER_VIEWS_FOLDER_PATH + PATHS.REQUEST_EXTENSION,
            viewData: await this.getViewData(req, res)
        };
    }

    public async executePost (req: Request, res: Response) {
        logger.info(`called`);
        const companyNumber = req.query.companyNumber as string;
        const selectedPscId = req.query.selectedPscId as string;
        const lang = selectLang(req.query.lang);
        return addSearchParams(PREFIXEDURLS.REASON_FOR_EXTENSION, { companyNumber, selectedPscId, lang });
    }
}
