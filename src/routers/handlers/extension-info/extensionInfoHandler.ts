import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "../generic";
import logger from "../../../lib/logger";
import { servicePathPrefix, Urls } from "../../../lib/constants";

export class ExtensionInfoHandler extends GenericHandler<BaseViewData> {

    public static templatePath = "router_views/extension-info/extension-info";

    public async getViewData (req: Request, res: Response): Promise<BaseViewData> {
        const baseViewData = await super.getViewData(req, res);

        return {
            ...baseViewData,
            backURL: servicePathPrefix + Urls.INDIVIDUAL_PSC_LIST,
            templateName: Urls.EXTENSION_INFO
        };
    }

    public async executeGet (req: Request, res: Response): Promise<ViewModel<BaseViewData>> {
        logger.info(`called to serve start page`);

        // ...process request here and return data for the view
        return {
            templatePath: ExtensionInfoHandler.templatePath,
            viewData: await this.getViewData(req, res)
        };
    }
}
