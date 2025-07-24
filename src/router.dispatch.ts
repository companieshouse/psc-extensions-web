// Do Router dispatch here, i.e. map incoming routes to appropriate router
import { Application, Request, Response, Router } from "express";
import extensionInfoRouter from "./routers/extensionInfoRouter";
import extensionRefusedRouter from "./routers/extensionRefusedRouter";
import reasonForExtensionRouter from "./routers/reasonForExtensionRouter";
import healthCheckRouter from "./routers/healthCheckRouter";
import extensionConfirmationHandler from "./routers/extensionConfirmationRouter";
import { servicePathPrefix, Urls } from "./lib/constants";

const routerDispatch = (app: Application) => {
    const router = Router();

    app.use(servicePathPrefix, router);
    router.use(Urls.EXTENSION_INFO, extensionInfoRouter);
    router.use(Urls.EXTENSION_REFUSED, extensionRefusedRouter);
    router.use(Urls.REASON_FOR_EXTENSION, reasonForExtensionRouter);
    router.use(Urls.HEALTHCHECK, healthCheckRouter);
    router.use(Urls.EXTENSION_CONFIRMATION, extensionConfirmationHandler);
    router.use("*", (req: Request, res: Response) => {
        res.status(404).render("partials/error_400");
    });
};

export default routerDispatch;
