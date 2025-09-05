import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "./abstractGenericHandler";
import logger from "../../lib/logger";
import { SERVICE_PATH_PREFIX, PATHS, ROUTER_VIEWS_FOLDER_PATH } from "../../lib/constants";
import { PscExtensionsFormsValidator } from "../../lib/validation/form-validators/pscExtensions";

export const EXTENSION_REASONS = ["reason_for_extension_1", "reason_for_extension_2", "reason_for_extension_3", "reason_for_extension_4", "reason_for_extension_5", "reason_for_extension_6"];

export class ReasonForExtensionHandler extends GenericHandler<BaseViewData> {

    protected override async getViewData (req: Request, res: Response): Promise<BaseViewData> {
        const baseViewData = await super.getViewData(req, res);
        return {
            ...baseViewData,
            backURL: SERVICE_PATH_PREFIX + PATHS.EXTENSION_INFO,
            templateName: PATHS.REASON_FOR_EXTENSION.slice(1)
        };
    }

    public async executeGet (req: Request, res: Response): Promise<ViewModel<BaseViewData>> {
        logger.info(`called to serve start page`);
        return {
            templatePath: ROUTER_VIEWS_FOLDER_PATH + PATHS.REASON_FOR_EXTENSION,
            viewData: await this.getViewData(req, res)
        };
    }

    public async executePost (req: Request, res: Response): Promise<ViewModel<BaseViewData>> {

        const viewData = await this.getViewData(req, res);
        const selectedOption = req.body.whyDoYouNeedAnExtension;
        const validator = new PscExtensionsFormsValidator();
        const errorKey: string | null = validator.validateExtensionReason(selectedOption);

        if (errorKey) {
            viewData.errors = { whyDoYouNeedAnExtension: { summary: errorKey } };
        }
        return {
            templatePath: ROUTER_VIEWS_FOLDER_PATH + PATHS.REASON_FOR_EXTENSION,
            viewData
        };

    }

}
