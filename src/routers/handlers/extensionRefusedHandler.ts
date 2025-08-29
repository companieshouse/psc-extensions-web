import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "./abstractGenericHandler";
import logger from "../../lib/logger";
import { SERVICE_PATH_PREFIX, PATHS, ROUTER_VIEWS_FOLDER_PATH } from "../../lib/constants";

export class ExtensionRefusedHandler extends GenericHandler<BaseViewData> {

    protected override async getViewData (req: Request, res: Response): Promise<BaseViewData> {
        const baseViewData = await super.getViewData(req, res);
        return {
            ...baseViewData,
            // TODO: Add search params to backURL
            backURL: SERVICE_PATH_PREFIX + PATHS.INDIVIDUAL_PSC_LIST,
            templateName: PATHS.EXTENSION_REFUSED.slice(1)
        };
    }

    public async executeGet (req: Request, res: Response): Promise<ViewModel<BaseViewData>> {
        logger.info(`called to serve start page`);
        return {
            templatePath: ROUTER_VIEWS_FOLDER_PATH + PATHS.EXTENSION_REFUSED,
            viewData: await this.getViewData(req, res)
        };
    }
}
