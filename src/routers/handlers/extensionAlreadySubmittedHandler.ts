import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "./abstractGenericHandler";
import { logger } from "../../lib/logger";
import { SERVICE_PATH_PREFIX, PATHS, ROUTER_VIEWS_FOLDER_PATH } from "../../lib/constants";

export class ExtensionAlreadySubmittedHandler extends GenericHandler<BaseViewData> {

    protected override async getViewData (req: Request, res: Response): Promise<BaseViewData> {
        const baseViewData = await super.getViewData(req, res);
        return {
            ...baseViewData,
            backURL: SERVICE_PATH_PREFIX + PATHS.EXTENSION_CONFIRMATION
        };
    }

    public async executeGet (req: Request, res: Response): Promise<ViewModel<BaseViewData>> {
        logger.info(`called to serve start page`);
        return {
            templatePath: ROUTER_VIEWS_FOLDER_PATH + PATHS.EXTENSION_ALREADY_SUBMITTED,
            viewData: await this.getViewData(req, res)
        };
    }
}
