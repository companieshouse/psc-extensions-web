import { HttpStatusCode } from "axios";

export class HttpError extends Error {
    public status: number;

    constructor (message: string, status: number | (typeof HttpStatusCode)[keyof typeof HttpStatusCode]) {
        super(message);
        this.name = "HttpError";
        this.status = status as number;

        // Maintains stack trace for where the error was thrown
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HttpError);
        }
    }
}
