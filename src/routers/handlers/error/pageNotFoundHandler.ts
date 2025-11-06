import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "../abstractGenericHandler";
import logger from "../../../lib/logger";
import { ROUTER_VIEWS_FOLDER_PATH, PREFIXED_URLS } from "../../../lib/constants";
import { getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";

export class PageNotFoundHandler extends GenericHandler<BaseViewData> {

    public static readonly templatePath = ROUTER_VIEWS_FOLDER_PATH + "/error/page-not-found";

    protected override async getViewData (req: Request, res: Response): Promise<BaseViewData> {
        const baseViewData = await super.getViewData(req, res);
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();

        return {
            ...baseViewData,
            ...getLocaleInfo(locales, lang),
            backURL: null,
            templateName: PREFIXED_URLS.PAGE_NOT_FOUND.slice(1)
        };
    }

    public async executeGet (req: Request, res: Response): Promise<ViewModel<BaseViewData>> {
        logger.info(`${PageNotFoundHandler.name} - ${this.executeGet.name}: called to serve 404 error page`);

        return {
            templatePath: PageNotFoundHandler.templatePath,
            viewData: await this.getViewData(req, res)
        };
    }
}
