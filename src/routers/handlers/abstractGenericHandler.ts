// Generic handler is the base handler that is extended by all other handlers
// It contains methods that are common to multiple route handlers

import { Request, Response } from "express";
import errorManifest from "../../lib/utils/error_manifests/default";

export interface BaseViewData {
    errors?: Record<string, { summary: string }>;
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

export abstract class GenericHandler<T extends BaseViewData> {

    errorManifest: any;
    private viewData!: T;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected async getViewData (_req: Request, _res: Response): Promise<T> {
        this.errorManifest = errorManifest;
        this.viewData = defaultBaseViewData as T;
        return this.viewData;
    }
}

export interface ViewModel<T> {
    templatePath: string;
    viewData: T;
}
