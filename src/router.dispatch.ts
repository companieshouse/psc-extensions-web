// Do Router dispatch here, i.e. map incoming routes to appropriate router
import { Application, Request, Response, Router } from "express";
import { authenticate } from "./middleware/authentication.middleware";
import extensionInfoRouter from "./routers/extensionInfoRouter";
import extensionRefusedRouter from "./routers/extensionRefusedRouter";
import reasonForExtensionRouter from "./routers/reasonForExtensionRouter";
import healthCheckRouter from "./routers/healthCheckRouter";
import extensionConfirmationRouter from "./routers/extensionConfirmationRouter";
import extensionAlreadySubmittedRouter from "./routers/extensionAlreadySubmittedRouter";
import { fetchCompany } from "./middleware/fetchCompany";
import { SERVICE_PATH_PREFIX, PATHS } from "./lib/constants";

const routerDispatch = (app: Application) => {
    const router = Router();

    app.use(SERVICE_PATH_PREFIX, router);
    router.use(PATHS.HEALTHCHECK, healthCheckRouter);
    router.use(PATHS.EXTENSION_INFO, authenticate, fetchCompany, extensionInfoRouter);
    router.use(PATHS.EXTENSION_REFUSED, authenticate, extensionRefusedRouter);
    router.use(PATHS.REASON_FOR_EXTENSION, authenticate, reasonForExtensionRouter);
    router.use(PATHS.EXTENSION_CONFIRMATION, authenticate, fetchCompany, extensionConfirmationRouter);
    router.use(PATHS.EXTENSION_ALREADY_SUBMITTED, authenticate, extensionAlreadySubmittedRouter);
    router.use("/", (req: Request, res: Response) => {
        res.status(404).render("partials/error_400");
    });
};

export default routerDispatch;
