// Do Router dispatch here, i.e. map incoming routes to appropriate router
import { Application, Request, Response, Router } from "express";
import { authenticate } from "./middleware/authentication.middleware";
import extensionInfoRouter from "./routers/extensionInfoRouter";
import extensionRefusedRouter from "./routers/extensionRefusedRouter";
import reasonForExtensionRouter from "./routers/reasonForExtensionRouter";
import healthCheckRouter from "./routers/healthCheckRouter";
import extensionConfirmationRouter from "./routers/extensionConfirmationRouter";
import { servicePathPrefix, Urls } from "./lib/constants";

const routerDispatch = (app: Application) => {
    const router = Router();

    app.use(servicePathPrefix, router);
    router.use(Urls.HEALTHCHECK, healthCheckRouter);
    router.use(Urls.EXTENSION_INFO, authenticate, extensionInfoRouter);
    router.use(Urls.EXTENSION_REFUSED, authenticate, extensionRefusedRouter);
    router.use(Urls.REASON_FOR_EXTENSION, authenticate, reasonForExtensionRouter);
    router.use(Urls.EXTENSION_CONFIRMATION, authenticate, extensionConfirmationRouter);
    router.use("/", (req: Request, res: Response) => {
        res.status(404).render("partials/error_400");
    });
};

export default routerDispatch;
