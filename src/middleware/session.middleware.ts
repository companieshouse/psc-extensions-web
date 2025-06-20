import { SessionMiddleware, SessionStore } from "@companieshouse/node-session-handler";
import Redis from "ioredis";
import * as constants from "../lib/constants";

const sessionStore = new SessionStore(new Redis(`redis://${constants.CACHE_SERVER}`));

export const sessionMiddleware = SessionMiddleware({
    cookieName: constants.COOKIE_NAME,
    cookieSecret: constants.COOKIE_SECRET,
    cookieDomain: constants.COOKIE_DOMAIN,
    cookieSecureFlag: undefined,
    cookieTimeToLiveInSeconds: parseInt(constants.DEFAULT_SESSION_EXPIRATION)
}, sessionStore, true);
