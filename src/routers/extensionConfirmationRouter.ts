import { Request, Response, Router, NextFunction } from "express";
import { ExtensionConfirmationHandler } from "./handlers/extension-confirmation/extensionConfirmationHandler";
import { handleExceptions } from "../utils/asyncHandler";

const extensionConfirmationRouter: Router = Router();

extensionConfirmationRouter.get("/", handleExceptions(async (req: Request, res: Response, _next: NextFunction) => {
    const handler = new ExtensionConfirmationHandler();
    const { templatePath, viewData } = await handler.executeGet(req, res);
    res.render(templatePath, viewData);
}));

export default extensionConfirmationRouter;
