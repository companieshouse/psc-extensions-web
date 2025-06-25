// Do Router dispatch here, i.e. map incoming routes to appropriate router
import { Application, Request, Response, Router } from "express";
import extensionInfoRouter from "./routers/extensionInfoRouter";
import extensionInfoRouter from "./routers/extensionRefusedRouter";
import { EXTENSION_INFO_URL, LANDING_URL } from "./lib/constants";

const routerDispatch = (app: Application) => {
    const router = Router();

    app.use(LANDING_URL, router);
    router.use(EXTENSION_INFO_URL, extensionInfoRouter);
    router.use(EXTENSION_REFUSED_URL, extensionRefusedRouter);
    router.use("*", (req: Request, res: Response) => {
        res.status(404).render("partials/error_400");
    });
};

export default routerDispatch;
