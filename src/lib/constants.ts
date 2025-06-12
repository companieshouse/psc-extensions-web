import { getEnvironmentValue } from "./utils/environment-value.util";

export const servicePathPrefix = "/psc-extensions";

export const DEFAULT_SESSION_EXPIRATION = getEnvironmentValue("DEFAULT_SESSION_EXPIRATION", "3600");
export const CACHE_SERVER = getEnvironmentValue("CACHE_SERVER");
export const CHS_URL = getEnvironmentValue("CHS_URL");
export const COOKIE_DOMAIN = getEnvironmentValue("COOKIE_DOMAIN");
export const COOKIE_NAME = getEnvironmentValue("COOKIE_NAME");
export const COOKIE_SECRET = getEnvironmentValue("COOKIE_SECRET");
export const LOCALES_PATH = getEnvironmentValue("LOCALES_PATH", "locales");
export const LOCALES_ENABLED = getEnvironmentValue("LOCALES_ENABLED", "true") === "true";

export const Urls = {
    EXTENSION_INFO: "/extension-info"
} as const;

export const PrefixedUrls = {
    EXTENSION_INFO: servicePathPrefix + Urls.EXTENSION_INFO
} as const;

export const ExternalUrls = {
    SIGNOUT: "/signout",
    INDIVIDUAL_PSC_LIST: "/persons-with-significant-control-verification/individual/psc-list"
} as const;
