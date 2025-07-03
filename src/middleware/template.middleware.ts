import { NextFunction, Request, Response } from "express";
import { getUserEmail } from "../lib/utils/session.util";

export const templateMiddleware = (req: Request, res: Response, next: NextFunction) => {
    res.locals.userEmailAddress = getUserEmail(req.session);

    next();
};
