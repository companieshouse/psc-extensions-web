import {createApiClient} from "@companieshouse/api-sdk-node";
import ApiClient from "@companieshouse/api-sdk-node/dist/client";
import {Session} from "@companieshouse/node-session-handler";

export const createOAuthApiClient = (session: Session): ApiClient => {
    const accessToken = session?.data?.oauth2_nonce;
    if (!accessToken) {
        throw new Error("No access token found in session");
    }
    return createApiClient(undefined, accessToken);
};