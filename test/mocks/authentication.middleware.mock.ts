import { NextFunction, Request, Response } from "express";
import {  authenticate } from "../../src/middleware/authentication.middleware";

jest.mock("../../src/middleware/authentication.middleware");

// get handle on mocked function
const mockAuthenticationMiddleware = authenticate as jest.Mock;

// tell the mock what to return
mockAuthenticationMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next());

export default mockAuthenticationMiddleware;