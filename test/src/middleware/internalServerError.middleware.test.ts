/* eslint-disable import/first */

import { Request, Response } from "express";

const mockExecuteGet = jest.fn();

jest.mock("../../../src/routers/handlers/error/internalServerErrorHandler", () => ({
    InternalServerErrorHandler: jest.fn().mockImplementation(() => ({
        executeGet: mockExecuteGet
    }))
}));

import { internalServerError } from "../../../src/middleware/internalServerError.middleware";

describe("internalServerError middleware", () => {
    const TEMPLATE = "/500/template";
    const VIEW_DATA = { message: "internal error" };

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

    it("should set 500 status and render the returned template with viewData", async () => {
        mockExecuteGet.mockResolvedValueOnce({ templatePath: TEMPLATE, viewData: VIEW_DATA });

        internalServerError(req, res);

        await new Promise(process.nextTick);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.render).toHaveBeenCalledWith(TEMPLATE, VIEW_DATA);
        expect(mockExecuteGet).toHaveBeenCalledWith(req, res);
    });
});
