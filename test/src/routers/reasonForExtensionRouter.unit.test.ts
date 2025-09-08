import { ReasonForExtensionHandler } from "../../../src/routers/handlers/reasonForExtensionHandler";
import { ExtensionReasons } from "../../../src/lib/constants";
import { Request, Response } from "express";

let req: Partial<Request>;
const res: Partial<Response> = {};

describe("Reason for extension handler", () => {

    describe("executePost", () => {

        it("should return no errors when form is valid", async () => {

            req = {
                body: { whyDoYouNeedAnExtension: ExtensionReasons.NEED_SUPPORT }
            };

            const handler = new ReasonForExtensionHandler();

            const result = await handler.executePost(req as Request, res as Response);

            expect(result.viewData.errors).toEqual({});
        });

        it("should return error object with correct errorkey when form is invalid", async () => {

            req = {
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
