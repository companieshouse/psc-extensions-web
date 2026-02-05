import { Request, Response, Router } from "express";
import { TooManyExtensionsHandler } from "./handlers/extensionLimitExceededHandler";
import { handleExceptions } from "../utils/asyncHandler";

const tooManyExtensionsRouter: Router = Router();

tooManyExtensionsRouter.get("/", handleExceptions(async (req: Request, res: Response) => {
    const handler = new TooManyExtensionsHandler();
    const { templatePath, viewData } = await handler.executeGet(req, res);
    res.render(templatePath, viewData);
}));

export default tooManyExtensionsRouter;
