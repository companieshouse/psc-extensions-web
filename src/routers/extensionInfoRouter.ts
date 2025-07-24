import { Request, Response, Router, NextFunction } from "express";
import { ExtensionInfoHandler } from "./handlers/extension-info/extensionInfoHandler";
import { handleExceptions } from "../utils/asyncHandler";

const extensionInfoRouter: Router = Router();

extensionInfoRouter.get("/", handleExceptions(async (req: Request, res: Response, _next: NextFunction) => {
    const handler = new ExtensionInfoHandler();
    const { templatePath, viewData } = await handler.executeGet(req, res);
    res.render(templatePath, viewData);
}));

export default extensionInfoRouter;
