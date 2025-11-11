import { Request } from "express";
import { Session } from "@companieshouse/node-session-handler";
import { getSessionValue, saveDataInSession } from "../../../../src/lib/utils/sessionHelper";

describe("sessionHelper", () => {
    let mockRequest: Partial<Request>;
    let mockSession: Partial<Session>;

    beforeEach(() => {
        mockSession = {
            setExtraData: jest.fn(),
            getExtraData: jest.fn()
        };

        mockRequest = {
            session: mockSession as Session
        };
    });

    describe("saveDataInSession", () => {
        it("should save data in session successfully", async () => {
            const testName = "testKey";
            const testValue = "testValue";

            await saveDataInSession(mockRequest as Request, testName, testValue);

            expect(mockSession.setExtraData).toHaveBeenCalledWith(testName, testValue);
        });

        it("should throw error when session is not available", async () => {
            mockRequest.session = undefined;

            await expect(saveDataInSession(mockRequest as Request, "key", "value"))
                .rejects.toThrow("Session not available");
        });
    });

    describe("getSessionValue", () => {
        it("should retrieve data from session successfully", async () => {
            const testName = "testKey";
            const expectedValue = "testValue";
            (mockSession.getExtraData as jest.Mock).mockReturnValue(expectedValue);

            const result = await getSessionValue(mockRequest as Request, testName);

            expect(mockSession.getExtraData).toHaveBeenCalledWith(testName);
            expect(result).toBe(expectedValue);
        });

        it("should return null when session is not available", async () => {
            mockRequest.session = undefined;

            const result = await getSessionValue(mockRequest as Request, "key");

            expect(result).toBeNull();
        });

        it("should return undefined when key does not exist in session", async () => {
            (mockSession.getExtraData as jest.Mock).mockReturnValue(undefined);

            const result = await getSessionValue(mockRequest as Request, "nonExistentKey");

            expect(mockSession.getExtraData).toHaveBeenCalledWith("nonExistentKey");
            expect(result).toBeUndefined();
        });
    });
});
