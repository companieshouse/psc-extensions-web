import { NextFunction, Request, Response } from "express";
import { getUserEmail } from "../lib/utils/session.util";

export const templateMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    res.locals.userEmailAddress = getUserEmail(req.session);
    res.locals.currentUrl = req.originalUrl;
    next();
};
