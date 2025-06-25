import { Request, Response, Router, NextFunction } from "express";
import { ExtensionRefusedHandler } from "./handlers/extension-refused/extensionRefusedHandler";

const extensionRefusedRouter: Router = Router();

extensionRefusedRouter.get("/", async (req: Request, res: Response, _next: NextFunction) => {
    const handler = new ExtensionRefusedHandler();
    const { templatePath, viewData } = await handler.executeGet(req, res);
    res.render(templatePath, viewData);
});

export default extensionRefusedRouter;
