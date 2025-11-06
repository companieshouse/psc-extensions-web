import { HttpStatusCode } from "axios";
import { PATHS, ROUTER_VIEWS_FOLDER_PATH } from "../../../../src/lib/constants";
import { ExtensionConfirmationHandler } from "../../../../src/routers/handlers/extensionConfirmationHandler";
import { PSC_INDIVIDUAL } from "../../../mocks/psc.mock";

class TestableExtensionConfirmationHandler extends ExtensionConfirmationHandler {
    public exposeGetViewData (req: any, res: any) {
        return this.getViewData(req, res);
    }

    public executeGetWithAnyTypeArgs (req: any, res: any) {
        return this.executeGet(req, res);
    }
}

jest.mock("../../../../src/services/pscIndividualService", () => ({
    getPscIndividual: () => ({
        httpStatusCode: HttpStatusCode.Ok,
        resource: PSC_INDIVIDUAL
    })
}));

jest.mock("../../../../src/services/companyProfileService", () => ({
    getCompanyProfile: () => ({
        httpStatusCode: HttpStatusCode.Ok,
        resource: {
            companyName: "The Company",
            companyNumber: "12345"
        }
    })
}));

jest.mock("../../../../src/services/pscExtensionService", () => ({
    getPscExtensionCount: (): Promise<number> => Promise.resolve(1)
}));

describe("ExtensionConfirmationHandler", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getViewData", () => {
        it("should return baseViewData with first extension confirmation template name", async () => {
            const handler = new TestableExtensionConfirmationHandler();
            const req = {
                originalUrl: PATHS.FIRST_EXTENSION_CONFIRMATION,
                query: {
                    companyNumber: "12345",
                    selectedPscId: "123"
                }
            };

            const res = {};
            const result = handler.exposeGetViewData(req, res);

            expect((await result).templateName).toBe(PATHS.FIRST_EXTENSION_CONFIRMATION.slice(1));
        });

        it("should return baseViewData with second extension confirmation template name", async () => {
            const handler = new TestableExtensionConfirmationHandler();
            const req = {
                originalUrl: PATHS.SECOND_EXTENSION_CONFIRMATION,
                query: {
                    companyNumber: "12345",
                    selectedPscId: "123"
                }
            };

            const res = {};
            const result = handler.exposeGetViewData(req, res);

            expect((await result).templateName).toBe(PATHS.SECOND_EXTENSION_CONFIRMATION.slice(1));
        });
    });

    describe("executeGet", () => {
        it("should return template path and viewData for first extension confirmation", async () => {
            const handler = new TestableExtensionConfirmationHandler();
            const req = {
                originalUrl: PATHS.FIRST_EXTENSION_CONFIRMATION,
                query: {
                    companyNumber: "12345",
                    selectedPscId: "123"
                }
            };
            const res = {};
            const result = handler.executeGetWithAnyTypeArgs(req, res);

            expect((await result).templatePath).toBe(ROUTER_VIEWS_FOLDER_PATH + PATHS.EXTENSION_CONFIRMATION);
            expect((await result).viewData.templateName).toBe(PATHS.FIRST_EXTENSION_CONFIRMATION.slice(1));
        });

        it("should return template path and viewData for second extension confirmation", async () => {
            const handler = new TestableExtensionConfirmationHandler();
            const req = {
                originalUrl: PATHS.SECOND_EXTENSION_CONFIRMATION,
                query: {
                    companyNumber: "12345",
                    selectedPscId: "123"
                }
            };
            const res = {};
            const result = handler.executeGetWithAnyTypeArgs(req, res);

            expect((await result).templatePath).toBe(ROUTER_VIEWS_FOLDER_PATH + PATHS.EXTENSION_CONFIRMATION);
            expect((await result).viewData.templateName).toBe(PATHS.SECOND_EXTENSION_CONFIRMATION.slice(1));
        });
    });
});
