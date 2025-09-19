import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "./abstractGenericHandler";
import logger from "../../lib/logger";
import { PATHS, ROUTER_VIEWS_FOLDER_PATH } from "../../lib/constants";

export class ExtensionConfirmationHandler extends GenericHandler<BaseViewData> {

    protected override async getViewData (req: Request, res: Response): Promise<BaseViewData> {

        let templateName = "";
        if (req.originalUrl.includes(PATHS.FIRST_EXTENSION_CONFIRMATION)) {
            templateName = PATHS.FIRST_EXTENSION_CONFIRMATION.slice(1);
        } else if (req.originalUrl.includes(PATHS.SECOND_EXTENSION_CONFIRMATION)) {
            templateName = PATHS.SECOND_EXTENSION_CONFIRMATION.slice(1);
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
        if (req.originalUrl.includes(PATHS.FIRST_EXTENSION_CONFIRMATION)) {
            templatePath = ROUTER_VIEWS_FOLDER_PATH + PATHS.FIRST_EXTENSION_CONFIRMATION;
        } else if (req.originalUrl.includes(PATHS.SECOND_EXTENSION_CONFIRMATION)) {
            templatePath = ROUTER_VIEWS_FOLDER_PATH + PATHS.SECOND_EXTENSION_CONFIRMATION;
        }

        return {
            templatePath: templatePath,
            viewData: await this.getViewData(req, res)
        };
    }
}
