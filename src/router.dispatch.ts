// Do Router dispatch here, i.e. map incoming routes to appropriate router
import { Application, Request, Response, Router } from "express";
import startRouter from "./routers/startRouter";
import { servicePathPrefix } from "./lib/constants";

const routerDispatch = (app: Application) => {
    const router = Router();

    app.use(servicePathPrefix, router);
    router.use("/extension-info", startRouter);
    router.use("*", (req: Request, res: Response) => {
        res.status(404).render("partials/error_400");
    });
};

export default routerDispatch;
