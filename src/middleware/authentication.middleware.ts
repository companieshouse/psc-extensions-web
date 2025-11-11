import { NextFunction, Request, Response } from "express";
import { AuthOptions, authMiddleware } from "@companieshouse/web-security-node";
import { env } from "../lib/constants";
import { handleExceptions } from "../utils/asyncHandler";

export const authenticate = handleExceptions(async (req: Request, res: Response, next: NextFunction) => {
    const authMiddlewareConfig: AuthOptions = {
        chsWebUrl: env.CHS_URL,
        returnUrl: req.originalUrl
    };
    return authMiddleware(authMiddlewareConfig)(req, res, next);
});
