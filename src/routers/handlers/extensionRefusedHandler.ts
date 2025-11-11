import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "./abstractGenericHandler";
import logger from "../../lib/logger";
import { PATHS, PREFIXED_URLS, ROUTER_VIEWS_FOLDER_PATH } from "../../lib/constants";
import { getPscIndividual } from "../../services/pscIndividualService";
import { formatDateBorn } from "../../utils/date";
import { getLocaleInfo, getLocalesService, selectLang } from "../../utils/localise";

import { addSearchParams } from "../../utils/queryParams";

interface PscViewData extends BaseViewData {
    referenceNumber: string;
    pscName: string;
    dateOfBirth: string;
}

export class ExtensionRefusedHandler extends GenericHandler<PscViewData> {

    protected override async getViewData (req: Request, res: Response): Promise<PscViewData> {
        const baseViewData = await super.getViewData(req, res);
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const companyNumber = req.query.companyNumber as string;
        const selectedPscId = req.query.selectedPscId as string;
        const pscIndividual = await getPscIndividual(req, companyNumber, selectedPscId);

        function resolveUrlTemplate (PREFIXEDURL: string): string | null {
            return addSearchParams(PREFIXEDURL, { companyNumber, selectedPscId, lang });
        }
        return {
            ...baseViewData,
            ...getLocaleInfo(locales, lang),
            pscName: pscIndividual.resource?.name!,
            dateOfBirth: formatDateBorn(pscIndividual.resource?.dateOfBirth, selectLang(req.query.lang)),
            backURL: resolveUrlTemplate(PREFIXED_URLS.INDIVIDUAL_PSC_LIST),
            templateName: PREFIXED_URLS.EXTENSION_REFUSED.slice(1)
        };
    }

    public async executeGet (req: Request, res: Response): Promise<ViewModel<PscViewData>> {
        logger.info(`called to serve start page`);
        return {
            templatePath: ROUTER_VIEWS_FOLDER_PATH + PATHS.EXTENSION_REFUSED,
            viewData: await this.getViewData(req, res)
        };
    }
}
