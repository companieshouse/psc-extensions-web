// Do Router dispatch here, i.e. map incoming routes to appropriate router
import { Application, Request, Response, Router } from "express";
import extensionInfoRouter from "./routers/extensionInfoRouter";
import extensionRefusedRouter from "./routers/extensionRefusedRouter";
import extensionConfirmationHandler from "./routers/extensionConfirmationRouter";
import { servicePathPrefix, Urls } from "./lib/constants";

const routerDispatch = (app: Application) => {
    const router = Router();

    app.use(servicePathPrefix, router);
    router.use(Urls.EXTENSION_INFO, extensionInfoRouter);
    router.use(Urls.EXTENSION_REFUSED, extensionRefusedRouter);
    router.use(Urls.EXTENSION_CONFIRMATION, extensionConfirmationHandler);
    router.use("*", (req: Request, res: Response) => {
        res.status(404).render("partials/error_400");
    });
};

export default routerDispatch;
