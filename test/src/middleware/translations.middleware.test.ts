import { i18nCh } from "@companieshouse/ch-node-utils";
import { Response, NextFunction } from "express";
import { LangRequest } from "../../../src/middleware/translations.middleware";

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
        }
    }));
}

function setLocalesEnabled (enabled: boolean) {
    jest.resetModules();
    jest.mock("../../../src/lib/constants", () => ({
        LOCALES_ENABLED: enabled
    }));
}

describe("translations middleware", () => {
    let req: any;
    let res: any;
    let next: any;
    let translationsMiddleware: (req: LangRequest, res: Response, next: NextFunction) => void;

    const reloadMiddleware = async () => {
        translationsMiddleware = (await import("../../../src/middleware/translations.middleware")).translationsMiddleware;
    };

    beforeEach(async () => {
        setLocalesEnabled(true);
        mockLocalesService();
        await reloadMiddleware();
        req = {
            method: "GET",
            lang: "en"
        };

        res = {
            locals: {}
        };

        next = jest.fn();
    });

    it("should only handle GET requests", async () => {
        req.method = "POST";

        translationsMiddleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.locals.lang).toBeUndefined();
    });

    it("should populate the response object with all translations for the language", async () => {
        translationsMiddleware(req, res, next);

        expect(res.locals.lang).toEqual({
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

        translationsMiddleware(req, res, next);

        expect(resolveKeysMock).toHaveBeenCalledWith("en");
        expect(res.locals.lang).toEqual({
            key: "test"
        });

        expect(next).toHaveBeenCalled();
    });
});
