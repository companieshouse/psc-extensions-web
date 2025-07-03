import { Request, Response, Router, NextFunction } from "express";
import { ExtensionInfoHandler } from "./handlers/extension-info/extensionInfoHandler";

const extensionInfoRouter: Router = Router();

extensionInfoRouter.get("/", async (req: Request, res: Response, _next: NextFunction) => {
    const handler = new ExtensionInfoHandler();
    const { templatePath, viewData } = await handler.executeGet(req, res);
    res.render(templatePath, viewData);
});

export default extensionInfoRouter;
