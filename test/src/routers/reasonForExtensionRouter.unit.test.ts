import { ReasonForExtensionHandler } from "../../../src/routers/handlers/reasonForExtensionHandler";
import { EXTENSION_REASONS } from "../../../src/lib/constants";
import { Request, Response } from "express";
import { HttpStatusCode } from "axios";
import { COMPANY_NUMBER, PSC_ID, PSC_INDIVIDUAL } from "../../mocks/psc.mock";

let req: Partial<Request>;
const res: Partial<Response> = {};

jest.mock("../../../src/services/pscIndividualService", () => ({
    getPscIndividual: () => ({
        httpStatusCode: HttpStatusCode.Ok,
        resource: PSC_INDIVIDUAL,
        COMPANY_NUMBER,
        PSC_ID
    })
}));
jest.mock("../../../src/services/transactionService", () => ({
    postTransaction: jest.fn().mockResolvedValue({ id: "11111-22222-33333" }),
    getTransaction: jest.fn().mockResolvedValue({ id: "11111-22222-33333" })

}));
jest.mock("../../../src/services/pscExtensionService", () => ({
    createPscExtension: jest.fn().mockResolvedValue({
        resource: {
            links: { self: "persons-with-significant-control-extension/11111-22222-33333" }
        }
    })
}));

describe("Reason for extension handler", () => {

    describe("executePost", () => {

        it("should return no errors when form is valid", async () => {

            req = {
                query: {
                    companyNumber: COMPANY_NUMBER,
                    selectedPscId: PSC_ID
                },
                body: { whyDoYouNeedAnExtension: EXTENSION_REASONS.NEED_SUPPORT }
            };
            const res = {
                redirect: jest.fn()
            } as unknown as Response;

            const handler = new ReasonForExtensionHandler();

            const result = await handler.executePost(req as Request, res as Response);

            expect(res.redirect).toHaveBeenCalled();

            expect(result).toBeUndefined();
        });

        it("should return error object with correct errorkey when form is invalid", async () => {

            req = {
                query: {
                    COMPANY_NUMBER,
                    PSC_ID
                },
                body: {}
            };

            const handler = new ReasonForExtensionHandler();

            const result = await handler.executePost(req as Request, res as Response);

            expect(result?.viewData.errors).toEqual({
                whyDoYouNeedAnExtension: {
                    summary: "reason_for_extension_error_message"
                }
            });
        });
    });
});
