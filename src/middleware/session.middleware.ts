import { SessionMiddleware, SessionStore } from "@companieshouse/node-session-handler";
import Redis from "ioredis";
import { CACHE_SERVER, COOKIE_DOMAIN, COOKIE_NAME, COOKIE_SECRET, DEFAULT_SESSION_EXPIRATION } from "../lib/constants";

const sessionStore = new SessionStore(new Redis(`redis://${CACHE_SERVER}`));

export const sessionMiddleware = SessionMiddleware({
    cookieName: COOKIE_NAME,
    cookieSecret: COOKIE_SECRET,
    cookieDomain: COOKIE_DOMAIN,
    cookieSecureFlag: undefined,
    cookieTimeToLiveInSeconds: parseInt(DEFAULT_SESSION_EXPIRATION)
}, sessionStore, true);
