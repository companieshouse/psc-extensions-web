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
    COOKIE_SECRET: getEnvironmentValue("COOKIE_SECRET"),
    ENV_NAME: getEnvironmentValue("ENV_NAME")
} as const;

export const LOCALES_PATH = getEnvironmentValue("LOCALES_PATH", "locales");
export const LOCALES_ENABLED = getEnvironmentValue("LOCALES_ENABLED", "true");

export const SERVICE_PATH_PREFIX = "/persons-with-significant-control-extensions";
export const ROUTER_VIEWS_FOLDER_PATH = "router_views";
export const VERIFICATION_PREFIX = "/persons-with-significant-control-verification";

export const PATHS = {
    REQUEST_EXTENSION: "/requesting-an-extension",
    HEALTHCHECK: "/healthcheck",
    EXTENSION_REFUSED: "/you-cannot-request-an-extension",
    EXTENSION_LIMIT_EXCEEDED: "/extension-limit-exceeded",
    REASON_FOR_EXTENSION: "/extension-reason",
    FIRST_EXTENSION_CONFIRMATION: "/first-extension-request-successful",
    SECOND_EXTENSION_CONFIRMATION: "/second-extension-request-successful",
    EXTENSION_CONFIRMATION: "/extension-confirmation",
    EXTENSION_ALREADY_SUBMITTED: "/extension-already-submitted",
    INDIVIDUAL_PSC_LIST: "/individual/psc-list?",
    PAGE_NOT_FOUND: "/page-not-found",
    INTERNAL_SERVER_ERROR: "/internal-server-error"
} as const;

export const PREFIXED_URLS = {
    REQUEST_EXTENSION: SERVICE_PATH_PREFIX + PATHS.REQUEST_EXTENSION,
    HEALTHCHECK: SERVICE_PATH_PREFIX + PATHS.HEALTHCHECK,
    EXTENSION_REFUSED: SERVICE_PATH_PREFIX + PATHS.EXTENSION_REFUSED,
    EXTENSION_LIMIT_EXCEEDED: SERVICE_PATH_PREFIX + PATHS.EXTENSION_LIMIT_EXCEEDED,
    REASON_FOR_EXTENSION: SERVICE_PATH_PREFIX + PATHS.REASON_FOR_EXTENSION,
    FIRST_EXTENSION_CONFIRMATION: SERVICE_PATH_PREFIX + PATHS.FIRST_EXTENSION_CONFIRMATION,
    SECOND_EXTENSION_CONFIRMATION: SERVICE_PATH_PREFIX + PATHS.SECOND_EXTENSION_CONFIRMATION,
    EXTENSION_CONFIRMATION: SERVICE_PATH_PREFIX + PATHS.EXTENSION_CONFIRMATION,
    EXTENSION_ALREADY_SUBMITTED: SERVICE_PATH_PREFIX + PATHS.EXTENSION_ALREADY_SUBMITTED,
    INDIVIDUAL_PSC_LIST: VERIFICATION_PREFIX + PATHS.INDIVIDUAL_PSC_LIST,
    PAGE_NOT_FOUND: PATHS.PAGE_NOT_FOUND,
    INTERNAL_SERVER_ERROR: PATHS.INTERNAL_SERVER_ERROR
} as const;

export const EXTENSION_REASONS = {
    ID_DOCS_DELAYED: "reason_for_extension_1",
    POST_OFFICE_VERIFICATION: "reason_for_extension_2",
    MEDICAL_TREATMENT: "reason_for_extension_3",
    NEED_SUPPORT: "reason_for_extension_4",
    TECHNICAL_ISSUES: "reason_for_extension_5",
    INCORRECT_PSC_DETAILS: "reason_for_extension_6"
} as const;

export const EXTERNALURLS = {
    COMPANY_LOOKUP: "/company-lookup/search",
    COMPANY_LOOKUP_FORWARD: VERIFICATION_PREFIX + "/confirm-company"
} as const;

export const validExtensionReasons = Object.values(EXTENSION_REASONS);

export type ExtensionReason = typeof EXTENSION_REASONS[keyof typeof EXTENSION_REASONS];

// Used for api error responses
export const Responses = {
    PROBLEM_WITH_PSC_DATA: "We are currently unable to process an Extensions filing for this PSC"
} as const;

export const EXTENSION_STATUS = {
    PENDING: "PENDING",
    ACCEPTED: "ACCEPTED"
} as const;
