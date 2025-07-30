import { Request, Response, Router, NextFunction } from "express";
import { ExtensionAlreadySubmittedHandler } from "./handlers/extension-already-submitted/extensionAlreadySubmittedHandler";
import { handleExceptions } from "../utils/asyncHandler";

const extensionAlreadySubmittedRouter: Router = Router();

extensionAlreadySubmittedRouter.get("/", handleExceptions(async (req: Request, res: Response, _next: NextFunction) => {
    const handler = new ExtensionAlreadySubmittedHandler();
    const { templatePath, viewData } = await handler.executeGet(req, res);
    res.render(templatePath, viewData);
}));

export default extensionAlreadySubmittedRouter;
