/* eslint-disable import/first */

import { Request, Response } from "express";

const mockExecuteGet = jest.fn();

jest.mock("../../../src/routers/handlers/error/pageNotFoundHandler", () => ({
    PageNotFoundHandler: jest.fn().mockImplementation(() => ({
        executeGet: mockExecuteGet
    }))
}));

import { pageNotFound } from "../../../src/middleware/pageNotFound.middleware";

describe("pageNotFound middleware", () => {
    const TEMPLATE = "/some/template";
    const VIEW_DATA = { message: "not found" };

    let req: Request;
    let res: Response & { status: jest.Mock; render: jest.Mock };

    beforeEach(() => {
        jest.clearAllMocks();

        req = {} as Request;

        res = {
            status: jest.fn().mockReturnThis(),
            render: jest.fn()
        } as unknown as Response & { status: jest.Mock; render: jest.Mock };
    });

    it("should set 404 status and render the returned template with viewData", async () => {
        mockExecuteGet.mockResolvedValueOnce({ templatePath: TEMPLATE, viewData: VIEW_DATA });

        pageNotFound(req, res);

        await new Promise(process.nextTick);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.render).toHaveBeenCalledWith(TEMPLATE, VIEW_DATA);
        expect(mockExecuteGet).toHaveBeenCalledWith(req, res);
    });
});
