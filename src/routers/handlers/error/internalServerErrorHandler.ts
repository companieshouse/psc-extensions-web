import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "../abstractGenericHandler";
import logger from "../../../lib/logger";
import { PREFIXED_URLS, ROUTER_VIEWS_FOLDER_PATH } from "../../../lib/constants";
import { getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";

export class InternalServerErrorHandler extends GenericHandler<BaseViewData> {

    public static readonly templatePath = ROUTER_VIEWS_FOLDER_PATH + "/error/internal-server-error";

    protected override async getViewData (req: Request, res: Response): Promise<BaseViewData> {
        const baseViewData = await super.getViewData(req, res);
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();

        return {
            ...baseViewData,
            ...getLocaleInfo(locales, lang),
            backURL: null,
            templateName: PREFIXED_URLS.INTERNAL_SERVER_ERROR.slice(1)
        };
    }

    public async executeGet (req: Request, res: Response): Promise<ViewModel<BaseViewData>> {
        logger.info(`${InternalServerErrorHandler.name} - ${this.executeGet.name}: called to serve 500 error page`);

        return {
            templatePath: InternalServerErrorHandler.templatePath,
            viewData: await this.getViewData(req, res)
        };
    }
}
