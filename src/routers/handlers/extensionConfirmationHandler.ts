import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "./abstractGenericHandler";
import logger from "../../lib/logger";
import { PATHS, ROUTER_VIEWS_FOLDER_PATH } from "../../lib/constants";

export class ExtensionConfirmationHandler extends GenericHandler<BaseViewData> {

    protected override async getViewData (req: Request, res: Response): Promise<BaseViewData> {

        let templateName = "";
        if (req.originalUrl.endsWith(PATHS.EXTENSION_CONFIRMATION_FIRST)) {
            templateName = PATHS.EXTENSION_CONFIRMATION_FIRST.slice(1);
        } else if (req.originalUrl.endsWith(PATHS.EXTENSION_CONFIRMATION_SECOND)) {
            templateName = PATHS.EXTENSION_CONFIRMATION_SECOND.slice(1);
        }

        const baseViewData = await super.getViewData(req, res);
        return {
            ...baseViewData,
            templateName: templateName
        };
    }

    public async executeGet (req: Request, res: Response): Promise<ViewModel<BaseViewData>> {
        logger.info(`called to serve start page`);

        let templatePath = "";
        if (req.originalUrl.endsWith(PATHS.EXTENSION_CONFIRMATION_FIRST)) {
            templatePath = ROUTER_VIEWS_FOLDER_PATH + PATHS.EXTENSION_CONFIRMATION_FIRST;
        } else if (req.originalUrl.endsWith(PATHS.EXTENSION_CONFIRMATION_SECOND)) {
            templatePath = ROUTER_VIEWS_FOLDER_PATH + PATHS.EXTENSION_CONFIRMATION_SECOND;
        }

        return {
            templatePath: templatePath,
            viewData: await this.getViewData(req, res)
        };
    }
}
