import { Request, Response, Router } from "express";
import { ExtensionAlreadySubmittedHandler } from "./handlers/extensionAlreadySubmittedHandler";
import { handleExceptions } from "../utils/asyncHandler";

const extensionAlreadySubmittedRouter: Router = Router();

extensionAlreadySubmittedRouter.get("/", handleExceptions(async (req: Request, res: Response) => {
    const handler = new ExtensionAlreadySubmittedHandler();
    const { templatePath, viewData } = await handler.executeGet(req, res);
    res.render(templatePath, viewData);
}));

export default extensionAlreadySubmittedRouter;
