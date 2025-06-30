import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "../generic";
import logger from "../../../lib/Logger";
import { Urls } from "../../../lib/constants";

export class ExtensionRefusedHandler extends GenericHandler<BaseViewData> {

    public static templatePath = "router_views/extension-refused/extension-refused";

    public async getViewData (req: Request, res: Response): Promise<BaseViewData> {
        const baseViewData = await super.getViewData(req, res);

        return {
            ...baseViewData,
            // TODO: Add search params to backURL
            backURL: INDIVIDUAL_PSC_LIST,
            templateName: EXTENSION_REFUSED
        };
    }

    public async executeGet (req: Request, res: Response): Promise<ViewModel<BaseViewData>> {
        logger.info(`called to serve start page`);

        // ...process request here and return data for the view
        return {
            templatePath: ExtensionRefusedHandler.templatePath,
            viewData: await this.getViewData(req, res)
        };
    }
}
