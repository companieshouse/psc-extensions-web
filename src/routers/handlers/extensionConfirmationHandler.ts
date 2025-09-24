import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "./abstractGenericHandler";
import logger from "../../lib/logger";
import { PATHS, ROUTER_VIEWS_FOLDER_PATH } from "../../lib/constants";

export class ExtensionConfirmationHandler extends GenericHandler<BaseViewData> {

    protected override async getViewData (req: Request, res: Response): Promise<BaseViewData> {
        const baseViewData = await super.getViewData(req, res);
        return {
            ...baseViewData,
            templateName: PATHS.FIRST_EXTENSION_CONFIRMATION.slice(1)
        };
    }

    public async executeGet (req: Request, res: Response): Promise<ViewModel<BaseViewData>> {
        logger.info(`called to serve start page`);
        return {
            templatePath: ROUTER_VIEWS_FOLDER_PATH + PATHS.FIRST_EXTENSION_CONFIRMATION,
            viewData: await this.getViewData(req, res)
        };
    }
}
