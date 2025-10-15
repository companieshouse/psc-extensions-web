import { createApiClient } from "@companieshouse/api-sdk-node";
import ApiClient from "@companieshouse/api-sdk-node/dist/client";
import { Session } from "@companieshouse/node-session-handler";

import { env } from "../../config";
import { getAccessToken } from "./session.util";

export const createOAuthApiClient = (session: Session | undefined, baseUrl: string = env.API_URL as string): ApiClient => {
    if (!session) throw new Error();
    return createApiClient(undefined, getAccessToken(session), baseUrl);
};

export const createApiKeyClient = (): ApiClient => {
    return createApiClient(process.env.CHS_INTERNAL_API_KEY, undefined, env.API_URL as string);
};
