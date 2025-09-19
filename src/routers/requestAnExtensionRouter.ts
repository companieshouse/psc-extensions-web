import { Request, Response, Router } from "express";
import { RequestAnExtensionHandler } from "./handlers/requestAnExtensionHandler";
import { handleExceptions } from "../utils/asyncHandler";

const requestAnExtensionRouter: Router = Router();

requestAnExtensionRouter.get("/", handleExceptions(async (req: Request, res: Response) => {
    const handler = new RequestAnExtensionHandler();
    const { templatePath, viewData } = await handler.executeGet(req, res);
    res.render(templatePath, viewData);
}));

export default requestAnExtensionRouter;
