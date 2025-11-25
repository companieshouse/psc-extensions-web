import { SessionMiddleware, SessionStore } from "@companieshouse/node-session-handler";
import Redis from "ioredis";
import { env } from "../lib/constants";

const environmentsWithInsecureCookies = [
    "local"
];

const sessionStore = new SessionStore(new Redis(`redis://${env.CACHE_SERVER}`));

export const sessionMiddleware = SessionMiddleware({
    cookieName: env.COOKIE_NAME,
    cookieSecret: env.COOKIE_SECRET,
    cookieDomain: env.COOKIE_DOMAIN,
    cookieSecureFlag: env.ENV_NAME !== undefined && !environmentsWithInsecureCookies.includes(env.ENV_NAME),
    cookieTimeToLiveInSeconds: parseInt(env.DEFAULT_SESSION_EXPIRATION)
}, sessionStore, true);
