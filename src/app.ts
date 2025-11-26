import express, { Request, Response, NextFunction } from "express";
import nunjucks from "nunjucks";
import path from "path";
import cookieParser from "cookie-parser";
import { getGOVUKFrontendVersion } from "@companieshouse/ch-node-utils";
import logger from "./lib/logger";
import routerDispatch from "./router.dispatch";
import { sessionMiddleware } from "./middleware/session.middleware";
import { templateMiddleware } from "./middleware/template.middleware";
import { pageNotFound } from "./middleware/pageNotFound.middleware";
import { internalServerError } from "./middleware/internalServerError.middleware";
import { SERVICE_PATH_PREFIX } from "./lib/constants";
import helmet from "helmet";
import { v4 as uuidv4 } from "uuid";
import { prepareCSPConfig } from "./middleware/content.security.policy.middleware";

const app = express();

app.set("views", [
    path.join(__dirname, "/views"),
    path.join(__dirname, "/../node_modules/govuk-frontend/dist"), // This is for when using ts-node since the working directory is src
    path.join(__dirname, "node_modules/govuk-frontend/dist"),
    path.join(__dirname, "/../node_modules/@companieshouse"),
    path.join(__dirname, "node_modules/@companieshouse"),
    path.join(__dirname, "/../node_modules/@companieshouse/ch-node-utils/templates"),
    path.join(__dirname, "node_modules/@companieshouse/ch-node-utils/templates")
]);

const nunjucksLoaderOpts = {
    watch: process.env.NUNJUCKS_LOADER_WATCH !== "false",
    noCache: process.env.NUNJUCKS_LOADER_NO_CACHE !== "true"
};

const njk = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(app.get("views"),
        nunjucksLoaderOpts)
);

njk.express(app);
app.set("view engine", "njk");

// Serve static files
app.use(express.static(path.join(__dirname, "/../assets/public")));

njk.addGlobal("cdnUrlCss", process.env.CDN_URL_CSS);
njk.addGlobal("cdnUrlJs", process.env.CDN_URL_JS);
njk.addGlobal("cdnHost", process.env.ANY_PROTOCOL_CDN_HOST);
njk.addGlobal("chsUrl", process.env.CHS_URL);
njk.addGlobal("accountUrl", process.env.ACCOUNT_URL);
njk.addGlobal("PIWIK_SERVICE_NAME", process.env.PIWIK_SERVICE_NAME);
njk.addGlobal("PIWIK_SITE_ID", process.env.PIWIK_SITE_ID);
njk.addGlobal("PIWIK_URL", process.env.PIWIK_URL);
njk.addGlobal("govukRebrand", true);
njk.addGlobal("govukFrontendVersion", getGOVUKFrontendVersion());

// If app is behind a front-facing proxy, and to use the X-Forwarded-* headers to determine the connection and the IP address of the client
app.enable("trust proxy");

// parse body into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

const nonce: string = uuidv4();
app.use(helmet(prepareCSPConfig(nonce)));

app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.nonce = nonce;
    res.locals.cspNonce = nonce;
    next();
});

// initiate session and attach to middleware
app.use(SERVICE_PATH_PREFIX, sessionMiddleware);
app.use(templateMiddleware);

// Channel all requests through router dispatch
routerDispatch(app);

// 404 - page not found error
app.use(pageNotFound);

// Unhandled errors - 500 internal server errors
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    logger.error(`${err.name} - appError: ${err.message} - ${err.stack}`);
    internalServerError(req, res);
});

// Unhandled exceptions
process.on("uncaughtException", (err: any) => {
    logger.error(`${err.name} - uncaughtException: ${err.message} - ${err.stack}`);
    process.exit(1);
});

// Unhandled promise rejections
process.on("unhandledRejection", (err: any) => {
    logger.error(`${err.name} - unhandledRejection: ${err.message} - ${err.stack}`);
    process.exit(1);
});

export default app;
