import { Request, Response, Router } from "express";
import { RequestAnExtensionHandler } from "./handlers/requestAnExtensionHandler";
import { handleExceptions } from "../utils/asyncHandler";
import { addSearchParams } from "../utils/queryParams";
import { PREFIXEDURLS } from "../lib/constants";

const requestAnExtensionRouter: Router = Router();

requestAnExtensionRouter.get("/", handleExceptions(async (req: Request, res: Response) => {
    const handler = new RequestAnExtensionHandler();
    const { templatePath, viewData } = await handler.executeGet(req, res);
    res.render(templatePath, viewData);
}));

requestAnExtensionRouter.post("/", handleExceptions(async (req: Request, res: Response) => {
    const handler = new RequestAnExtensionHandler();
    const redirectUrl = await handler.executePost(req, res);
    res.redirect(redirectUrl);
}));

export default requestAnExtensionRouter;
