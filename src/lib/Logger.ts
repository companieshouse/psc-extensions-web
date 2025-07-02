import { createLogger } from "@companieshouse/structured-logging-node";
import ApplicationLogger from "@companieshouse/structured-logging-node/lib/ApplicationLogger";

const logger: ApplicationLogger = createLogger(process.env.APP_NAME ?? "");

// tslint:disable-next-line:no-console
console.log(`env.LOG_LEVEL set to ${process.env.LOG_LEVEL}`);

  debugRequest (req: Request, message: string) {
        this.raw.debugRequest(req, `${this.getPrefix()} ${message}`);
    }
export default logger;
