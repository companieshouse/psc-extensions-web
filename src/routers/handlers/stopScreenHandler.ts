import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "./abstractGenericHandler";
import logger from "../../lib/logger";
import { PREFIXED_URLS, STOP_TYPE } from "../../lib/constants";

import { addSearchParams } from "../../utils/queryParams";
import { getUrlWithStopType } from "../../utils/url";
import { getLocaleInfo, getLocalesService } from "../../utils/localise";

interface StopScreenHandlerViewData extends BaseViewData {
    extraData?: string[];
}

export class StopScreenHandler extends GenericHandler<StopScreenHandlerViewData> {
    private static readonly templateBasePath = "router_views/stopScreen/";

    protected override async getViewData (req: Request, res: Response): Promise<StopScreenHandlerViewData> {
        const baseViewData = await super.getViewData(req, res);
        const stopType = req.params?.stopType as STOP_TYPE;

        return setContent(req, res, stopType, baseViewData);
    }

    public async executeGet (req: Request, res: Response): Promise<ViewModel<StopScreenHandlerViewData>> {
        logger.info(`called to serve start page`);
        const viewData = await this.getViewData(req, res);

        return {
            templatePath: StopScreenHandler.templateBasePath + req.params?.stopType,
            viewData
        };
    }
}

const setContent = async (req: Request, res: Response, stopType: STOP_TYPE, baseViewData: BaseViewData) => {

    const companyNumber = req.query.companyNumber as string;
    const selectedPscId = req.query.selectedPscId as string;
    const lang = res.locals.lang;
    const locales = getLocalesService();
    const companyProfile = res.locals.companyProfile;
    const companyName = companyProfile?.companyName;

    switch (stopType) {
        case STOP_TYPE.VERIFY_DEADLINE_PASSED: {
            return {
                ...baseViewData,
                ...getLocaleInfo(locales, lang),
                templateName: stopType,
                // FIXME:
                backURL: addSearchParams(resolveUrlTemplate(PREFIXED_URLS.INDIVIDUAL_PSC_LIST), { companyNumber, selectedPscId, lang }),
                extraData: [companyName]
            };
        }
        case STOP_TYPE.EXTENSION_LIMIT_EXCEEDED: {
            return {
                ...baseViewData,
                ...getLocaleInfo(locales, lang),
                templateName: stopType,
                backURL: addSearchParams(resolveUrlTemplate(PREFIXED_URLS.INDIVIDUAL_PSC_LIST), { companyNumber, selectedPscId, lang })
            };
        }
        default: {
            throw new Error("Unrecognised stop screen type: " + stopType);
        }

    }

    function resolveUrlTemplate (prefixedUrl: string, templateName?: STOP_TYPE): string {
        const url = templateName ? getUrlWithStopType(prefixedUrl, templateName) : prefixedUrl;

        return addSearchParams(url, { lang });
    }
};
