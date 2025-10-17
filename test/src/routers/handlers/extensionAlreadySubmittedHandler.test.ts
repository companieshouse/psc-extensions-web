import { HttpStatusCode } from "axios";
import { PATHS, ROUTER_VIEWS_FOLDER_PATH, PREFIXED_URLS } from "../../../../src/lib/constants";
import { ExtensionAlreadySubmittedHandler } from "../../../../src/routers/handlers/extensionAlreadySubmittedHandler";
import { PSC_INDIVIDUAL } from "../../../mocks/psc.mock";

class TestableExtensionSubmittedHandler extends ExtensionAlreadySubmittedHandler {
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

describe("ExtensionAlreadySubmittedHandler", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getViewData", () => {
        it("should return baseViewData with extension already submitted page", async () => {
            const handler = new TestableExtensionSubmittedHandler();
            const req = {
                originalUrl: PREFIXED_URLS.EXTENSION_ALREADY_SUBMITTED,
                query: {
                    companyNumber: "12345",
                    selectedPscId: "123"
                }
            };

            const res = {};
            const result = handler.exposeGetViewData(req, res);

            expect((await result).templateName).toBe(PATHS.EXTENSION_ALREADY_SUBMITTED.slice(1));
        });
    });

    describe("executeGet", () => {
        it("should return template path and data within the Url for extension already submitted page", async () => {
            const handler = new TestableExtensionSubmittedHandler();
            const req = {
                originalUrl: PREFIXED_URLS.EXTENSION_ALREADY_SUBMITTED,
                query: {
                    companyNumber: "12345",
                    selectedPscId: "123"
                }
            };
            const res = {};
            const result = handler.executeGetWithAnyTypeArgs(req, res);

            expect((await result).templatePath).toBe(ROUTER_VIEWS_FOLDER_PATH + PATHS.EXTENSION_ALREADY_SUBMITTED);
            expect((await result).viewData.templateName).toBe(PATHS.EXTENSION_ALREADY_SUBMITTED.slice(1));
        });
    });
});
