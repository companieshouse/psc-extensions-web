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
export const LOCALES_ENABLED = getEnvironmentValue("LOCALES_ENABLED", "true") === "true";

export const SERVICE_PATH_PREFIX = "/persons-with-significant-control-extension";
export const ROUTER_VIEWS_FOLDER_PATH = "router_views";

export const PATHS = {
    REQUEST_EXTENSION: "/requesting-an-extension",
    HEALTHCHECK: "/healthcheck",
    EXTENSION_REFUSED: "/you-cannot-request-an-extension",
    REASON_FOR_EXTENSION: "/extension-reason",
    NEW_SUBMISSION: "/new-submission",
    FIRST_EXTENSION_CONFIRMATION: "/first-extension-request-successful",
    SECOND_EXTENSION_CONFIRMATION: "/second-extension-request-successful",
    EXTENSION_CONFIRMATION: "/extension-confirmation",
    EXTENSION_ALREADY_SUBMITTED: "/extension-already-submitted",
    INDIVIDUAL_PSC_LIST: "/persons-with-significant-control-verification/individual/psc-list"
} as const;

export const ExtensionReasons = {
    ID_DOCS_DELAYED: "ID_DOCS_DELAYED",
    POST_OFFICE_VERIFICATION: "POST_OFFICE_VERIFICATION",
    MEDICAL_TREATMENT: "MEDICAL_TREATMENT",
    NEED_SUPPORT: "NEED_SUPPORT",
    TECHNICAL_ISSUES: "TECHNICAL_ISSUES",
    INCORRECT_PSC_DETAILS: "INCORRECT_PSC_DETAILS"
} as const;

export const validExtensionReasons = Object.values(ExtensionReasons);

export type ExtensionReason = typeof ExtensionReasons[keyof typeof ExtensionReasons];

// Used for api error responses
export const Responses = {
    PROBLEM_WITH_PSC_DATA: "We are currently unable to process an Extensions filing for this PSC"
} as const;
