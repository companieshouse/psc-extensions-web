import { SessionMiddleware, SessionStore } from "@companieshouse/node-session-handler";
import Redis from "ioredis";
import { env } from "../lib/constants";

const sessionStore = new SessionStore(new Redis(`redis://${env.CACHE_SERVER}`));

export const sessionMiddleware = SessionMiddleware({
    cookieName: env.COOKIE_NAME,
    cookieSecret: env.COOKIE_SECRET,
    cookieDomain: env.COOKIE_DOMAIN,
    cookieSecureFlag: undefined,
    cookieTimeToLiveInSeconds: parseInt(env.DEFAULT_SESSION_EXPIRATION)
}, sessionStore, true);
