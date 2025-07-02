const getEnvironmentValue = (key: string, defaultValue?: string): string => {
    const value: string = process.env[key] || "";

    if (!value && !defaultValue) {
        throw new Error(`Please set the environment variable "${key}"`);
    }

    return value || defaultValue as string;
};

export const env = {
     DEFAULT_SESSION_EXPIRATION: getEnvironmentValue("DEFAULT_SESSION_EXPIRATION", "3600"),
     CACHE_SERVER: getEnvironmentValue("CACHE_SERVER"),
     CHS_URL: getEnvironmentValue("CHS_URL"),
     COOKIE_DOMAIN: getEnvironmentValue("COOKIE_DOMAIN"),
     COOKIE_NAME: getEnvironmentValue("COOKIE_NAME"),
     COOKIE_SECRET: getEnvironmentValue("COOKIE_SECRET"),
     LOCALES_PATH: getEnvironmentValue("LOCALES_PATH", "locales"),
     LOCALES_ENABLED: getEnvironmentValue("LOCALES_ENABLED", "true") === "true"
} as const;

export const servicePathPrefix = "/psc-extensions",

export const Urls = {
    EXTENSION_INFO: `/extension-info`,
    EXTENSION_REFUSED: `/extension-refused`,
    HEALTHCHECK: "/healthcheck",
    INDIVIDUAL_PSC_LIST: "/persons-with-significant-control-verification/individual/psc-list"
} as const;