import { Request, Response, Router } from "express";
import { ExtensionRefusedHandler } from "./handlers/extensionRefusedHandler";
import { handleExceptions } from "../utils/asyncHandler";

const extensionRefusedRouter: Router = Router();

extensionRefusedRouter.get("/", handleExceptions(async (req: Request, res: Response) => {
    const handler = new ExtensionRefusedHandler();
    const { templatePath, viewData } = await handler.executeGet(req, res);
    res.render(templatePath, viewData);
}));

export default extensionRefusedRouter;
