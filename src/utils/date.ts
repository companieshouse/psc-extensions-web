import logger from "../lib/logger";

export function internationaliseDate (date: string, lang: string): string {
    try {
        return Intl.DateTimeFormat(lang === "en" ? "en-GB" : lang, { dateStyle: "long" }).format(new Date(date));
    } catch (error) {
        logger.error(`Error internationalising date: ${error}`);
        return "Invalid date";
    }
}
