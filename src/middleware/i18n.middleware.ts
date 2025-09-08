import { LanguageNames, LocalesService } from "@companieshouse/ch-node-utils";
import { Request, Response, NextFunction } from "express";
import { LOCALES_PATH, LOCALES_ENABLED } from "../lib/constants";

const locales = LocalesService.getInstance(LOCALES_PATH, LOCALES_ENABLED);

enum Lang {
    EN = "en",
    CY = "cy"
}

function resolveLang (lang: any): string {
    if (!LOCALES_ENABLED) {
        return Lang.EN;
    }
    return Object.values(Lang).includes(lang) ? lang : Lang.EN;
}

export const i18nMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const lang = resolveLang(req.lang);

    Object.assign(res.locals, {
        languageEnabled: locales.enabled,
        languages: LanguageNames.sourceLocales(locales.localesFolder),
        i18n: locales.i18nCh.resolveNamespacesKeys(lang),
        lang
    });

    next();
};
