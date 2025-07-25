/* eslint-disable import/first */

jest.mock("@companieshouse/web-security-node");

import { authMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import { Request, Response } from "express";
import { authenticate } from "../../../src/middleware/authentication.middleware";

// get handle on mocked function and create mock function to be returned from calling authMiddleware
const mockAuthMiddleware = authMiddleware as jest.Mock;
const mockAuthReturnedFunction = jest.fn();

// when the mocked authMiddleware is called, make it return a mocked function so we can verify it gets called
mockAuthMiddleware.mockReturnValue(mockAuthReturnedFunction);

const URL = "/psc-extensions/something";
const req: Request = { originalUrl: URL } as Request;
const res: Response = {} as Response;
const next = jest.fn();

const expectedAuthMiddlewareConfig: AuthOptions = {
    chsWebUrl: "http://chsurl.co",
    returnUrl: URL
};

describe("authentication middleware", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        req.originalUrl = URL;
    });

    it("should call CH authentication library", () => {
        authenticate(req, res, next);
        expect(mockAuthMiddleware).toHaveBeenCalledWith(expectedAuthMiddlewareConfig);
        expect(mockAuthReturnedFunction).toHaveBeenCalledWith(req, res, next);
    });
});
