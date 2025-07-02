import express, { Request, Response, NextFunction } from "express";
import nunjucks from "nunjucks";
import path from "path";
import cookieParser from "cookie-parser";
import { getGOVUKFrontendVersion, LocalesMiddleware } from "@companieshouse/ch-node-utils";
import logger from "./lib/Logger";
import routerDispatch from "./router.dispatch";
import { authenticationMiddleware } from "./middleware/authentication.middleware";
import { sessionMiddleware } from "./middleware/session.middleware";
import { i18nMiddleware } from "./middleware/i18n.middleware";
import { templateMiddleware } from "./middleware/template.middleware";
import { Urls } from "./lib/constants";

const app = express();

// const viewPath = path.join(__dirname, "/views");
app.set("views", [
    path.join(__dirname, "/views"),
    path.join(__dirname, "/../node_modules/govuk-frontend/dist"),
    path.join(__dirname, "/../node_modules/@companieshouse"),
    path.join(__dirname, "/../node_modules/@companieshouse/ch-node-utils/templates")
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
// app.use("/assets", express.static("./../node_modules/govuk-frontend/govuk/assets"));
app.use("/assets", express.static(path.join(__dirname, "/node_modules/govuk-frontend/dist/govuk/assets")));

njk.addGlobal("cdnUrlCss", process.env.CDN_URL_CSS);
njk.addGlobal("cdnUrlJs", process.env.CDN_URL_JS);
njk.addGlobal("cdnHost", process.env.CDN_HOST);
njk.addGlobal("govukFrontendVersion", getGOVUKFrontendVersion());
njk.addGlobal("chsUrl", process.env.CHS_URL);
njk.addGlobal("accountUrl", process.env.ACCOUNT_URL);
njk.addGlobal("govukRebrand", true);

// If app is behind a front-facing proxy, and to use the X-Forwarded-* headers to determine the connection and the IP address of the client
app.enable("trust proxy");

// parse body into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(Urls.LANDING_URL, sessionMiddleware);
app.use(Urls.LANDING_URL, authenticationMiddleware);

app.use(LocalesMiddleware());
app.use(i18nMiddleware);
app.use(templateMiddleware);

// Unhandled errors
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    logger.error(`${err.name} - appError: ${err.message} - ${err.stack}`);
    res.render("partials/error_500");
});

// Channel all requests through router dispatch
routerDispatch(app);

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
