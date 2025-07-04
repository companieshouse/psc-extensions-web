import { Session } from "@companieshouse/node-session-handler";
import { SessionKey } from "@companieshouse/node-session-handler/lib/session/keys/SessionKey";
import { SignInInfoKeys } from "@companieshouse/node-session-handler/lib/session/keys/SignInInfoKeys";
import { UserProfileKeys } from "@companieshouse/node-session-handler//lib/session/keys/UserProfileKeys";
import { ISignInInfo } from "@companieshouse/node-session-handler/lib/session/model/SessionInterfaces";

const getSignInInfo = (session: Session | undefined): ISignInInfo | undefined => {
    return session?.data?.[SessionKey.SignInInfo];
};

export const getUserEmail = (session: Session | undefined): string => {
    const signInInfo = getSignInInfo(session);
    return signInInfo?.[SignInInfoKeys.UserProfile]?.[UserProfileKeys.Email] as string;
};

export const twoWeeksFromNow = (): Date => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 14); // Add 14 days
    return currentDate;
};
