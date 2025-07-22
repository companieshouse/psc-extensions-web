import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "../generic";
import logger from "../../../lib/logger";
import { Urls } from "../../../lib/constants";

export class ExtensionConfirmationHandler extends GenericHandler<BaseViewData> {

    public static templatePath = "router_views/extension-confirmation/extension-confirmation";

    public async getViewData (req: Request, res: Response): Promise<BaseViewData> {
        const baseViewData = await super.getViewData(req, res);

        return {
            ...baseViewData,
            templateName: Urls.EXTENSION_CONFIRMATION
        };
    }

    public async executeGet (req: Request, res: Response): Promise<ViewModel<BaseViewData>> {
        logger.info(`called to serve start page`);

        // ...process request here and return data for the view
        return {
            templatePath: ExtensionConfirmationHandler.templatePath,
            viewData: await this.getViewData(req, res)
        };
    }
}
