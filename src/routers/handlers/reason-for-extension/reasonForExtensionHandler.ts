import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "../generic";
import logger from "../../../lib/Logger";
import { servicePathPrefix, Urls } from "../../../lib/constants";

export class ReasonForExtensionHandler extends GenericHandler<BaseViewData> {

    public static templatePath = "router_views/reason-for-extension/reason-for-extension";

    public async getViewData (req: Request, res: Response): Promise<BaseViewData> {
        const baseViewData = await super.getViewData(req, res);

        return {
            ...baseViewData,
            backURL: servicePathPrefix + Urls.EXTENSION_INFO,
            templateName: Urls.REASON_FOR_EXTENSION
        };
    }

    public async executeGet (req: Request, res: Response): Promise<ViewModel<BaseViewData>> {
        logger.info(`called to serve start page`);

        // ...process request here and return data for the view
        return {
            templatePath: ReasonForExtensionHandler.templatePath,
            viewData: await this.getViewData(req, res)
        };
    }
}
