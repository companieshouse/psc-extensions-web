import { Request, Response } from "express";
import { InternalServerErrorHandler } from "../routers/handlers/error/internalServerErrorHandler";

export const internalServerError = (req: Request, res: Response): void => {

    const handler = new InternalServerErrorHandler();
    handler.executeGet(req, res).then((viewModel) => {
        const { templatePath, viewData } = viewModel;
        res.status(500).render(templatePath, viewData);
    });
};
