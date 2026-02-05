// Do Router dispatch here, i.e. map incoming routes to appropriate router
import { Application, Router } from "express";
import { authenticate } from "./middleware/authentication.middleware";
import { validateExtensionRequest } from "./middleware/is.valid.extension.middleware";
import requestAnExtensionRouter from "./routers/requestAnExtensionRouter";
import stopScreenRouter from "./routers/stopScreenRouter";
import reasonForExtensionRouter from "./routers/reasonForExtensionRouter";
import healthCheckRouter from "./routers/healthCheckRouter";
import extensionConfirmationRouter from "./routers/extensionConfirmationRouter";
import extensionAlreadySubmittedRouter from "./routers/extensionAlreadySubmittedRouter";
import { PATHS, SERVICE_PATH_PREFIX } from "./lib/constants";

const routerDispatch = (app: Application): void => {
    const router = Router();

    app.use(SERVICE_PATH_PREFIX, router);
    router.use(PATHS.HEALTHCHECK, healthCheckRouter);
    router.use(PATHS.REQUEST_EXTENSION, authenticate, validateExtensionRequest, requestAnExtensionRouter);
    router.use(PATHS.STOP_SCREEN, authenticate, stopScreenRouter);
    router.use(PATHS.REASON_FOR_EXTENSION, authenticate, validateExtensionRequest, reasonForExtensionRouter);
    router.use(PATHS.FIRST_EXTENSION_CONFIRMATION, authenticate, extensionConfirmationRouter);
    router.use(PATHS.SECOND_EXTENSION_CONFIRMATION, authenticate, extensionConfirmationRouter);
    router.use(PATHS.EXTENSION_ALREADY_SUBMITTED, authenticate, extensionAlreadySubmittedRouter);
};

export default routerDispatch;