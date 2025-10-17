// Do Router dispatch here, i.e. map incoming routes to appropriate router
import { Application, Request, Response, Router } from "express";
import { authenticate } from "./middleware/authentication.middleware";
import requestAnExtensionRouter from "./routers/requestAnExtensionRouter";
import extensionRefusedRouter from "./routers/extensionRefusedRouter";
import reasonForExtensionRouter from "./routers/reasonForExtensionRouter";
import healthCheckRouter from "./routers/healthCheckRouter";
import extensionConfirmationRouter from "./routers/extensionConfirmationRouter";
import extensionAlreadySubmittedRouter from "./routers/extensionAlreadySubmittedRouter";
import { SERVICE_PATH_PREFIX, PATHS } from "./lib/constants";
import newSubmissionRouter from "./routers/newSubmissionRouter";

const routerDispatch = (app: Application) => {
    const router = Router();

    app.use(SERVICE_PATH_PREFIX, router);
    router.use(PATHS.HEALTHCHECK, healthCheckRouter);
    router.use(PATHS.REQUEST_EXTENSION, authenticate, requestAnExtensionRouter);
    router.use(PATHS.EXTENSION_REFUSED, authenticate, extensionRefusedRouter);
    router.use(PATHS.NEW_SUBMISSION, authenticate, newSubmissionRouter);
    router.use(PATHS.REASON_FOR_EXTENSION, authenticate, reasonForExtensionRouter);
    router.use(PATHS.FIRST_EXTENSION_CONFIRMATION, authenticate, extensionConfirmationRouter);
    router.use(PATHS.SECOND_EXTENSION_CONFIRMATION, authenticate, extensionConfirmationRouter);
    router.use(PATHS.EXTENSION_ALREADY_SUBMITTED, authenticate, extensionAlreadySubmittedRouter);
    router.use("/", (req: Request, res: Response) => {
        res.status(404).render("partials/error_400");
    });
};

export default routerDispatch;
