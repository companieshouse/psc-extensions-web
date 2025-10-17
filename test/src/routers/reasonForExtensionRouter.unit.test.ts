import { ReasonForExtensionHandler } from "../../../src/routers/handlers/reasonForExtensionHandler";
import { ExtensionReasons } from "../../../src/lib/constants";
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
describe("Reason for extension handler", () => {

    describe("executePost", () => {

        // it("should return no errors when form is valid", async () => {

        //     req = {
        //         query: {
        //             COMPANY_NUMBER,
        //             PSC_ID
        //         },
        //         body: { whyDoYouNeedAnExtension: ExtensionReasons.NEED_SUPPORT }
        //     };

        //     const handler = new ReasonForExtensionHandler();

        //     const result = await handler.executePost(req as Request, res as Response);

        //     expect(result.viewData.errors).toEqual({});
        // });

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

            expect(result.viewData.errors).toEqual({
                whyDoYouNeedAnExtension: {
                    summary: "reason_for_extension_error_message"
                }
            });
        });
    });
});
