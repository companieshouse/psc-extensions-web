import { Request, Response, Router } from "express";
import { StopScreenHandler } from "./handlers/stopScreenHandler";
import { handleExceptions } from "../utils/asyncHandler";

const stopScreenRouter: Router = Router({ mergeParams: true });

stopScreenRouter.get("/", handleExceptions(async (req: Request, res: Response) => {
    const handler = new StopScreenHandler();
    const { templatePath, viewData } = await handler.executeGet(req, res);
    res.render(templatePath, viewData);
}));

export default stopScreenRouter;
