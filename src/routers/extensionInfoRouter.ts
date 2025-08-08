import { Request, Response, Router } from "express";
import { ExtensionInfoHandler } from "./handlers/extensionInfoHandler";
import { handleExceptions } from "../utils/asyncHandler";

const extensionInfoRouter: Router = Router();

extensionInfoRouter.get("/", handleExceptions(async (req: Request, res: Response) => {
    const handler = new ExtensionInfoHandler();
    const { templatePath, viewData } = await handler.executeGet(req, res);
    res.render(templatePath, viewData);
}));

export default extensionInfoRouter;
