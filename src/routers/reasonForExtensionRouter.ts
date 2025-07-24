import { Request, Response, Router, NextFunction } from "express";
import { ReasonForExtensionHandler } from "./handlers/reason-for-extension/reasonForExtensionHandler";
import { handleExceptions } from "../utils/asyncHandler";

const reasonForExtensionRouter: Router = Router();

reasonForExtensionRouter.get("/", handleExceptions(async (req: Request, res: Response, _next: NextFunction) => {
    const handler = new ReasonForExtensionHandler();
    const { templatePath, viewData } = await handler.executeGet(req, res);
    res.render(templatePath, viewData);
}));

export default reasonForExtensionRouter;
