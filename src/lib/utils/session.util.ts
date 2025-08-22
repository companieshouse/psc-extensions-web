import {Session} from "@companieshouse/node-session-handler";
import {AccessTokenKeys} from "@companieshouse/node-session-handler/lib/session/keys/AccessTokenKeys";
import {SessionKey} from "@companieshouse/node-session-handler/lib/session/keys/SessionKey";
import {SignInInfoKeys} from "@companieshouse/node-session-handler/lib/session/keys/SignInInfoKeys";
import {UserProfileKeys} from "@companieshouse/node-session-handler//lib/session/keys/UserProfileKeys";
import {ISignInInfo} from "@companieshouse/node-session-handler/lib/session/model/SessionInterfaces";

const getSignInInfo = (session: Session | undefined): ISignInInfo | undefined => {
    return session?.data?.[SessionKey.SignInInfo];
};

export const getUserEmail = (session: Session | undefined): string => {
    const signInInfo = getSignInInfo(session);
    return signInInfo?.[SignInInfoKeys.UserProfile]?.[UserProfileKeys.Email] as string;
};

export function getAccessToken(session: Session): string {
    const signInInfo = getSignInInfo(session);
    return signInInfo?.[SignInInfoKeys.AccessToken]?.[AccessTokenKeys.AccessToken] as string;
}
