const getEnvironmentValue = (key: string, defaultValue?: string): string => {
    const value: string = process.env[key] || "";

    if (!value && !defaultValue) {
        throw new Error(`Please set the environment variable "${key}"`);
    }

    return value || defaultValue as string;
};

export const DEFAULT_SESSION_EXPIRATION = getEnvironmentValue("DEFAULT_SESSION_EXPIRATION", "3600");
export const CACHE_SERVER = getEnvironmentValue("CACHE_SERVER");
export const CHS_URL = getEnvironmentValue("CHS_URL");
export const COOKIE_DOMAIN = getEnvironmentValue("COOKIE_DOMAIN");
export const COOKIE_NAME = getEnvironmentValue("COOKIE_NAME");
export const COOKIE_SECRET = getEnvironmentValue("COOKIE_SECRET");
export const LOCALES_PATH = getEnvironmentValue("LOCALES_PATH", "locales");
export const LOCALES_ENABLED = getEnvironmentValue("LOCALES_ENABLED", "true") === "true";

export const EXTENSION_INFO_PAGE = "extension-info";
export const EXTENSION_REFUSED_PAGE = "extension-refused";

export const LANDING_URL = "/psc-extensions";
export const EXTENSION_INFO_URL = `/${EXTENSION_INFO_PAGE}`;
export const EXTENSION_REFUSED_URL = `/${EXTENSION_REFUSED_PAGE}`;
export const INDIVIDUAL_PSC_LIST_URL = "/persons-with-significant-control-verification/individual/psc-list";
