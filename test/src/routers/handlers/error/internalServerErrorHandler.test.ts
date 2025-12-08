import { PREFIXED_URLS, ROUTER_VIEWS_FOLDER_PATH } from "../../../../../src/lib/constants";
import { InternalServerErrorHandler } from "../../../../../src/routers/handlers/error/internalServerErrorHandler";

class TestableInternalServerErrorHandler extends InternalServerErrorHandler {
    public exposeGetViewData (req: any, res: any) {
        return this.getViewData(req, res);
    }

    public executeGetWithAnyTypeArgs (req: any, res: any) {
        return this.executeGet(req, res);
    }
}

const mockGetLocaleInfo = jest.fn();
const mockGetLocalesService = jest.fn();
const mockSelectLang = jest.fn();

jest.mock("../../../../../src/utils/localise", () => ({
    getLocaleInfo: (...args: any[]) => mockGetLocaleInfo(...args),
    getLocalesService: () => mockGetLocalesService(),
    selectLang: (...args: any[]) => mockSelectLang(...args)
}));

describe("InternalServerErrorHandler", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getViewData", () => {
        it("should return baseViewData with internal-server-error template name and locale info", async () => {
            const handler = new TestableInternalServerErrorHandler();

            const req = { query: { lang: "en" } } as any;
            const res = {} as any;

            mockSelectLang.mockReturnValueOnce("en");
            mockGetLocalesService.mockReturnValueOnce({ enabled: true, localesFolder: "locales", i18nCh: { resolveNamespacesKeys: (l: string) => ({ key: l }) } });
            mockGetLocaleInfo.mockReturnValueOnce({ languageEnabled: true, languages: {}, i18n: { hello: "world" }, lang: "en" });

            const result = handler.exposeGetViewData(req, res);

            const viewData = await result;

            expect(viewData.templateName).toBe(PREFIXED_URLS.INTERNAL_SERVER_ERROR.slice(1));
            expect(viewData.backURL).toBeNull();
            expect(mockSelectLang).toHaveBeenCalledWith("en");
            expect(mockGetLocalesService).toHaveBeenCalled();
            expect(mockGetLocaleInfo).toHaveBeenCalled();
        });
    });

    describe("executeGet", () => {
        it("should return template path and viewData", async () => {
            const handler = new TestableInternalServerErrorHandler();

            const req = { query: {} } as any;
            const res = {} as any;

            mockSelectLang.mockReturnValueOnce("en");
            mockGetLocalesService.mockReturnValueOnce({ enabled: true, localesFolder: "locales", i18nCh: { resolveNamespacesKeys: (l: string) => ({}) } });
            mockGetLocaleInfo.mockReturnValueOnce({ languageEnabled: true, languages: {}, i18n: {}, lang: "en" });

            const result = handler.executeGetWithAnyTypeArgs(req, res);

            const viewModel = await result;

            expect(viewModel.templatePath).toBe(ROUTER_VIEWS_FOLDER_PATH + "/error/internal-server-error");
            expect(viewModel.viewData.templateName).toBe(PREFIXED_URLS.INTERNAL_SERVER_ERROR.slice(1));
        });
    });

    describe("unhappy path", () => {
        it("should reject executeGet when getLocaleInfo throws", async () => {
            const handler = new TestableInternalServerErrorHandler();

            const req = { query: { lang: "en" } } as any;
            const res = {} as any;

            mockSelectLang.mockReturnValueOnce("en");
            mockGetLocalesService.mockReturnValueOnce({ enabled: true, localesFolder: "locales", i18nCh: { resolveNamespacesKeys: () => ({}) } });
            mockGetLocaleInfo.mockImplementationOnce(() => { throw new Error("locale failure"); });

            await expect(handler.executeGetWithAnyTypeArgs(req, res)).rejects.toThrow("locale failure");
        });
    });
});
