import { Request, Response, NextFunction } from "express";

const mockValidationMiddleware = jest.fn((req: Request, res: Response, next: NextFunction) => {
    return next();
});

jest.mock("../../src/middleware/is.valid.extension.middleware", () => {
    return {
        validateExtensionRequest: mockValidationMiddleware
    };
});

export default mockValidationMiddleware;
