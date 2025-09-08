import { Request, Response, Router } from "express";
import { ReasonForExtensionHandler } from "./handlers/reasonForExtensionHandler";
import { handleExceptions } from "../utils/asyncHandler";
import { PATHS, SERVICE_PATH_PREFIX } from "../lib/constants";

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
        res.redirect(SERVICE_PATH_PREFIX + PATHS.EXTENSION_CONFIRMATION);
    }

}));

export default reasonForExtensionRouter;
