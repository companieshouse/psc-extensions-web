const getEnvironmentValue = (key: string, defaultValue?: string): string => {
    const value: string = process.env[key] ?? "";

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
    COOKIE_SECRET: getEnvironmentValue("COOKIE_SECRET")
} as const;

export const LOCALES_PATH = getEnvironmentValue("LOCALES_PATH", "locales");
export const LOCALES_ENABLED = getEnvironmentValue("LOCALES_ENABLED", "true");

export const SERVICE_PATH_PREFIX = "/persons-with-significant-control-extensions";
export const ROUTER_VIEWS_FOLDER_PATH = "router_views";
export const VERIFICATIONPREFIX = "/persons-with-significant-control-verification";

export const PATHS = {
    REQUEST_EXTENSION: "/requesting-an-extension",
    HEALTHCHECK: "/healthcheck",
    EXTENSION_REFUSED: "/you-cannot-request-an-extension",
    REASON_FOR_EXTENSION: "/extension-reason",
    FIRST_EXTENSION_CONFIRMATION: "/first-extension-request-successful",
    SECOND_EXTENSION_CONFIRMATION: "/second-extension-request-successful",
    EXTENSION_CONFIRMATION: "/extension-confirmation",
    EXTENSION_ALREADY_SUBMITTED: "/extension-already-submitted",
    INDIVIDUAL_PSC_LIST: "/individual/psc-list?"
} as const;

export const PREFIXEDURLS = {
    REQUEST_EXTENSION: SERVICE_PATH_PREFIX + PATHS.REQUEST_EXTENSION,
    HEALTHCHECK: SERVICE_PATH_PREFIX + PATHS.HEALTHCHECK,
    EXTENSION_REFUSED: SERVICE_PATH_PREFIX + PATHS.EXTENSION_REFUSED,
    REASON_FOR_EXTENSION: SERVICE_PATH_PREFIX + PATHS.REASON_FOR_EXTENSION,
    FIRST_EXTENSION_CONFIRMATION: SERVICE_PATH_PREFIX + PATHS.FIRST_EXTENSION_CONFIRMATION,
    SECOND_EXTENSION_CONFIRMATION: SERVICE_PATH_PREFIX + PATHS.SECOND_EXTENSION_CONFIRMATION,
    EXTENSION_CONFIRMATION: SERVICE_PATH_PREFIX + PATHS.EXTENSION_CONFIRMATION,
    EXTENSION_ALREADY_SUBMITTED: SERVICE_PATH_PREFIX + PATHS.EXTENSION_ALREADY_SUBMITTED,
    INDIVIDUAL_PSC_LIST: VERIFICATIONPREFIX + PATHS.INDIVIDUAL_PSC_LIST
} as const;

export const ExtensionReasons = {
    ID_DOCS_DELAYED: "ID_DOCS_DELAYED",
    POST_OFFICE_VERIFICATION: "POST_OFFICE_VERIFICATION",
    MEDICAL_TREATMENT: "MEDICAL_TREATMENT",
    NEED_SUPPORT: "NEED_SUPPORT",
    TECHNICAL_ISSUES: "TECHNICAL_ISSUES",
    INCORRECT_PSC_DETAILS: "INCORRECT_PSC_DETAILS"
} as const;

export const EXTERNALURLS = {
    COMPANY_LOOKUP: "/company-lookup/search",
    COMPANY_LOOKUP_FORWARD: VERIFICATIONPREFIX + "/confirm-company"
} as const;

export const validExtensionReasons = Object.values(ExtensionReasons);

export type ExtensionReason = typeof ExtensionReasons[keyof typeof ExtensionReasons];

// Used for api error responses
export const Responses = {
    PROBLEM_WITH_PSC_DATA: "We are currently unable to process an Extensions filing for this PSC"
} as const;
