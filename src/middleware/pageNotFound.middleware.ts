import { Request, Response } from "express";
import { PageNotFoundHandler } from "../routers/handlers/error/pageNotFoundHandler";

export const pageNotFound = (req: Request, res: Response): void => {
    const handler = new PageNotFoundHandler();
    handler.executeGet(req, res).then((viewModel) => {
        const { templatePath, viewData } = viewModel;
        res.status(404).render(templatePath, viewData);
    });
};
