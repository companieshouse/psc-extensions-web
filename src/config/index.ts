export const env = {
    API_URL: process.env.API_URL as string,
    APP_NAME: process.env.APP_NAME as string,
    CHS_URL: process.env.CHS_ENV as string,
    CHS_INTERNAL_API_KEY: process.env.CHS_INTERNAL_API_KEY as string,
    LOG_LEVEL: process.env.LOG_LEVEL as string,
    LOCALES_ENABLED: process.env.LOCALES_ENABLED as string,
    LOCALES_PATH: process.env.LOCALES_PATH as string,
    NODE_ENV: process.env.NODE_ENV as string,
    OTEL_EXPORTER_OTLP_ENDPOINT: process.env.OTEL_EXPORTER_OTLP_ENDPOINT as string,
    OTEL_LOG_ENABLED: process.env.OTEL_LOG_ENABLED as string
};
