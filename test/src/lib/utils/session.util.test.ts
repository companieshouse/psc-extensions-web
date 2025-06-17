import { getUserEmail } from "../../../../src/lib/utils/session.util";
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

    describe("getUserEmail", () => {
        it("should return the user email from the session", () => {
            const userEmail = getUserEmail(mockSession as Session);
            expect(userEmail).toBe("test@example.com");
        });

        it("should return undefined if user email is missing", () => {
            if (mockSession.data && mockSession.data[SessionKey.SignInInfo]) {
                delete mockSession.data[SessionKey.SignInInfo].user_profile;
            }
            const userEmail = getUserEmail(mockSession as Session);
            expect(userEmail).toBe(undefined);
        });
    });
});
