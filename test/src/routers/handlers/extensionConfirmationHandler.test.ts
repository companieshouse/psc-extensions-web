import { PATHS, ROUTER_VIEWS_FOLDER_PATH } from "../../../../src/lib/constants";
import { ExtensionConfirmationHandler } from "../../../../src/routers/handlers/extensionConfirmationHandler";
import { COMPANY_NUMBER, PSC_ID, PSC_INDIVIDUAL } from "../../../mocks/psc.mock";
import { validCompanyProfile } from "../../../mocks/companyProfile.mock";
import { TRANSACTION_ID } from "../../../mocks/pscExtension.mock";

class TestableExtensionConfirmationHandler extends ExtensionConfirmationHandler {
    public exposeGetViewData (req: any, res: any) {
        return this.getViewData(req, res);
    }

    public executeGetWithAnyTypeArgs (req: any, res: any) {
        return this.executeGet(req, res);
    }
}

const mockGetPscIndividual = jest.fn();
const mockGetCompanyProfile = jest.fn();
const mockLoggerError = jest.fn();
const mockLoggerInfo = jest.fn();

jest.mock("../../../../src/services/pscIndividualService", () => ({
    getPscIndividual: (...args: any[]) => mockGetPscIndividual(...args)
}));

jest.mock("../../../../src/services/companyProfileService", () => ({
    getCompanyProfile: (...args: any[]) => mockGetCompanyProfile(...args)
}));

jest.mock("../../../../src/lib/logger", () => ({
    error: (...args: any[]) => mockLoggerError(...args),
    info: (...args: any[]) => mockLoggerInfo(...args)
}));

describe("ExtensionConfirmationHandler", () => {
    const mockPscIndividualResource = {
        httpStatusCode: 200,
        resource: PSC_INDIVIDUAL
    };

    const baseReq = {
        query: {
            companyNumber: COMPANY_NUMBER,
            selectedPscId: PSC_ID,
            id: TRANSACTION_ID,
            lang: "en"
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockGetPscIndividual.mockResolvedValue(mockPscIndividualResource);
        mockGetCompanyProfile.mockResolvedValue(validCompanyProfile);
    });

    describe("getViewData", () => {
        it("should return baseViewData with first extension confirmation template name", async () => {
            const handler = new TestableExtensionConfirmationHandler();
            const req = {
                ...baseReq,
                originalUrl: PATHS.FIRST_EXTENSION_CONFIRMATION
            };

            const result = await handler.exposeGetViewData(req, {});

            expect(result.templateName).toBe(PATHS.FIRST_EXTENSION_CONFIRMATION.slice(1));
        });

        it("should return baseViewData with second extension confirmation template name", async () => {
            const handler = new TestableExtensionConfirmationHandler();
            const req = {
                ...baseReq,
                originalUrl: PATHS.SECOND_EXTENSION_CONFIRMATION
            };

            const result = await handler.exposeGetViewData(req, {});

            expect(result.templateName).toBe(PATHS.SECOND_EXTENSION_CONFIRMATION.slice(1));
        });

        it("should return empty template name for unknown URL", async () => {
            const handler = new TestableExtensionConfirmationHandler();
            const req = {
                ...baseReq,
                originalUrl: "/some-unknown-path"
            };

            const result = await handler.exposeGetViewData(req, {});

            expect(result.templateName).toBe("");
        });
    });

    describe("executeGet", () => {
        it("should return template path and viewData for first extension confirmation", async () => {
            const handler = new TestableExtensionConfirmationHandler();
            const req = {
                ...baseReq,
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
