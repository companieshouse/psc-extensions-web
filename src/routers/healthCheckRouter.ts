import { HttpStatusCode } from "axios";
import { Request, Response, Router } from "express";

const healthCheckRouter: Router = Router();

healthCheckRouter.get("/", (req: Request, res: Response) => {
    // TODO : Add logging
    res.status(HttpStatusCode.Ok).send("OK");
});

export default healthCheckRouter;
