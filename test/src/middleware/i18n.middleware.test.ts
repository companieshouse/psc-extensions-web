import { i18nCh } from "@companieshouse/ch-node-utils";
import { Request, Response, NextFunction } from "express";

interface MockLocalesService {
    i18nCh?: Partial<i18nCh>;
}

function mockLocalesService (service?: MockLocalesService) {
    jest.resetModules();
    jest.mock("@companieshouse/ch-node-utils", () => ({
        LocalesService: {
            getInstance: jest.fn().mockReturnValue({
                i18nCh: {
                    resolveNamespacesKeys: jest.fn().mockReturnValue({
                        key: "value"
                    })
                },
                localesFolder: "mockLocalesFolder",
                ...service
            })
        },
        LanguageNames: {
            sourceLocales: jest.fn().mockReturnValue({
                key: "value"
            })
        }
    }));
}

function setLocalesEnabled (enabled: boolean) {
    jest.resetModules();
    jest.mock("../../../src/lib/constants", () => ({
        LOCALES_ENABLED: enabled
    }));
}

describe("i18n middleware", () => {
    let req: any;
    let res: any;
    let next: any;
    let i18nMiddleware: (req: Request, res: Response, next: NextFunction) => void;

    const reloadMiddleware = async () => {
        i18nMiddleware = (await import("../../../src/middleware/i18n.middleware")).i18nMiddleware;
    };

    beforeEach(async () => {
        setLocalesEnabled(true);
        mockLocalesService();
        await reloadMiddleware();
        req = {
            query: {
                lang: "en"
            }
        };

        res = {
            locals: {}
        };

        next = jest.fn();
    });

    it("should populate the response object with all translations for the language", async () => {
        i18nMiddleware(req, res, next);

        expect(res.locals.i18n).toEqual({
            key: "value"
        });

        expect(next).toHaveBeenCalled();
    });

    it("should default to en if the LOCALES_ENABLED env variable is false", async () => {
        const resolveKeysMock = jest.fn().mockReturnValue({
            key: "test"
        });

        setLocalesEnabled(false);
        mockLocalesService({
            i18nCh: {
                resolveNamespacesKeys: resolveKeysMock
            }
        });

        await reloadMiddleware();
        req.lang = "cy";

        i18nMiddleware(req, res, next);

        expect(resolveKeysMock).toHaveBeenCalledWith("en");
        expect(res.locals.i18n).toEqual({
            key: "test"
        });

        expect(next).toHaveBeenCalled();
    });
});
