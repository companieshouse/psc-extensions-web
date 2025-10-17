import { Request, Response, Router } from "express";
import { ReasonForExtensionHandler } from "./handlers/reasonForExtensionHandler";
import { handleExceptions } from "../utils/asyncHandler";
import { PREFIXED_URLS } from "../lib/constants";
import { addSearchParams } from "../utils/queryParams";

const reasonForExtensionRouter: Router = Router();

reasonForExtensionRouter.get("/", handleExceptions(async (req: Request, res: Response) => {
    const handler = new ReasonForExtensionHandler();
    const { templatePath, viewData } = await handler.executeGet(req, res);
    res.render(templatePath, viewData);
}));

reasonForExtensionRouter.post("/", handleExceptions(async (req: Request, res: Response) => {
    const handler = new ReasonForExtensionHandler();
    const { templatePath, viewData } = await handler.executePost(req, res);

    if (viewData.errors && Object.keys(viewData.errors).length) {
        res.render(templatePath, viewData);
    } else {
        const companyNumber = req.query.companyNumber as string;
        const selectedPscId = req.query.selectedPscId as string;
        const lang = req.query.lang as string;
        res.redirect(addSearchParams(PREFIXED_URLS.FIRST_EXTENSION_CONFIRMATION, { companyNumber, selectedPscId, lang }));
    }
}));

export default reasonForExtensionRouter;
