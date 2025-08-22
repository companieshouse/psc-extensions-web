import {ApiClient, createApiClient} from "@companieshouse/api-sdk-node";
import {Session} from "express-session";

export const createOAuthApiClient = (session: Session): ApiClient => {
    const accessToken = session?.data?.oauth2_nonce;
    if (!accessToken) {
        throw new Error("No access token found in session");
    }
    return createApiClient(undefined, accessToken);
};