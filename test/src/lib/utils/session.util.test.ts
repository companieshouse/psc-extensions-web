import { getUserEmailAddress } from "../../../../src/lib/utils/session.util";
import { Session } from "@companieshouse/node-session-handler";
import { SessionKey } from "@companieshouse/node-session-handler/lib/session/keys/SessionKey";
import { SignInInfoKeys } from "@companieshouse/node-session-handler/lib/session/keys/SignInInfoKeys";

describe("session utils", () => {
    let mockSession: Partial<Session>;

    beforeEach(() => {
        mockSession = {
            data: {
                [SessionKey.SignInInfo]: {
                    [SignInInfoKeys.AccessToken]: {
                        [SignInInfoKeys.AccessToken]: "mockAccessToken"
                    },
                    /* eslint-disable @typescript-eslint/camelcase */
                    user_profile: {
                        email: "test@example.com"
                    }
                }
            }
        };
    });

    describe("getUserEmailAddress", () => {
        it("should return the user email address from the session", () => {
            const userEmailAddress = getUserEmailAddress(mockSession as Session);
            expect(userEmailAddress).toBe("test@example.com");
        });

        it("should return undefined if user email address is missing", () => {
            if (mockSession.data && mockSession.data[SessionKey.SignInInfo]) {
                delete mockSession.data[SessionKey.SignInInfo].user_profile;
            }
            const userEmailAddress = getUserEmailAddress(mockSession as Session);
            expect(userEmailAddress).toBe(undefined);
        });
    });
});
