import { LanguageNames, LocalesService } from "@companieshouse/ch-node-utils";
import { LOCALES_PATH, LOCALES_ENABLED } from "../lib/constants";

export const selectLang = (lang: any): string => {
    switch (lang) {
    case "cy": return "cy";
    case "en":
    default: return "en";
    }
};

export const getLocaleInfo = (locales: LocalesService, lang: string) => {
    return {
        languageEnabled: locales.enabled,
        languages: LanguageNames.sourceLocales(locales.localesFolder),
        i18n: locales.i18nCh.resolveNamespacesKeys(lang),
        lang
    };
};

export const getLocalesService = () => LocalesService.getInstance(LOCALES_PATH, LOCALES_ENABLED === "true");
