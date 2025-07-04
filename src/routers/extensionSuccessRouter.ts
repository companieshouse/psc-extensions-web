import { Request, Response, Router, NextFunction } from "express";
import { ExtensionSuccessHandler } from "./handlers/extension-success/extensionSuccessHandler";

const extensionSuccessHandler: Router = Router();

extensionSuccessHandler.get("/", async (req: Request, res: Response, _next: NextFunction) => {
    const handler = new ExtensionSuccessHandler();
    const { templatePath, viewData } = await handler.executeGet(req, res);
    res.render(templatePath, viewData);
});

export default extensionSuccessHandler;