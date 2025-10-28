import { Request, Response, Router } from "express";
import { ReasonForExtensionHandler } from "./handlers/reasonForExtensionHandler";
import { handleExceptions } from "../utils/asyncHandler";

const reasonForExtensionRouter: Router = Router();

reasonForExtensionRouter.get("/", handleExceptions(async (req: Request, res: Response) => {
    const handler = new ReasonForExtensionHandler();
    const { templatePath, viewData } = await handler.executeGet(req, res);
    res.render(templatePath, viewData);
}));

reasonForExtensionRouter.post("/", handleExceptions(async (req: Request, res: Response) => {
    const handler = new ReasonForExtensionHandler();
    const result = await handler.executePost(req, res);
    if ("nextPageUrl" in result) {
        return res.redirect(result.nextPageUrl);
    }
    if ("templatePath" in result && "viewData" in result) {
        return res.render(result.templatePath, result.viewData);
    }
}));

export default reasonForExtensionRouter;
