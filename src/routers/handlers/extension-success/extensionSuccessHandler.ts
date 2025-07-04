import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "../generic";
import logger from "../../../lib/Logger";
import { Urls } from "../../../lib/constants";

export class ExtensionSuccessHandler extends GenericHandler<BaseViewData> {

    public static templatePath = "router_views/extension-success/extension-success";

    public async getViewData (req: Request, res: Response): Promise<BaseViewData> {
        const baseViewData = await super.getViewData(req, res);

        return {
            ...baseViewData,
            // TODO: Add search params to backURL
            backURL: Urls.INDIVIDUAL_PSC_LIST,
            templateName: Urls.EXTENSION_SUCCESS
        };
    }

    public async executeGet (req: Request, res: Response): Promise<ViewModel<BaseViewData>> {
        logger.info(`called to serve start page`);

        // ...process request here and return data for the view
        return {
            templatePath: ExtensionSuccessHandler.templatePath,
            viewData: await this.getViewData(req, res)
        };
    }
}