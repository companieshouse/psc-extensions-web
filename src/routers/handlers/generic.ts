// Generic handler is the base handler that is extended by all other handlers
// It contains methods that are common to multiple route handlers

import { Request, Response } from "express";
import errorManifest from "../../lib/utils/error_manifests/default";

export interface BaseViewData {
    errors: any;
    title: string;
    backURL: string | null;
    templateName: string | null;
}

const defaultBaseViewData: Partial<BaseViewData> = {
    errors: {},
    title: "",
    backURL: null,
    templateName: null
} as const;

export interface Redirect {
    redirect: string;
}

export abstract class GenericHandler<T extends BaseViewData> {

    errorManifest: any;
    private viewData!: T;

    processHandlerException (err: any): unknown {
        if (err.name === "VALIDATION_ERRORS") {
            return err.stack;
        }
        return {
            serverError: this.errorManifest.generic.serverError
        };
    }

    async getViewData (req: Request, res: Response): Promise<T> {
        this.errorManifest = errorManifest;
        this.viewData = defaultBaseViewData as T;
        return this.viewData;
    }
}

export interface ViewModel<T> {
    templatePath: string;
    viewData: T;
}
